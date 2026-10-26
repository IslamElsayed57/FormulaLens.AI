import { strict as assert } from 'assert';
import {
  initI18n,
  t,
  translateCosmeticFunction,
  translateCirStatus,
  translateSensitizing,
  translateEvidenceStatus,
  formatIngredientFunctions,
  getPregnancySuitability,
  getSkinSuitabilityLabel
} from '../js/utils/i18n.js';

async function runI18nTests() {
  console.log('=== FormulaLens AI i18n & Domain Translation Tests ===\n');

  // Test 1: Arabic locale initialization
  await initI18n('ar');
  assert.equal(t('nav.dashboard'), 'لوحة التحكم');
  assert.equal(t('nav.analyzer'), 'تحليل التركيبة');
  assert.equal(t('nav.compare'), 'مقارنة المنتجات');
  assert.equal(t('nav.library'), 'موسوعة المكونات');
  assert.equal(t('nav.section_main'), 'المختبر والتحليل');
  assert.equal(t('nav.section_science'), 'المعرفة والملف الشخصي');
  console.log('  [PASS] Navigation and section labels translate to Arabic');

  // Test 2: Cosmetic functions
  assert.equal(translateCosmeticFunction('Skin conditioning', true), 'مكيف للبشرة');
  assert.equal(translateCosmeticFunction('Humectant', true), 'مرطب جذاب للماء');
  assert.equal(translateCosmeticFunction('Sebum regulating', true), 'تنظيم إفراز الدهون');
  assert.equal(translateCosmeticFunction('Anti-aging', true), 'مقاوم للتجاعيد وعلامات التقدم في السن');
  assert.equal(translateCosmeticFunction('Skin conditioning', false), 'Skin conditioning');
  console.log('  [PASS] Cosmetic functions correctly translated');

  // Test 3: CIR status
  assert.equal(translateCirStatus('Safe as used in cosmetics', true), 'آمن وفق الاستخدام المتبع في مستحضرات التجميل');
  assert.equal(translateCirStatus('Safe with qualifications', true), 'آمن مع اشتراطات محددة');
  assert.equal(translateCirStatus('Safe with concentration limits (typically <= 1%)', true), 'آمن ضمن حدود التركيز الموصى بها (غالباً ≤ 1%)');
  assert.equal(translateCirStatus('Safe in cosmetic use', true), 'آمن للاستخدام التجميلي');
  assert.equal(translateCirStatus('Safe as used in cosmetics', false), 'Safe as used in cosmetics');
  console.log('  [PASS] CIR safety status correctly translated');

  // Test 4: Sensitizing & Evidence status
  assert.equal(translateSensitizing('high', true), 'مرتفع');
  assert.equal(translateSensitizing('moderate', true), 'متوسط');
  assert.equal(translateSensitizing('low', true), 'منخفض');
  assert.equal(translateEvidenceStatus('verified', true), 'مؤكد علمياً');
  console.log('  [PASS] Sensitizing and evidence status correctly translated');

  // Test 5: Ingredient format functions
  const sampleIngWithAr = {
    functions: ['Skin conditioning', 'Smoothing'],
    functionsAr: ['مكيف للبشرة', 'منعم']
  };
  assert.equal(formatIngredientFunctions(sampleIngWithAr, true, 2), 'مكيف للبشرة، منعم');
  assert.equal(formatIngredientFunctions(sampleIngWithAr, false, 2), 'Skin conditioning, Smoothing');

  const sampleIngWithoutAr = {
    functions: ['Humectant', 'Soothing']
  };
  assert.equal(formatIngredientFunctions(sampleIngWithoutAr, true, 2), 'مرطب جذاب للماء، مهدئ للبشرة المتهيجة');
  console.log('  [PASS] formatIngredientFunctions works with both functionsAr and auto-translated fallback');

  // Test 6: Pregnancy suitability
  const pregSafe = getPregnancySuitability({ pregnancySafe: true }, false);
  assert.equal(pregSafe.text, 'Pregnancy: Safe');
  assert.equal(pregSafe.badgeType, 'mint');

  const pregAvoid = getPregnancySuitability({ pregnancySafe: false }, false);
  assert.equal(pregAvoid.text, 'Pregnancy: Avoid');
  assert.equal(pregAvoid.badgeType, 'rose');

  const pregSafeAr = getPregnancySuitability({ pregnancySafe: true }, true);
  assert.equal(pregSafeAr.text, 'الحمل: آمن');

  const pregAvoidAr = getPregnancySuitability({ pregnancySafe: false }, true);
  assert.equal(pregAvoidAr.text, 'الحمل: تجنب');
  console.log('  [PASS] Pregnancy suitability formatted correctly in EN and AR');

  // Test 7: Skin type suitability
  const suitAll = { oily: 'safe', dry: 'safe', sensitive: 'safe', acneProne: 'safe', rosacea: 'safe' };
  assert.equal(getSkinSuitabilityLabel(suitAll, false), 'Skin: All');
  assert.equal(getSkinSuitabilityLabel(suitAll, true), 'البشرة: الكل');

  const suitRetinol = { oily: 'beneficial', dry: 'caution', sensitive: 'caution', acneProne: 'beneficial', rosacea: 'avoid' };
  assert.equal(getSkinSuitabilityLabel(suitRetinol, false), 'Skin: Oily, Acne');
  assert.equal(getSkinSuitabilityLabel(suitRetinol, true), 'البشرة: دهنية، حبوب');
  console.log('  [PASS] Skin suitability formatted correctly (All vs specific types)');

  console.log('\nALL i18n & TRANSLATION TESTS PASSED!');
}

runI18nTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
