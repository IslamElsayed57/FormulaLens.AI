/**
 * Live, bounded literature lookup for ingredients not found in the local dataset.
 * Europe PMC returns bibliographic records and abstracts; these are stored as
 * pending research and are never promoted to the trusted ingredient dataset.
 */

import { getAllRecords, putRecord } from '../database/indexeddb.js';

const SEARCH_ENDPOINT = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search';
const PUBMED_ENDPOINT = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
const PUBMED_SUMMARY_ENDPOINT = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';
const CROSSREF_ENDPOINT = 'https://api.crossref.org/works';
const PUBCHEM_ENDPOINT = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name';
const MAX_RESULTS_PER_INGREDIENT = 3;
const SEARCH_CONCURRENCY = 3;
const REQUEST_TIMEOUT_MS = 20000;
const CACHE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

async function fetchJson(url, signal, sourceName) {
  const controller = new AbortController();
  let timedOut = false;
  const timeoutId = setTimeout(() => { timedOut = true; controller.abort(); }, REQUEST_TIMEOUT_MS);
  const abortRequest = () => controller.abort();
  if (signal?.aborted) abortRequest();
  else signal?.addEventListener('abort', abortRequest, { once: true });
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal });
    if (!response.ok) throw new Error(`${sourceName} returned HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    if (signal?.aborted) throw new DOMException('Research cancelled', 'AbortError');
    if (timedOut) throw new Error(`${sourceName} request timed out`);
    throw error;
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', abortRequest);
  }
}

function cleanText(value, limit = 2400) {
  return typeof value === 'string' ? value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, limit) : '';
}

function articleUrl(article) {
  if (article.source === 'MED' && article.pmid) return `https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(article.pmid)}/`;
  if (article.doi) return `https://doi.org/${article.doi.split('/').map(encodeURIComponent).join('/')}`;
  return `https://europepmc.org/article/${encodeURIComponent(article.source || 'MED')}/${encodeURIComponent(article.id || '')}`;
}

async function searchIngredient(name, signal) {
  const query = `"${name.replace(/["\\]/g, ' ')}" AND (cosmetic OR skin OR dermal OR topical)`;
  const url = new URL(SEARCH_ENDPOINT);
  url.searchParams.set('query', query);
  url.searchParams.set('format', 'json');
  url.searchParams.set('synonym', 'true');
  url.searchParams.set('resultType', 'core');
  url.searchParams.set('pageSize', String(MAX_RESULTS_PER_INGREDIENT));
  url.searchParams.set('sort', 'RELEVANCE');

  const controller = new AbortController();
  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  const abortRequest = () => controller.abort();
  if (signal?.aborted) abortRequest();
  else signal?.addEventListener('abort', abortRequest, { once: true });
  let response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal });
  } catch (error) {
    if (signal?.aborted) throw new DOMException('Research cancelled', 'AbortError');
    if (timedOut) throw new Error('Europe PMC request timed out');
    throw error;
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', abortRequest);
  }
  if (!response.ok) throw new Error(`Europe PMC returned HTTP ${response.status}`);
  const data = await response.json();
  const results = data?.resultList?.result;
  if (!Array.isArray(results)) return [];

  return results.map((article) => ({
    sourceId: 'europe_pmc',
    sourceName: 'Europe PMC',
    sourceUrl: articleUrl(article),
    sourceRecordId: `${article.source || 'MED'}:${article.id || article.pmid || article.doi || ''}`,
    title: cleanText(article.title, 500),
    authors: cleanText(article.authorString, 500),
    journal: cleanText(article.journalTitle || article.journalInfo?.journal?.title, 250),
    year: cleanText(article.firstPublicationDate || article.pubYear, 20),
    doi: cleanText(article.doi, 200),
    pmid: cleanText(article.pmid, 30),
    abstract: cleanText(article.abstractText),
    publicationType: cleanText([].concat(article.pubTypeList?.pubType || []).join(', '), 250),
  })).filter(article => article.title && !article.sourceRecordId.endsWith(':'));
}

async function searchPubMed(name, signal) {
  const searchUrl = new URL(PUBMED_ENDPOINT);
  searchUrl.searchParams.set('db', 'pubmed');
  searchUrl.searchParams.set('term', `"${name}" AND (cosmetic OR skin OR dermal OR topical)`);
  searchUrl.searchParams.set('retmode', 'json');
  searchUrl.searchParams.set('retmax', String(MAX_RESULTS_PER_INGREDIENT));
  const searchData = await fetchJson(searchUrl, signal, 'PubMed');
  const ids = searchData?.esearchresult?.idlist || [];
  if (!ids.length) return [];
  const summaryUrl = new URL(PUBMED_SUMMARY_ENDPOINT);
  summaryUrl.searchParams.set('db', 'pubmed');
  summaryUrl.searchParams.set('id', ids.join(','));
  summaryUrl.searchParams.set('retmode', 'json');
  const data = await fetchJson(summaryUrl, signal, 'PubMed');
  return ids.map(id => {
    const item = data?.result?.[id] || {};
    return {
      sourceId: 'pubmed', sourceName: 'PubMed', sourceUrl: `https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(id)}/`,
      sourceRecordId: `PMID:${id}`, title: cleanText(item.title, 500),
      authors: cleanText((item.authors || []).map(author => author.name).join(', '), 500),
      journal: cleanText(item.fulljournalname || item.source, 250), year: cleanText(item.pubdate, 20),
      doi: '', pmid: id, abstract: '', publicationType: '',
    };
  }).filter(item => item.title);
}

async function searchCrossref(name, signal) {
  const url = new URL(CROSSREF_ENDPOINT);
  url.searchParams.set('query.bibliographic', `${name} cosmetic skin dermal topical`);
  url.searchParams.set('rows', String(MAX_RESULTS_PER_INGREDIENT));
  url.searchParams.set('select', 'DOI,title,author,container-title,published,published-print,published-online,type,URL');
  const data = await fetchJson(url, signal, 'Crossref');
  return (data?.message?.items || []).map(item => {
    const parts = item.published?.['date-parts']?.[0] || item['published-print']?.['date-parts']?.[0] || item['published-online']?.['date-parts']?.[0] || [];
    const doi = item.DOI || '';
    return {
      sourceId: 'crossref', sourceName: 'Crossref', sourceUrl: doi ? `https://doi.org/${doi}` : (item.URL || ''),
      sourceRecordId: doi ? `DOI:${doi}` : '', title: cleanText((item.title || [])[0], 500),
      authors: cleanText((item.author || []).map(author => [author.given, author.family].filter(Boolean).join(' ')).join(', '), 500),
      journal: cleanText((item['container-title'] || [])[0], 250), year: parts[0] ? String(parts[0]) : '',
      doi, pmid: '', abstract: '', publicationType: cleanText(item.type, 100),
    };
  }).filter(item => item.title && item.sourceRecordId);
}

async function searchPubChem(name, signal) {
  const url = new URL(`${PUBCHEM_ENDPOINT}/${encodeURIComponent(name)}/property/IUPACName,MolecularFormula/JSON`);
  const data = await fetchJson(url, signal, 'PubChem');
  return (data?.PropertyTable?.Properties || []).slice(0, 1).map(item => ({
    sourceId: 'pubchem', sourceName: 'PubChem', sourceUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${encodeURIComponent(item.CID)}`,
    sourceRecordId: `CID:${item.CID}`, title: `${name} — PubChem compound record`, authors: '', journal: 'PubChem',
    year: '', doi: '', pmid: '', abstract: cleanText([item.IUPACName, item.MolecularFormula && `Molecular formula: ${item.MolecularFormula}`].filter(Boolean).join('. ')),
    publicationType: 'Chemical identity record',
  }));
}

async function searchFallbackSources(name, signal) {
  const results = [];
  const errors = [];
  for (const [source, search] of [['PubMed', searchPubMed], ['Crossref', searchCrossref], ['PubChem', searchPubChem]]) {
    try {
      const items = await search(name, signal);
      results.push(...items);
      if (items.length && source !== 'PubChem') break;
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      errors.push({ source, message: error.message });
    }
  }
  return { results, errors };
}

/** Search unmatched names and persist the returned literature leads locally. */
export async function researchUnmatchedIngredients(unmatchedIngredients, { signal, onProgress } = {}) {
  const uniqueNames = [...new Map((unmatchedIngredients || [])
    .map(item => item.cleanName || item.rawName || String(item))
    .map(name => [name.toLowerCase().trim(), name.trim()]))
    .values()].filter(Boolean);
  const namesToSearch = uniqueNames;
  const byIngredient = {};
  const errors = [];
  const cachedResearch = await getAllRecords('research_records').catch(() => []);
  const freshCache = new Map();
  for (const record of cachedResearch) {
    const key = record.ingredientName?.toLowerCase().trim();
    if (!key || !['europe_pmc', 'pubmed', 'crossref', 'pubchem'].includes(record.sourceId) || Date.now() - new Date(record.retrievedAt || 0).getTime() >= CACHE_MAX_AGE_MS) continue;
    if (!freshCache.has(key)) freshCache.set(key, []);
    freshCache.get(key).push(record);
  }

  let completed = 0;
  let nextIndex = 0;
  async function processNext() {
    while (nextIndex < namesToSearch.length) {
      if (signal?.aborted) throw new DOMException('Research cancelled', 'AbortError');
      const name = namesToSearch[nextIndex++];
      onProgress?.(completed, namesToSearch.length, name);
    const cached = freshCache.get(name.toLowerCase().trim()) || [];
    if (cached.length) {
      byIngredient[name] = cached.map(record => ({
        sourceId: record.sourceId,
        sourceName: record.sourceName,
        sourceUrl: record.sourceUrl,
        sourceRecordId: record.sourceRecordId,
        title: record.title,
        authors: record.authors,
        journal: record.journal,
        year: record.year,
        doi: record.doi,
        pmid: record.pmid,
        abstract: record.abstract,
        publicationType: record.publicationType,
        cached: true,
      }));
      completed++;
      onProgress?.(completed, namesToSearch.length, name);
      continue;
    }
    try {
      let articles = [];
      try {
        articles = await searchIngredient(name, signal);
      } catch (primaryError) {
        if (primaryError.name === 'AbortError') throw primaryError;
        errors.push({ ingredientName: name, source: 'Europe PMC', message: primaryError.message });
      }
      if (!articles.length) {
        const fallback = await searchFallbackSources(name, signal);
        articles = fallback.results;
        errors.push(...fallback.errors.map(error => ({ ingredientName: name, ...error })));
      }
      articles = [...new Map(articles.map(article => [article.sourceRecordId, article])).values()].slice(0, MAX_RESULTS_PER_INGREDIENT);
      byIngredient[name] = articles;
      for (const article of articles) {
        const record = {
          id: `research_${encodeURIComponent(`${name}|${article.sourceRecordId}`).replace(/%/g, '_')}`,
          ingredientName: name,
          sourceId: article.sourceId,
          sourceName: article.sourceName,
          sourceUrl: article.sourceUrl,
          sourceRecordId: article.sourceRecordId,
          title: article.title,
          authors: article.authors,
          journal: article.journal,
          year: article.year,
          doi: article.doi,
          pmid: article.pmid,
          abstract: article.abstract,
          publicationType: article.publicationType,
          evidenceStatus: 'pending_research',
          verificationStatus: 'pending_research',
          retrievalMethod: `${article.sourceName} public API`,
          retrievedAt: new Date().toISOString(),
        };
        await putRecord('research_records', record);
      }
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      errors.push({ ingredientName: name, source: 'research workflow', message: error.message });
      byIngredient[name] = [];
    }
      completed++;
      onProgress?.(completed, namesToSearch.length, name);
    }
  }
  await Promise.all(Array.from({ length: Math.min(SEARCH_CONCURRENCY, namesToSearch.length) }, () => processNext()));

  return {
    sourceId: 'multi_source',
    searchStatus: errors.length ? (Object.values(byIngredient).some(items => items.length) ? 'partial' : 'failed') : 'complete',
    searchedNames: namesToSearch,
    skippedNames: [],
    byIngredient,
    errors,
    retrievedCount: Object.values(byIngredient).reduce((total, items) => total + items.length, 0),
  };
}
