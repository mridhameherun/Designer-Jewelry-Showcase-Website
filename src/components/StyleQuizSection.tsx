import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  JewelryProduct,
  QuizAnswers,
  QuizCurationResult,
  computeQuizCuration,
} from '../utils/jewelryLogic';
import { Sparkles, Check, ArrowRight, RotateCcw } from 'lucide-react';

interface StyleQuizSectionProps {
  products: JewelryProduct[];
  onApplyPromoAndSelectProduct: (promoCode: string, product?: JewelryProduct) => void;
}

export const StyleQuizSection: React.FC<StyleQuizSectionProps> = ({
  products,
  onApplyPromoAndSelectProduct,
}) => {
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    skinTone: 'warm',
    wardrobe: 'minimalist',
    lifestyle: 'never-take-off',
    chapter: 'self-milestone',
  });
  const [result, setResult] = useState<QuizCurationResult | null>(null);
  const [promoAppliedBanner, setPromoAppliedBanner] = useState<boolean>(false);
  const quizContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = quizContainerRef.current;
    if (!container) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-gsap-quiz-item]',
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      );
    }, container);

    return () => ctx.revert();
  }, [step, result]);

  const questions = [
    {
      key: 'skinTone' as const,
      number: '01 / 04',
      question: 'How does your skin undertone respond to natural sunlight and precious metals?',
      options: [
        {
          value: 'warm' as const,
          label: 'Warm & Golden Undertones',
          detail: 'Veins appear olive or greenish; rich 18k yellow and champagne gold glow effortlessly.',
        },
        {
          value: 'cool' as const,
          label: 'Cool & Porcelain / Rosy Undertones',
          detail: 'Veins appear blue; high-contrast white gold, platinum, and vivid gemstones pop.',
        },
        {
          value: 'neutral' as const,
          label: 'Balanced Neutral Undertones',
          detail: 'Both warm 18k yellow gold and icy diamond pavé flatter your complexion equally.',
        },
      ],
    },
    {
      key: 'wardrobe' as const,
      number: '02 / 04',
      question: 'Which silhouette best describes your everyday wardrobe and aesthetic sensibility?',
      options: [
        {
          value: 'minimalist' as const,
          label: 'Architectural Tailoring & Quiet Luxury',
          detail: 'Crisp linen, monochrome silk, structured blazers, and sculptural forms.',
        },
        {
          value: 'romantic' as const,
          label: 'Timeless Editorial & Heirloom Romance',
          detail: 'Soft cashmere, vintage-inspired lace, and luminous diamond fire.',
        },
        {
          value: 'avant-garde' as const,
          label: 'Gallery Collector & Bold Statement',
          detail: 'Rare coloured gemstones, asymmetric silhouettes, and conversation-starting art.',
        },
      ],
    },
    {
      key: 'lifestyle' as const,
      number: '03 / 04',
      question: 'How do you envision wearing your fine jewellery day to day?',
      options: [
        {
          value: 'never-take-off' as const,
          label: 'Second-Skin Ritual (Never Taken Off)',
          detail: 'Waterproof, tarnish-free 18k essentials worn from morning espresso to ocean swims.',
        },
        {
          value: 'milestone' as const,
          label: 'Signature Bridal & Milestone Brilliance',
          detail: 'High-dispersion solitaire and micro-pavé pieces engineered to command light.',
        },
        {
          value: 'collector' as const,
          label: 'One-of-a-Kind Vault Connoisseur',
          detail: 'Unrepeatable natural sapphires, rubellites, and investment heirlooms.',
        },
      ],
    },
    {
      key: 'chapter' as const,
      number: '04 / 04',
      question: 'Which life chapter are you currently celebrating or curating for?',
      options: [
        {
          value: 'bridal' as const,
          label: 'An Engagement, Anniversary, or Forever Promise',
          detail: 'Seeking an heirloom ring with GIA top 1% cut and lifetime care.',
        },
        {
          value: 'self-milestone' as const,
          label: 'Celebrating a Personal Triumph or Daily Elevation',
          detail: 'Marking your own chapter with solid 18k gold forged to outlive trends.',
        },
        {
          value: 'heirloom-gift' as const,
          label: 'An Unforgettable Gift for Someone Extraordinary',
          detail: 'Delivered in discreet luxury packaging with a traceable digital passport.',
        },
      ],
    },
  ];

  const handleSelectOption = <K extends keyof QuizAnswers>(key: K, val: QuizAnswers[K]) => {
    const updated = { ...answers, [key]: val };
    setAnswers(updated);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const computed = computeQuizCuration(updated, products);
      setResult(computed);
    }
  };

  const handleReset = () => {
    setResult(null);
    setStep(0);
    setPromoAppliedBanner(false);
  };

  return (
    <section
      id="style-quiz"
      className="w-full bg-[#FDFBF7] text-[#242325] py-28 lg:py-36 px-6 sm:px-12 lg:px-16 border-t border-[#242325]/10"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-start">
          {/* Left Editorial Column */}
          <div className="lg:col-span-5 space-y-7">
            <div className="inline-flex items-center gap-2">
              <span className="font-tabular-mono text-xs uppercase tracking-[0.22em] text-[#4732D4] font-medium">
                04 · NOT SURE WHERE TO START?
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-light uppercase tracking-[0.03em] leading-[1.1] text-balance">
              Take Our 60-Second "Find Your Signature Style" Quiz
            </h2>

            <p className="text-base sm:text-lg font-light text-[#242325]/75 leading-relaxed">
              Answer 4 quick questions about your skin tone, wardrobe, and lifestyle to get a personalised
              curation—plus 10% off your first heirloom piece.
            </p>

            {!quizStarted && !result && (
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setQuizStarted(true)}
                  className="py-4 px-8 rounded-full bg-[#242325] text-[#FDFBF7] text-sm font-normal tracking-wider uppercase hover:scale-[1.02] transition-transform inline-flex items-center gap-3 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Unlock My Curation & 10% Off</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Editorial Visual Preview Card */}
            <div className="pt-8 mt-8 border-t border-[#242325]/10 grid grid-cols-12 gap-6 items-center">
              <div className="col-span-5 overflow-hidden border border-[#242325]/10 bg-[#F7F3E8]">
                <img
                  src="/assets/jewelry/pearl-earring-portrait.png?v=2"
                  alt="Editorial close-up of woman wearing handcrafted gold and pearl statement earring"
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover"
                />
              </div>
              <div className="col-span-7 space-y-2.5">
                <p className="font-tabular-mono text-xs uppercase tracking-[0.16em] text-[#242325]">
                  BESPOKE STYLING ENGINE
                </p>
                <p className="text-sm font-light text-[#242325]/75 leading-relaxed">
                  Calibrated by our master stylists to match 18k alloy warmth and diamond cut geometry to your personal aesthetic.
                </p>
              </div>
            </div>
          </div>

          {/* Right Interactive Quiz / Curation Container */}
          <div
            ref={quizContainerRef}
            className="lg:col-span-7 bg-[#F7F3E8] border border-[#242325]/10 p-8 sm:p-12 lg:p-14"
          >
            {!result ? (
              <div>
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#242325]/10">
                  <span className="font-tabular-mono text-xs tracking-[0.2em] uppercase text-[#4732D4] font-medium">
                    QUESTION {questions[step].number}
                  </span>
                  <div className="flex items-center gap-2">
                    {questions.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setQuizStarted(true);
                          setStep(idx);
                        }}
                        aria-label={`Go to quiz question ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === step ? 'w-8 bg-[#242325]' : idx < step ? 'w-4 bg-[#9D814D]' : 'w-4 bg-[#242325]/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h3
                  data-gsap-quiz-item
                  className="text-xl sm:text-2xl font-light text-[#242325] mb-8 leading-relaxed"
                >
                  {questions[step].question}
                </h3>

                <div className="space-y-4">
                  {questions[step].options.map((opt) => {
                    const isSelected = answers[questions[step].key] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        data-gsap-quiz-item
                        type="button"
                        onClick={() => {
                          setQuizStarted(true);
                          handleSelectOption(questions[step].key, opt.value);
                        }}
                        className={`w-full text-left p-6 border transition-all flex items-start justify-between gap-6 cursor-pointer ${
                          isSelected
                            ? 'bg-[#242325] text-[#FDFBF7] border-[#242325]'
                            : 'bg-[#FDFBF7] text-[#242325] border-[#242325]/12 hover:border-[#242325]/50'
                        }`}
                      >
                        <div>
                          <p className="text-sm sm:text-base font-medium tracking-wide">{opt.label}</p>
                          <p
                            className={`text-xs sm:text-sm font-light mt-2 leading-relaxed ${
                              isSelected ? 'text-[#FDFBF7]/80' : 'text-[#242325]/70'
                            }`}
                          >
                            {opt.detail}
                          </p>
                        </div>
                        <span
                          className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'border-[#FDFBF7] bg-[#4732D4] text-white' : 'border-[#242325]/25'
                          }`}
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-[#242325]/10 flex items-center justify-between">
                  <button
                    type="button"
                    disabled={step === 0}
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    className="text-xs font-tabular-mono uppercase tracking-wider text-[#242325]/70 disabled:opacity-30 hover:text-[#242325] cursor-pointer"
                  >
                    ← Previous Question
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizStarted(true);
                      if (step < questions.length - 1) {
                        setStep(step + 1);
                      } else {
                        setResult(computeQuizCuration(answers, products));
                      }
                    }}
                    className="py-2.5 px-6 rounded-full border border-[#242325]/40 text-xs uppercase tracking-wider text-[#242325] hover:bg-[#242325] hover:text-[#FDFBF7] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {step < questions.length - 1 ? 'Next Step →' : 'Unlock My Curation & 10% Off'}
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz Results & 10% Off Unlock View */
              <div className="space-y-8" data-testid="quiz-curation-results">
                <div className="flex flex-wrap items-start justify-between gap-6 pb-6 border-b border-[#242325]/10">
                  <div>
                    <span className="font-tabular-mono text-xs uppercase tracking-[0.2em] text-[#4732D4] font-medium block">
                      YOUR SIGNATURE ARCHETYPE
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-light uppercase tracking-wide mt-2">
                      {result.personaTitle}
                    </h3>
                    <p className="text-sm text-[#242325]/75 font-light mt-1.5">{result.personaSubtitle}</p>
                  </div>

                  <div className="bg-[#242325] text-[#FDFBF7] px-5 py-4 text-right">
                    <span className="font-tabular-mono text-[11px] uppercase tracking-[0.16em] text-[#D5C096] block">
                      10% OFF PRIVILEGE UNLOCKED
                    </span>
                    <span className="font-tabular-mono text-lg font-medium tracking-widest block mt-1">
                      CODE: {result.promoCode}
                    </span>
                  </div>
                </div>

                <div className="bg-[#FDFBF7] p-6 border border-[#242325]/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-tabular-mono uppercase tracking-wider text-[#242325]/70">
                      Recommended Alloy Match: <strong className="text-[#242325]">{result.recommendedMetal}</strong>
                    </p>
                    <p className="text-xs sm:text-sm font-light text-[#242325]/80">{result.stylingNote}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPromoAppliedBanner(true);
                      onApplyPromoAndSelectProduct(result.promoCode);
                    }}
                    className="py-2.5 px-5 rounded-full bg-[#4732D4] text-white text-xs tracking-wider uppercase hover:opacity-95 transition-opacity flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{promoAppliedBanner ? '10% Applied to Bag' : 'Apply 10% Code to Bag'}</span>
                  </button>
                </div>

                {/* Top 3 Curated Pieces */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {result.recommendedProducts.map((item) => (
                    <div
                      key={item.id}
                      data-gsap-quiz-item
                      className="bg-[#FDFBF7] border border-[#242325]/10 p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-square overflow-hidden bg-[#F7F3E8] mb-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="font-tabular-mono text-[11px] text-[#242325]/60 uppercase">
                          {item.karat}
                        </p>
                        <h4 className="text-sm font-medium text-[#242325] mt-1 line-clamp-1">{item.name}</h4>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="font-tabular-mono text-sm font-medium text-[#242325]">
                            ${Math.round(item.price * 0.9).toLocaleString()}
                          </span>
                          <span className="font-tabular-mono text-xs text-[#242325]/45 line-through">
                            ${item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onApplyPromoAndSelectProduct(result.promoCode, item)}
                        className="mt-4 w-full py-2.5 px-3 rounded-full border border-[#242325] text-xs uppercase tracking-wider text-[#242325] hover:bg-[#242325] hover:text-[#FDFBF7] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Add With 10% Off
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 text-xs font-tabular-mono uppercase tracking-wider text-[#242325]/70 hover:text-[#242325] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                  <span className="text-xs font-light text-[#242325]/65">
                    Includes Complimentary 30-Day Resizing & Insured Delivery
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
