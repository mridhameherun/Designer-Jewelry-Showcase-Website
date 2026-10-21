import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_PRODUCTS,
  filterProductsByCategory,
  calculateBespokeQuote,
  validateBespokeRequest,
  computeQuizCuration,
  calculateBagTotals,
  lookupGiaCertificate,
} from './jewelryLogic';

test('filterProductsByCategory filters accurately by MomentCategory and search query', () => {
  const all = filterProductsByCategory(INITIAL_PRODUCTS, 'all');
  assert.equal(all.length, 6);

  const bridal = filterProductsByCategory(INITIAL_PRODUCTS, 'bridal');
  assert.equal(bridal.length, 2);
  assert.ok(bridal.every((p) => p.category === 'bridal'));

  const daily = filterProductsByCategory(INITIAL_PRODUCTS, 'daily');
  assert.equal(daily.length, 2);
  assert.ok(daily.every((p) => p.category === 'daily'));

  const vault = filterProductsByCategory(INITIAL_PRODUCTS, 'vault');
  assert.equal(vault.length, 2);
  assert.ok(vault.every((p) => p.isOneOfAKind === true));

  const searchMatch = filterProductsByCategory(INITIAL_PRODUCTS, 'all', 'Rubellite');
  assert.equal(searchMatch.length, 1);
  assert.equal(searchMatch[0].id, 'aphrodite-robelite-shell');
});

test('calculateBespokeQuote computes transparent zero-markup pricing and savings', () => {
  const minedQuote = calculateBespokeQuote({
    origin: 'mined',
    cut: 'oval',
    carat: 1.8,
    setting: 'whisper-pave',
    metal: '18k-champagne',
    ringSize: '6.0',
    engraving: 'Yours Forever',
  });

  const labQuote = calculateBespokeQuote({
    origin: 'lab',
    cut: 'oval',
    carat: 1.8,
    setting: 'whisper-pave',
    metal: '18k-champagne',
    ringSize: '6.0',
    engraving: 'Yours Forever',
  });

  assert.ok(minedQuote.atelierPrice > labQuote.atelierPrice);
  assert.ok(minedQuote.traditionalBoutiquePrice > minedQuote.atelierPrice * 2);
  assert.equal(
    minedQuote.savingsAmount,
    minedQuote.traditionalBoutiquePrice - minedQuote.atelierPrice
  );
  assert.equal(minedQuote.waxPreviewShipDays, 3);
});

test('validateBespokeRequest enforces required name, email, and wax shipping address', () => {
  const invalid = validateBespokeRequest({
    fullName: 'A',
    email: 'not-an-email',
    consultationType: 'virtual',
    shippingAddress: '123',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.shippingAddress);

  const valid = validateBespokeRequest({
    fullName: 'Clara Vance',
    email: 'clara@vance.co',
    consultationType: 'virtual',
    shippingAddress: '742 Madison Ave, Apt 8B, New York, NY 10065',
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('computeQuizCuration returns personalized persona, metal, 3 pieces, and HEIRLOOM10 promo', () => {
  const result = computeQuizCuration({
    skinTone: 'warm',
    wardrobe: 'romantic',
    lifestyle: 'milestone',
    chapter: 'bridal',
  });

  assert.equal(result.promoCode, 'HEIRLOOM10');
  assert.equal(result.discountPercent, 10);
  assert.equal(result.recommendedProducts.length, 3);
  assert.equal(result.recommendedProducts[0].id, 'lumiere-oval-pave');
  assert.ok(result.recommendedMetal.includes('18k'));
});

test('calculateBagTotals applies 10% HEIRLOOM10 discount and free insured shipping', () => {
  const sampleItem = {
    product: INITIAL_PRODUCTS[0], // $4850
    selectedMetal: '18k Champagne Gold',
    selectedSize: '6.0',
    quantity: 1,
  };

  const withoutPromo = calculateBagTotals([sampleItem], null);
  assert.equal(withoutPromo.subtotal, 4850);
  assert.equal(withoutPromo.discountAmount, 0);
  assert.equal(withoutPromo.shippingCost, 0);
  assert.equal(withoutPromo.total, 4850);

  const withPromo = calculateBagTotals([sampleItem], 'heur-invalid');
  assert.equal(withPromo.discountAmount, 0);

  const withValidPromo = calculateBagTotals([sampleItem], 'HEIRLOOM10');
  assert.equal(withValidPromo.discountAmount, 485);
  assert.equal(withValidPromo.total, 4365);
  assert.equal(withValidPromo.appliedPromo, 'HEIRLOOM10');
});

test('lookupGiaCertificate finds product by GIA certificate ID or Digital Passport ID', () => {
  const foundByGia = lookupGiaCertificate('GIA-6492819042');
  assert.ok(foundByGia);
  assert.equal(foundByGia.id, 'lumiere-oval-pave');

  const foundByPassport = lookupGiaCertificate('pass-blg-9085');
  assert.ok(foundByPassport);
  assert.equal(foundByPassport.id, 'imperial-padparadscha-signet');

  const missing = lookupGiaCertificate('NON-EXISTENT');
  assert.equal(missing, null);
});
