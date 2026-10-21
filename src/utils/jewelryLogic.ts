export type MomentCategory = 'all' | 'bridal' | 'daily' | 'vault';

export interface DigitalPassport {
  passportId: string;
  goldOrigin: string;
  goldPurity: string;
  stoneOrigin: string;
  mineOrLabLocation: string;
  giaCertificateId: string;
  cutScore: string;
  benchArtisan: string;
  carbonOffsetKg: number;
}

export interface JewelryProduct {
  id: string;
  name: string;
  subtitle: string;
  category: Exclude<MomentCategory, 'all'>;
  categoryLabel: string;
  price: number;
  traditionalRetailPrice: number;
  karat: string;
  stoneSpec: string;
  image: string;
  secondaryImage: string;
  isOneOfAKind?: boolean;
  claimedCount?: string;
  rating: number;
  reviewCount: number;
  description: string;
  availableSizes: string[];
  availableMetals: string[];
  styleTags: {
    skinTones: ('warm' | 'cool' | 'neutral')[];
    wardrobes: ('minimalist' | 'romantic' | 'avant-garde')[];
    lifestyles: ('never-take-off' | 'milestone' | 'collector')[];
    chapters: ('bridal' | 'self-milestone' | 'heirloom-gift')[];
  };
  passport: DigitalPassport;
}

export interface BespokeConfig {
  origin: 'mined' | 'lab';
  cut: 'oval' | 'emerald' | 'solitaire-round' | 'cushion' | 'pear';
  carat: number;
  setting: 'whisper-pave' | 'cathedral-solitaire' | 'vintage-halo' | 'bezel-heirloom';
  metal: '18k-yellow' | '18k-white' | '18k-champagne' | 'platinum-950';
  ringSize: string;
  engraving: string;
}

export interface BespokeQuote {
  atelierPrice: number;
  traditionalBoutiquePrice: number;
  savingsAmount: number;
  savingsPercent: number;
  estimatedCompletionWeeks: number;
  waxPreviewShipDays: number;
  giaGradeSummary: string;
}

export interface BespokeBookingInput {
  fullName: string;
  email: string;
  consultationType: 'virtual' | 'in-person';
  shippingAddress: string;
  notes?: string;
}

export interface QuizAnswers {
  skinTone: 'warm' | 'cool' | 'neutral';
  wardrobe: 'minimalist' | 'romantic' | 'avant-garde';
  lifestyle: 'never-take-off' | 'milestone' | 'collector';
  chapter: 'bridal' | 'self-milestone' | 'heirloom-gift';
}

export interface QuizCurationResult {
  personaTitle: string;
  personaSubtitle: string;
  recommendedMetal: string;
  stylingNote: string;
  promoCode: string;
  discountPercent: number;
  recommendedProducts: JewelryProduct[];
}

export interface CartItem {
  product: JewelryProduct;
  selectedMetal: string;
  selectedSize: string;
  quantity: number;
  customEngraving?: string;
}

export interface BagTotals {
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  traditionalRetailEquivalent: number;
  totalSavingsVsRetail: number;
  appliedPromo: string | null;
}

export const INITIAL_PRODUCTS: JewelryProduct[] = [
  {
    id: 'lumiere-oval-pave',
    name: 'The Lumière Oval Pavé',
    subtitle: 'Whisper-thin micro-pavé cathedral engagement ring',
    category: 'bridal',
    categoryLabel: 'Bridal & Forever Rings',
    price: 4850,
    traditionalRetailPrice: 11200,
    karat: '18k Solid Champagne Gold',
    stoneSpec: '1.80ct GIA E-VVS1 Ideal Oval Diamond',
    image: 'assets/jewelry/eternity-pave-rings.png?v=2',
    secondaryImage: 'assets/jewelry/rings-stone.png?v=2',
    rating: 5.0,
    reviewCount: 214,
    description:
      'Engineered for maximum light return with a 360-degree hidden halo and hand-forged 1.6mm solid 18k band that allows flush wedding band stacking.',
    availableSizes: ['4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0'],
    availableMetals: ['18k Champagne Gold', '18k Solid Yellow Gold', '18k Recycled White Gold', 'Platinum 950'],
    styleTags: {
      skinTones: ['warm', 'neutral', 'cool'],
      wardrobes: ['romantic', 'minimalist'],
      lifestyles: ['milestone', 'never-take-off'],
      chapters: ['bridal', 'heirloom-gift'],
    },
    passport: {
      passportId: 'PASS-BLG-9081',
      goldOrigin: '100% RJC-Certified Recycled 18k Bullion (Zurich Refinery #ZR-402)',
      goldPurity: '750‰ (18 Karat Solid Gold)',
      stoneOrigin: 'Canadamark™ Tracked Ethical Mine, Northwest Territories',
      mineOrLabLocation: 'Ekati Region, Canada -> Antwerp Cutting Studio',
      giaCertificateId: 'GIA-6492819042',
      cutScore: 'Top 0.4% Light Performance (Ideal Fire & Scintillation)',
      benchArtisan: 'Master Setter Henri V. (28 Years Bench Experience)',
      carbonOffsetKg: 145,
    },
  },
  {
    id: 'celeste-solitaire-dome',
    name: 'The Céleste Mirror Bezel & Cabochon Duo',
    subtitle: 'Architectural sculpted 18k gold heirloom bridal & statement set',
    category: 'bridal',
    categoryLabel: 'Bridal & Forever Rings',
    price: 3950,
    traditionalRetailPrice: 8900,
    karat: '18k Solid Yellow Gold',
    stoneSpec: '1.50ct GIA D-IF Asscher & Emerald Cut Pairing',
    image: 'assets/jewelry/emerald-dome-ring.png?v=2',
    secondaryImage: 'assets/jewelry/rings-stone.png?v=2',
    rating: 4.9,
    reviewCount: 142,
    description:
      'Low-profile architectural bezel construction that protects the girdle while amplifying brilliance through an open gallery pavilion.',
    availableSizes: ['4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0'],
    availableMetals: ['18k Solid Yellow Gold', '18k Champagne Gold', 'Platinum 950'],
    styleTags: {
      skinTones: ['warm', 'neutral'],
      wardrobes: ['minimalist', 'avant-garde'],
      lifestyles: ['never-take-off', 'milestone'],
      chapters: ['bridal', 'self-milestone'],
    },
    passport: {
      passportId: 'PASS-BLG-9082',
      goldOrigin: 'Single-Origin Fairmined Ecological 18k Gold',
      goldPurity: '750‰ (18 Karat Solid Gold)',
      stoneOrigin: 'Botanical Solar-Powered CVD Lab Diamond (Climate Neutral)',
      mineOrLabLocation: 'Geneva Precision Atelier',
      giaCertificateId: 'GIA-5182904411',
      cutScore: 'Top 0.8% Optical Symmetry',
      benchArtisan: 'Master Goldsmith Elena R.',
      carbonOffsetKg: 190,
    },
  },
  {
    id: 'soleil-layered-chains',
    name: 'The Soleil Layered Trio',
    subtitle: 'Waterproof 18k solid gold herringbone, box & pendant stack',
    category: 'daily',
    categoryLabel: 'The Daily Icons',
    price: 1680,
    traditionalRetailPrice: 3850,
    karat: '18k Solid Yellow Gold',
    stoneSpec: '0.35ct Total Weight Flush-Set Pavé Bar & Medallion',
    image: 'assets/jewelry/layered-necklaces.png?v=2',
    secondaryImage: 'assets/jewelry/coin-pendant.png?v=2',
    rating: 4.9,
    reviewCount: 318,
    description:
      'Designed to be showered in, slept in, and never taken off. Hand-soldered solid 18k links with a custom anti-tangle swivel clasp.',
    availableSizes: ['16" / 18" / 20" Adjustable', '18" / 20" / 22" Adjustable'],
    availableMetals: ['18k Solid Yellow Gold', '18k Champagne Gold', '18k Recycled White Gold'],
    styleTags: {
      skinTones: ['warm', 'neutral'],
      wardrobes: ['minimalist', 'romantic'],
      lifestyles: ['never-take-off'],
      chapters: ['self-milestone', 'heirloom-gift'],
    },
    passport: {
      passportId: 'PASS-BLG-9083',
      goldOrigin: '100% Recycled 18k Fine Gold (Milan Assay Certified)',
      goldPurity: '750‰ (18 Karat Solid Gold — 14.2g Net Gold Weight)',
      stoneOrigin: 'Kimberley-Plus Audited Conflict-Free Melee Diamonds',
      mineOrLabLocation: 'Vicenza Chain Foundry & Atelier',
      giaCertificateId: 'GIA-2291048173',
      cutScore: 'Top 1% Ideal Melee Calibration',
      benchArtisan: 'Master Finisher Marco D.',
      carbonOffsetKg: 82,
    },
  },
  {
    id: 'aurelia-spring-drops',
    name: 'The Aurelia Sculpted Drops',
    subtitle: 'Hand-hammered 18k botanical gold leaf drop earrings',
    category: 'daily',
    categoryLabel: 'The Daily Icons',
    price: 980,
    traditionalRetailPrice: 2250,
    karat: '18k Solid Yellow Gold',
    stoneSpec: '24-Facet Satin & Mirror-Polished 18k Gold',
    image: 'assets/jewelry/spring-drops.png?v=2',
    secondaryImage: 'assets/jewelry/pearl-earring-portrait.png?v=2',
    rating: 5.0,
    reviewCount: 189,
    description:
      'Featherlight yet substantial in solid 18k gold, catching warm candlelight with every turn of the head. Engineered for zero earlobe fatigue.',
    availableSizes: ['Standard Drop (32mm)', 'Petite Drop (24mm)'],
    availableMetals: ['18k Solid Yellow Gold', '18k Champagne Gold'],
    styleTags: {
      skinTones: ['warm', 'neutral'],
      wardrobes: ['minimalist', 'romantic', 'avant-garde'],
      lifestyles: ['never-take-off', 'milestone'],
      chapters: ['self-milestone', 'heirloom-gift'],
    },
    passport: {
      passportId: 'PASS-BLG-9084',
      goldOrigin: '100% RJC-Certified Recycled 18k Gold',
      goldPurity: '750‰ (18 Karat Solid Gold — 8.4g Pair)',
      stoneOrigin: 'Pure Artisanal Gold Forging',
      mineOrLabLocation: 'Parisian Bench Workshop',
      giaCertificateId: 'GIA-8841209341',
      cutScore: 'Hand-Burnished Acoustic Polish',
      benchArtisan: 'Master Chaser Claire L.',
      carbonOffsetKg: 64,
    },
  },
  {
    id: 'imperial-padparadscha-signet',
    name: 'The Imperial Sunset Tourmaline & Chain Ring',
    subtitle: 'One-of-a-kind cushion-cut mandarin gemstone with articulated gold band',
    category: 'vault',
    categoryLabel: 'One-of-a-Kind Gemstones',
    price: 3450,
    traditionalRetailPrice: 7900,
    karat: '18k Solid Champagne Gold',
    stoneSpec: '2.45ct Unheated Madagascar Mandarin Spessartite & Tourmaline',
    image: 'assets/jewelry/imperial-cushion-ring.png?v=2',
    secondaryImage: 'assets/jewelry/signet-chain-ring.png?v=2',
    isOneOfAKind: true,
    claimedCount: '1 of 1 Vault Edition',
    rating: 5.0,
    reviewCount: 64,
    description:
      'Once this stone is claimed, it is never replicated. Set in a hand-carved 18k champagne gold bezel paired with a supple solid-gold sphere eternity band.',
    availableSizes: ['5.0', '5.5', '6.0', '6.5', '7.0 (Complimentary Custom Sizing)'],
    availableMetals: ['18k Champagne Gold'],
    styleTags: {
      skinTones: ['warm', 'neutral', 'cool'],
      wardrobes: ['avant-garde', 'romantic'],
      lifestyles: ['collector', 'milestone'],
      chapters: ['heirloom-gift', 'self-milestone'],
    },
    passport: {
      passportId: 'PASS-BLG-9085',
      goldOrigin: '100% Traceable Fairmined 18k Gold',
      goldPurity: '750‰ (18 Karat Solid Gold)',
      stoneOrigin: 'Artisanal Alluvial Deposit, Southern Madagascar',
      mineOrLabLocation: 'Antananarivo -> Geneva Gemological Lab',
      giaCertificateId: 'GIA-7739104582',
      cutScore: 'Rare Unheated Natural Saturation (Top 0.2%)',
      benchArtisan: 'Master Lapidary & Setter Julian K.',
      carbonOffsetKg: 160,
    },
  },
  {
    id: 'aphrodite-robelite-shell',
    name: 'The Aphrodite Rubellite Cabochon Drops',
    subtitle: 'Matched pair of natural rose rubellite tourmalines in 18k hammered bezels',
    category: 'vault',
    categoryLabel: 'One-of-a-Kind Gemstones',
    price: 2890,
    traditionalRetailPrice: 6400,
    karat: '18k Solid Yellow Gold',
    stoneSpec: '4.80ctw Matched Brazilian Rubellite Tourmaline Pair',
    image: 'assets/jewelry/ruby-shell.png?v=2',
    secondaryImage: 'assets/jewelry/editorial-gemstone.png?v=2',
    isOneOfAKind: true,
    claimedCount: '1 of 1 Vault Edition',
    rating: 4.9,
    reviewCount: 51,
    description:
      'Three years in the making to source two naturally matching pear-shaped rubellites with identical internal silk and electric rose fire.',
    availableSizes: ['One Size (Articulated 18k French Earwire)'],
    availableMetals: ['18k Solid Yellow Gold'],
    styleTags: {
      skinTones: ['cool', 'neutral', 'warm'],
      wardrobes: ['romantic', 'avant-garde'],
      lifestyles: ['collector', 'milestone'],
      chapters: ['heirloom-gift', 'self-milestone', 'bridal'],
    },
    passport: {
      passportId: 'PASS-BLG-9086',
      goldOrigin: '100% Recycled 18k Gold Bullion',
      goldPurity: '750‰ (18 Karat Solid Gold)',
      stoneOrigin: 'Minas Gerais Family Cooperative, Brazil',
      mineOrLabLocation: 'Minas Gerais -> Idar-Oberstein Lapidary',
      giaCertificateId: 'GIA-3390184729',
      cutScore: 'Bespoke Old-World Pear Rose Cut',
      benchArtisan: 'Master Setter Henri V.',
      carbonOffsetKg: 130,
    },
  },
];

export function filterProductsByCategory(
  products: JewelryProduct[],
  category: MomentCategory,
  searchQuery = ''
): JewelryProduct[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return products.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.subtitle.toLowerCase().includes(normalizedQuery) ||
      item.stoneSpec.toLowerCase().includes(normalizedQuery) ||
      item.passport.giaCertificateId.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function calculateBespokeQuote(config: BespokeConfig): BespokeQuote {
  const carat = Math.max(0.5, Math.min(5.0, config.carat));

  // Base stone rate per carat (zero traditional markup)
  const basePerCarat = config.origin === 'mined' ? 2850 : 1380;
  // Non-linear rarity multiplier for larger single stones
  const rarityFactor = 1 + Math.pow(carat - 0.8, 1.35) * 0.42;
  const stoneCost = Math.round(carat * basePerCarat * rarityFactor);

  const cutPremiums: Record<BespokeConfig['cut'], number> = {
    oval: 220,
    emerald: 280,
    'solitaire-round': 180,
    cushion: 240,
    pear: 260,
  };

  const settingCosts: Record<BespokeConfig['setting'], number> = {
    'cathedral-solitaire': 780,
    'bezel-heirloom': 940,
    'whisper-pave': 1180,
    'vintage-halo': 1390,
  };

  const metalAdjustments: Record<BespokeConfig['metal'], number> = {
    '18k-yellow': 0,
    '18k-champagne': 90,
    '18k-white': 110,
    'platinum-950': 290,
  };

  const atelierPrice =
    Math.round((stoneCost + cutPremiums[config.cut] + settingCosts[config.setting] + metalAdjustments[config.metal]) / 10) * 10;

  const traditionalBoutiquePrice = Math.round((atelierPrice * 2.32) / 50) * 50;
  const savingsAmount = traditionalBoutiquePrice - atelierPrice;
  const savingsPercent = Math.round((savingsAmount / traditionalBoutiquePrice) * 100);

  return {
    atelierPrice,
    traditionalBoutiquePrice,
    savingsAmount,
    savingsPercent,
    estimatedCompletionWeeks: config.setting === 'vintage-halo' ? 4 : 3,
    waxPreviewShipDays: 3,
    giaGradeSummary:
      config.origin === 'mined'
        ? 'Top 1% GIA Natural Diamond · E-F Color · VVS1-VVS2 · Zero Fluorescence'
        : 'Top 1% GIA Type IIa Solar Lab Diamond · D-E Color · VVS1 · Ideal Cut',
  };
}

export function validateBespokeRequest(input: BespokeBookingInput): {
  valid: boolean;
  errors: Partial<Record<keyof BespokeBookingInput, string>>;
} {
  const errors: Partial<Record<keyof BespokeBookingInput, string>> = {};
  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name for your bespoke dossier.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.email = 'Please provide a valid email address for your 3D CAD renders.';
  }
  if (!input.shippingAddress || input.shippingAddress.trim().length < 6) {
    errors.shippingAddress = 'Please enter a delivery address for your complimentary 3D wax replica.';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function computeQuizCuration(
  answers: QuizAnswers,
  products: JewelryProduct[] = INITIAL_PRODUCTS
): QuizCurationResult {
  const scored = products.map((product) => {
    let score = 0;
    if (product.styleTags.skinTones.includes(answers.skinTone)) score += 2;
    if (product.styleTags.wardrobes.includes(answers.wardrobe)) score += 3;
    if (product.styleTags.lifestyles.includes(answers.lifestyle)) score += 4;
    if (product.styleTags.chapters.includes(answers.chapter)) score += 4;
    return { product, score };
  });

  scored.sort((a, b) => b.score - a.score || b.product.rating - a.product.rating);

  const recommendedMetal =
    answers.skinTone === 'warm'
      ? '18k Solid Yellow Gold & Champagne Gold'
      : answers.skinTone === 'cool'
      ? '18k Recycled White Gold & Platinum 950'
      : '18k Champagne Gold & Mixed-Metal Stacks';

  const personaMap: Record<QuizAnswers['wardrobe'], { title: string; subtitle: string; note: string }> = {
    minimalist: {
      title: 'The Architectural Purist',
      subtitle: 'Clean lines, tactile 18k gold weight, and quiet-luxury brilliance.',
      note: 'Your curation prioritizes low-profile bezels, mirror-polished gold surfaces, and effortless daily stacking.',
    },
    romantic: {
      title: 'The Modern Heirloom Romantic',
      subtitle: 'Maximum diamond fire, whisper-thin pavé galleries, and timeless silhouettes.',
      note: 'Your curation highlights top 1% light-return cuts and delicate hand-forged settings built to pass down.',
    },
    'avant-garde': {
      title: 'The Rare Vault Connoisseur',
      subtitle: 'Sculptural forms and unrepeatable, one-of-a-kind natural gemstones.',
      note: 'Your curation centers on museum-grade coloured stones and bold gallery geometry.',
    },
  };

  const persona = personaMap[answers.wardrobe];

  return {
    personaTitle: persona.title,
    personaSubtitle: persona.subtitle,
    recommendedMetal,
    stylingNote: persona.note,
    promoCode: 'HEIRLOOM10',
    discountPercent: 10,
    recommendedProducts: scored.slice(0, 3).map((s) => s.product),
  };
}

export function calculateBagTotals(items: CartItem[], promoCode?: string | null): BagTotals {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const traditionalRetailEquivalent = items.reduce(
    (sum, item) => sum + item.product.traditionalRetailPrice * item.quantity,
    0
  );

  const normalizedPromo = (promoCode || '').trim().toUpperCase();
  const isValidPromo =
    normalizedPromo === 'HEIRLOOM10' || normalizedPromo === 'INNERCIRCLE10' || normalizedPromo === 'VIP10';

  const discountAmount = isValidPromo ? Math.round(subtotal * 0.1) : 0;
  const shippingCost = 0; // Complimentary Insured Express Shipping
  const total = Math.max(0, subtotal - discountAmount + shippingCost);
  const totalSavingsVsRetail = Math.max(0, traditionalRetailEquivalent - total);

  return {
    itemCount,
    subtotal,
    discountAmount,
    shippingCost,
    total,
    traditionalRetailEquivalent,
    totalSavingsVsRetail,
    appliedPromo: isValidPromo ? normalizedPromo : null,
  };
}

export function lookupGiaCertificate(
  query: string,
  products: JewelryProduct[] = INITIAL_PRODUCTS
): JewelryProduct | null {
  const cleaned = query.trim().toUpperCase();
  if (!cleaned) return null;
  return (
    products.find(
      (p) =>
        p.passport.giaCertificateId.toUpperCase() === cleaned ||
        p.passport.passportId.toUpperCase() === cleaned ||
        p.passport.giaCertificateId.toUpperCase().endsWith(cleaned)
    ) || null
  );
}
