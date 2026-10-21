import React, { useState } from 'react';
import {
  CartItem,
  JewelryProduct,
  calculateBagTotals,
  lookupGiaCertificate,
} from '../utils/jewelryLogic';
import { X, ShieldCheck, Plus, Minus, Trash2, CheckCircle2, Search, Sparkles } from 'lucide-react';

interface ProductDetailModalProps {
  product: JewelryProduct | null;
  onClose: () => void;
  onAddToBag: (product: JewelryProduct, metal: string, size: string, engraving: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToBag,
}) => {
  if (!product) return null;

  const [selectedMetal, setSelectedMetal] = useState<string>(product.availableMetals[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.availableSizes[0]);
  const [engraving, setEngraving] = useState<string>('');
  const [activePhoto, setActivePhoto] = useState<'primary' | 'secondary'>('primary');

  const savings = product.traditionalRetailPrice - product.price;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-modal-title"
      className="fixed inset-0 z-50 bg-[#242325]/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div className="bg-[#FDFBF7] text-[#242325] border border-[#242325]/20 max-w-4xl w-full p-8 sm:p-12 relative my-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-6 right-6 w-10 h-10 rounded-full border border-[#242325]/30 flex items-center justify-center hover:bg-[#242325] hover:text-[#FDFBF7] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Gallery */}
          <div className="md:col-span-6 space-y-5">
            <div className="aspect-square bg-[#F7F3E8] border border-[#242325]/10 overflow-hidden">
              <img
                src={activePhoto === 'primary' ? product.image : product.secondaryImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setActivePhoto('primary')}
                className={`py-2.5 px-4 text-xs font-tabular-mono uppercase border transition-colors cursor-pointer ${
                  activePhoto === 'primary'
                    ? 'bg-[#242325] text-[#FDFBF7] border-[#242325]'
                    : 'bg-[#F7F3E8] text-[#242325] border-[#242325]/15'
                }`}
              >
                01 · Studio View
              </button>
              <button
                type="button"
                onClick={() => setActivePhoto('secondary')}
                className={`py-2.5 px-4 text-xs font-tabular-mono uppercase border transition-colors cursor-pointer ${
                  activePhoto === 'secondary'
                    ? 'bg-[#242325] text-[#FDFBF7] border-[#242325]'
                    : 'bg-[#F7F3E8] text-[#242325] border-[#242325]/15'
                }`}
              >
                02 · Editorial Scale
              </button>
            </div>

            {/* Digital Passport Box */}
            <div className="bg-[#F7F3E8] border border-[#242325]/12 p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-[#242325]/10 pb-3">
                <span className="font-tabular-mono text-xs uppercase tracking-[0.14em] font-medium text-[#4732D4]">
                  100% TRACEABLE DIGITAL PASSPORT
                </span>
                <span className="font-tabular-mono text-xs text-[#242325]/70">
                  {product.passport.passportId}
                </span>
              </div>
              <dl className="grid grid-cols-1 gap-2.5 text-xs">
                <div className="flex justify-between gap-2">
                  <dt className="text-[#242325]/65">GIA Certificate:</dt>
                  <dd className="font-tabular-mono font-medium">{product.passport.giaCertificateId}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#242325]/65">Cut Performance:</dt>
                  <dd className="text-right">{product.passport.cutScore}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#242325]/65">Gold Provenance:</dt>
                  <dd className="text-right">{product.passport.goldOrigin}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#242325]/65">Stone Journey:</dt>
                  <dd className="text-right">{product.passport.mineOrLabLocation}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#242325]/65">Master Bench Artisan:</dt>
                  <dd className="text-right">{product.passport.benchArtisan}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="md:col-span-6 space-y-6">
            <div>
              <p className="font-tabular-mono text-xs uppercase tracking-[0.16em] text-[#242325]/70 flex items-center gap-2 flex-wrap">
                <span>{product.categoryLabel}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 text-[#242325] font-medium">
                  <svg className="w-3.5 h-3.5 fill-[#9D814D] text-[#9D814D]" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {product.rating.toFixed(1)} ({product.reviewCount} Verified Collectors)
                </span>
              </p>
              <h2 id="pdp-modal-title" className="text-2xl sm:text-3xl font-light uppercase tracking-wide mt-2">
                {product.name}
              </h2>
              <p className="text-sm text-[#242325]/70 font-light mt-1.5">{product.stoneSpec}</p>
            </div>

            <div className="flex items-baseline gap-3.5 pb-5 border-b border-[#242325]/10">
              <span className="font-tabular-mono text-2xl sm:text-3xl font-medium text-[#242325]">
                ${product.price.toLocaleString()}
              </span>
              <span className="font-tabular-mono text-sm text-[#242325]/45 line-through">
                Traditional Luxury Retail: ${product.traditionalRetailPrice.toLocaleString()}
              </span>
              <span className="font-tabular-mono text-xs text-[#4732D4] font-medium">
                Save ${savings.toLocaleString()}
              </span>
            </div>

            <p className="text-sm font-light text-[#242325]/80 leading-relaxed">{product.description}</p>

            {/* Alloy Selection */}
            <div>
              <label htmlFor="pdp-metal-select" className="block text-xs uppercase tracking-[0.14em] text-[#242325]/80 mb-2.5">
                Select Solid 18k Gold / Platinum Alloy
              </label>
              <select
                id="pdp-metal-select"
                value={selectedMetal}
                onChange={(e) => setSelectedMetal(e.target.value)}
                className="w-full py-3 px-4 rounded-full bg-[#FDFBF7] border border-[#242325]/35 text-sm text-[#242325]"
              >
                {product.availableMetals.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Selection */}
            <div>
              <label htmlFor="pdp-size-select" className="block text-xs uppercase tracking-[0.14em] text-[#242325]/80 mb-2.5">
                Select Size (Includes Free 30-Day Resizing)
              </label>
              <select
                id="pdp-size-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full py-3 px-4 rounded-full bg-[#FDFBF7] border border-[#242325]/35 text-sm text-[#242325]"
              >
                {product.availableSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Complimentary Hand-Engraving */}
            <div>
              <label htmlFor="pdp-engraving-input" className="block text-xs uppercase tracking-[0.14em] text-[#242325]/80 mb-2.5">
                Complimentary Inner-Band Calligraphic Engraving (Optional)
              </label>
              <input
                id="pdp-engraving-input"
                type="text"
                maxLength={24}
                placeholder="e.g. Initials, Date, or 'Yours Forever'"
                value={engraving}
                onChange={(e) => setEngraving(e.target.value)}
                className="w-full py-3 px-4 rounded-full bg-[#FDFBF7] border border-[#242325]/35 text-sm text-[#242325]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                onAddToBag(product, selectedMetal, selectedSize, engraving);
                onClose();
              }}
              className="w-full py-4 px-6 rounded-full bg-[#242325] text-[#FDFBF7] text-sm uppercase tracking-wider font-medium hover:scale-[1.01] transition-transform cursor-pointer"
            >
              Acquire Piece — ${product.price.toLocaleString()}
            </button>

            <div className="pt-2 text-xs text-[#242325]/65 font-light flex flex-wrap items-center justify-between gap-2">
              <span>Complimentary Insured Express Shipping</span>
              <span>·</span>
              <span>30-Day Risk-Free Home Trial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ShoppingBagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  promoCode: string | null;
  onApplyPromo: (code: string) => void;
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onClearBag: () => void;
}

export const ShoppingBagDrawer: React.FC<ShoppingBagDrawerProps> = ({
  isOpen,
  onClose,
  items,
  promoCode,
  onApplyPromo,
  onUpdateQuantity,
  onRemoveItem,
  onClearBag,
}) => {
  const [promoInput, setPromoInput] = useState<string>(promoCode || '');
  const [checkoutStep, setCheckoutStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [buyerName, setBuyerName] = useState<string>('');
  const [buyerEmail, setBuyerEmail] = useState<string>('');
  const [buyerAddress, setBuyerAddress] = useState<string>('');
  const [checkoutError, setCheckoutError] = useState<string>('');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');

  if (!isOpen) return null;

  const totals = calculateBagTotals(items, promoCode);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerEmail.includes('@') || buyerAddress.trim().length < 5) {
      setCheckoutError('Please complete your full name, email, and insured delivery address.');
      return;
    }
    setCheckoutError('');
    setConfirmedOrderId(`BLG-${Math.floor(10000 + totals.total % 89999)}`);
    setCheckoutStep('confirmed');
    onClearBag();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Insured Checkout"
      className="fixed inset-0 z-50 bg-[#242325]/75 backdrop-blur-xs flex justify-end"
    >
      <div className="bg-[#FCF9EB] text-[#242325] w-full max-w-lg h-full flex flex-col justify-between p-6 sm:p-8 overflow-y-auto border-l border-[#242325]">
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-[#242325]/20">
            <div>
              <span className="font-tabular-mono text-xs uppercase tracking-[0.18em] text-[#242325]/70">
                INSURED ATELIER VAULT BAG
              </span>
              <h2 className="text-2xl font-light uppercase tracking-wide mt-0.5">
                {checkoutStep === 'confirmed'
                  ? 'Heirloom Order Confirmed'
                  : `Your Selection (${totals.itemCount})`}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close shopping bag"
              className="w-10 h-10 rounded-full border border-[#242325]/40 flex items-center justify-center hover:bg-[#242325] hover:text-[#FCF9EB] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {checkoutStep === 'confirmed' ? (
            <div className="py-10 space-y-5">
              <div className="flex items-center gap-2 text-[#4732D4]">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-tabular-mono text-sm uppercase tracking-wider font-medium">
                  Order #{confirmedOrderId} — Insured Armored Dispatch Scheduled
                </span>
              </div>
              <p className="text-sm font-light text-[#242325]/85 leading-relaxed">
                Thank you, <strong>{buyerName}</strong>. Your GIA Digital Passports and ultrasonic care certificate have been dispatched to{' '}
                <span className="underline">{buyerEmail}</span>. Your pieces will ship via Complimentary Insured Express Courier to{' '}
                <strong>{buyerAddress}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCheckoutStep('bag');
                  onClose();
                }}
                className="w-full py-3 px-6 rounded-full bg-[#242325] text-[#FCF9EB] text-xs uppercase tracking-wider"
              >
                Return to Atelier Showcase
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <p className="text-lg font-light text-[#242325]/80">Your atelier bag is currently empty.</p>
              <p className="text-xs font-light text-[#242325]/65 max-w-xs mx-auto">
                Explore our signature 18k solid gold icons, bridal solitaires, or take the 60-second style quiz for 10% off your first heirloom.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-6 rounded-full border border-[#242325] text-xs uppercase tracking-wider hover:bg-[#242325] hover:text-[#FCF9EB] transition-colors"
              >
                Explore Signature Pieces
              </button>
            </div>
          ) : checkoutStep === 'bag' ? (
            <div className="divide-y divide-[#242325]/15 my-4">
              {items.map((item, idx) => (
                <div key={`${item.product.id}-${idx}`} className="py-4 flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover bg-[#ECECEC] border border-[#242325]/15 shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-medium text-[#242325]">{item.product.name}</h3>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(idx)}
                        aria-label={`Remove ${item.product.name} from bag`}
                        className="text-[#242325]/50 hover:text-[#242325]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#242325]/70 font-light mt-0.5">
                      {item.selectedMetal} · Size {item.selectedSize}
                    </p>
                    {item.customEngraving && (
                      <p className="text-xs font-tabular-mono text-[#4732D4] mt-0.5">
                        Engraving: "{item.customEngraving}"
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-[#242325]/30 rounded-full">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(idx, -1)}
                          aria-label={`Decrease quantity of ${item.product.name}`}
                          className="px-2.5 py-1 text-xs hover:bg-[#242325]/10"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-tabular-mono">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(idx, 1)}
                          aria-label={`Increase quantity of ${item.product.name}`}
                          className="px-2.5 py-1 text-xs hover:bg-[#242325]/10"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-tabular-mono text-sm font-medium">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Checkout Form Step */
            <form id="bag-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4 my-6" noValidate>
              <div>
                <label htmlFor="checkout-name" className="block text-xs uppercase tracking-wider mb-1">
                  Recipient Full Name
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Marcus Thorne"
                  className="w-full py-2.5 px-4 rounded-full bg-white border border-[#242325]/40 text-sm"
                />
              </div>
              <div>
                <label htmlFor="checkout-email" className="block text-xs uppercase tracking-wider mb-1">
                  Email for Digital Passport & GIA Dossier
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="marcus@domain.com"
                  className="w-full py-2.5 px-4 rounded-full bg-white border border-[#242325]/40 text-sm"
                />
              </div>
              <div>
                <label htmlFor="checkout-address" className="block text-xs uppercase tracking-wider mb-1">
                  Insured Express Delivery Address (Signature Required)
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  placeholder="140 New Bond Street, London / New York"
                  className="w-full py-2.5 px-4 rounded-full bg-white border border-[#242325]/40 text-sm"
                />
              </div>
              {checkoutError && <p className="text-xs text-[#4732D4] font-medium">{checkoutError}</p>}
            </form>
          )}
        </div>

        {items.length > 0 && checkoutStep !== 'confirmed' && (
          <div className="pt-5 border-t border-[#242325]/20 space-y-4">
            {/* Promo Code Bar */}
            <div className="flex gap-2">
              <label htmlFor="bag-promo-input" className="sr-only">
                Privilege / Promo Code
              </label>
              <input
                id="bag-promo-input"
                type="text"
                placeholder="Privilege code (e.g. HEIRLOOM10)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 py-2 px-4 rounded-full bg-[#ECECEC] border border-[#242325]/30 text-xs font-tabular-mono uppercase"
              />
              <button
                type="button"
                onClick={() => onApplyPromo(promoInput)}
                className="py-2 px-4 rounded-full border border-[#242325] text-xs uppercase tracking-wider hover:bg-[#242325] hover:text-[#FCF9EB] transition-colors whitespace-nowrap shrink-0"
              >
                Apply
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#242325]/70">
                <span>Traditional Luxury Retail Equivalent</span>
                <span className="font-tabular-mono line-through">
                  ${totals.traditionalRetailEquivalent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Direct Atelier Subtotal</span>
                <span className="font-tabular-mono">${totals.subtotal.toLocaleString()}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-[#4732D4] font-medium">
                  <span>Privilege Code ({totals.appliedPromo} — 10% Off)</span>
                  <span className="font-tabular-mono">-${totals.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-[#242325]/80">
                <span>Insured Armored Express Shipping</span>
                <span className="font-tabular-mono uppercase">Complimentary ($0)</span>
              </div>
              <div className="flex justify-between text-base font-medium pt-2 border-t border-[#242325]/15">
                <span>Total Due (0% APR Financing Eligible)</span>
                <span className="font-tabular-mono">${totals.total.toLocaleString()}</span>
              </div>
            </div>

            {checkoutStep === 'bag' ? (
              <button
                type="button"
                onClick={() => setCheckoutStep('checkout')}
                className="w-full py-3.5 px-6 rounded-full bg-[#242325] text-[#FCF9EB] text-xs uppercase tracking-wider font-medium hover:scale-[1.01] transition-transform cursor-pointer"
              >
                Proceed to Insured Checkout
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('bag')}
                  className="py-3 px-4 rounded-full border border-[#242325] text-xs uppercase tracking-wider"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="bag-checkout-form"
                  className="flex-1 py-3.5 px-6 rounded-full bg-[#242325] text-[#FCF9EB] text-xs uppercase tracking-wider font-medium cursor-pointer"
                >
                  Complete Insured Order (${totals.total.toLocaleString()})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export type QuickLinkTopic =
  | 'virtual-styling'
  | 'track-order'
  | 'gia-lookup'
  | 'financing'
  | 'care-warranty'
  | null;

interface ServiceUtilityModalProps {
  topic: QuickLinkTopic;
  onClose: () => void;
  products: JewelryProduct[];
}

export const ServiceUtilityModal: React.FC<ServiceUtilityModalProps> = ({
  topic,
  onClose,
  products,
}) => {
  const [giaQuery, setGiaQuery] = useState<string>('GIA-6492819042');
  const [orderQuery, setOrderQuery] = useState<string>('BLG-24910');
  const [stylingBooked, setStylingBooked] = useState<boolean>(false);
  const [stylingEmail, setStylingEmail] = useState<string>('');

  if (!topic) return null;

  const matchedGiaProduct = lookupGiaCertificate(giaQuery, products);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Atelier Client Concierge Service"
      className="fixed inset-0 z-50 bg-[#242325]/80 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-[#FCF9EB] text-[#242325] border border-[#242325] max-w-xl w-full p-6 sm:p-8 relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close service window"
          className="absolute top-5 right-5 w-9 h-9 rounded-full border border-[#242325]/40 flex items-center justify-center hover:bg-[#242325] hover:text-[#FCF9EB] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {topic === 'gia-lookup' && (
          <div className="space-y-4">
            <span className="font-tabular-mono text-xs uppercase tracking-[0.18em] text-[#4732D4]">
              GEMOLOGICAL VERIFICATION VAULT
            </span>
            <h3 className="text-2xl font-light uppercase tracking-wide">
              GIA Certification & Digital Passport Lookup
            </h3>
            <p className="text-xs font-light text-[#242325]/75">
              Enter any GIA Report Number (e.g. <code>GIA-6492819042</code> or <code>PASS-BLG-9085</code>) to inspect its optical symmetry and mine-to-market journey.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={giaQuery}
                onChange={(e) => setGiaQuery(e.target.value)}
                aria-label="GIA Certificate Number"
                className="flex-1 py-2.5 px-4 rounded-full bg-white border border-[#242325]/40 text-sm font-tabular-mono"
              />
            </div>
            {matchedGiaProduct ? (
              <div className="bg-[#ECECEC] p-4 border border-[#242325]/20 space-y-2 text-xs">
                <p className="font-medium text-sm text-[#242325]">{matchedGiaProduct.name}</p>
                <p className="font-tabular-mono text-[#4732D4]">
                  Verified Report: {matchedGiaProduct.passport.giaCertificateId} ({matchedGiaProduct.passport.passportId})
                </p>
                <p>Stone Specification: {matchedGiaProduct.stoneSpec}</p>
                <p>Cut Grade: {matchedGiaProduct.passport.cutScore}</p>
                <p>Provenance: {matchedGiaProduct.passport.mineOrLabLocation}</p>
                <p>Gold Assay: {matchedGiaProduct.passport.goldOrigin}</p>
              </div>
            ) : (
              <p className="text-xs text-[#242325]/70">
                No matching certificate found. Try <code>GIA-6492819042</code> or <code>GIA-7739104582</code>.
              </p>
            )}
          </div>
        )}

        {topic === 'virtual-styling' && (
          <div className="space-y-4">
            <span className="font-tabular-mono text-xs uppercase tracking-[0.18em] text-[#4732D4]">
              PRIVATE SALON CONCIERGE
            </span>
            <h3 className="text-2xl font-light uppercase tracking-wide">Book 1-on-1 Virtual Styling</h3>
            <p className="text-sm font-light text-[#242325]/80">
              Inspect diamonds under 40x live macro camera optics and compare 18k solid gold stacks on various skin tones with our senior gemologists.
            </p>
            {stylingBooked ? (
              <div className="p-4 bg-[#ECECEC] border border-[#242325]/20 text-xs space-y-2">
                <p className="font-medium text-sm">Private Salon Link Reserved</p>
                <p>We have sent your calendar invitation and macro studio link to {stylingEmail}.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (stylingEmail.includes('@')) setStylingBooked(true);
                }}
                className="space-y-3"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email for calendar invite"
                  value={stylingEmail}
                  onChange={(e) => setStylingEmail(e.target.value)}
                  className="w-full py-2.5 px-4 rounded-full bg-white border border-[#242325]/40 text-sm"
                />
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-full bg-[#242325] text-[#FCF9EB] text-xs uppercase tracking-wider"
                >
                  Confirm Private Virtual Appointment
                </button>
              </form>
            )}
          </div>
        )}

        {topic === 'track-order' && (
          <div className="space-y-4">
            <span className="font-tabular-mono text-xs uppercase tracking-[0.18em] text-[#4732D4]">
              ARMORED EXPRESS TELEMETRY
            </span>
            <h3 className="text-2xl font-light uppercase tracking-wide">Track Your Insured Order</h3>
            <input
              type="text"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              aria-label="Order Number"
              className="w-full py-2.5 px-4 rounded-full bg-white border border-[#242325]/40 text-sm font-tabular-mono"
            />
            <div className="bg-[#ECECEC] p-4 border border-[#242325]/20 text-xs space-y-1.5">
              <p className="font-tabular-mono font-medium">Dossier #{orderQuery || 'BLG-24910'}</p>
              <p>Status: Passed 40x Microscopic Bench Inspection — Insured Express Ready</p>
              <p>Insurance Coverage: 100% Full Replacement Lloyd’s Underwritten Transit</p>
            </div>
          </div>
        )}

        {topic === 'financing' && (
          <div className="space-y-4">
            <span className="font-tabular-mono text-xs uppercase tracking-[0.18em] text-[#4732D4]">
              TRANSPARENT ACQUISITION
            </span>
            <h3 className="text-2xl font-light uppercase tracking-wide">0% APR Heirloom Financing</h3>
            <p className="text-sm font-light text-[#242325]/80 leading-relaxed">
              Divide your acquisition across 6, 12, or 24 monthly installments at 0% APR for qualified collectors, with zero origination fees and immediate insured dispatch.
            </p>
            <div className="bg-[#ECECEC] p-4 border border-[#242325]/20 text-xs font-tabular-mono space-y-1">
              <p>Example · The Soleil Layered Trio ($1,680): $140 / month for 12 months at 0% APR</p>
              <p>Example · The Lumière Oval Pavé ($4,850): $404 / month for 12 months at 0% APR</p>
            </div>
          </div>
        )}

        {topic === 'care-warranty' && (
          <div className="space-y-4">
            <span className="font-tabular-mono text-xs uppercase tracking-[0.18em] text-[#4732D4]">
              THE LIFETIME BRILLIANCE PROMISE
            </span>
            <h3 className="text-2xl font-light uppercase tracking-wide">Lifetime Care & Warranty</h3>
            <p className="text-sm font-light text-[#242325]/80 leading-relaxed">
              Every piece we forge includes complimentary annual ultrasonic cleaning, microscopic prong tightening, rhodium re-plating, and free first-time ring resizing within 30 days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
