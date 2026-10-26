/**
 * Live, bounded literature lookup for ingredients not found in the local dataset.
 * Europe PMC returns bibliographic records and abstracts; these are stored as
 * pending research and are never promoted to the trusted ingredient dataset.
 */

import { getAllRecords, putRecord } from '../database/indexeddb.js';

const SEARCH_ENDPOINT = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search';
const MAX_RESULTS_PER_INGREDIENT = 3;
const SEARCH_CONCURRENCY = 3;
const REQUEST_TIMEOUT_MS = 9000;
const CACHE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

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

  let completed = 0;
  let nextIndex = 0;
  async function processNext() {
    while (nextIndex < namesToSearch.length) {
      if (signal?.aborted) throw new DOMException('Research cancelled', 'AbortError');
      const name = namesToSearch[nextIndex++];
      onProgress?.(completed, namesToSearch.length, name);
    const cached = cachedResearch.filter(record =>
      record.ingredientName?.toLowerCase().trim() === name.toLowerCase().trim()
      && record.sourceId === 'europe_pmc'
      && Date.now() - new Date(record.retrievedAt || 0).getTime() < CACHE_MAX_AGE_MS
    );
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
      const articles = await searchIngredient(name, signal);
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
          retrievalMethod: 'Europe PMC REST API',
          retrievedAt: new Date().toISOString(),
        };
        await putRecord('research_records', record);
      }
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      errors.push({ ingredientName: name, message: error.message });
      byIngredient[name] = [];
    }
      completed++;
      onProgress?.(completed, namesToSearch.length, name);
    }
  }
  await Promise.all(Array.from({ length: Math.min(SEARCH_CONCURRENCY, namesToSearch.length) }, () => processNext()));

  return {
    sourceId: 'europe_pmc',
    searchStatus: errors.length ? (Object.values(byIngredient).some(items => items.length) ? 'partial' : 'failed') : 'complete',
    searchedNames: namesToSearch,
    skippedNames: [],
    byIngredient,
    errors,
    retrievedCount: Object.values(byIngredient).reduce((total, items) => total + items.length, 0),
  };
}
