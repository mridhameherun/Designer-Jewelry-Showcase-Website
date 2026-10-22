/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  INITIAL_PRODUCTS,
  JewelryProduct,
  MomentCategory,
  CartItem,
  filterProductsByCategory,
  calculateBagTotals,
} from './utils/jewelryLogic';

gsap.registerPlugin(ScrollTrigger);
import { MacroRefractionVisual } from './components/MacroRefractionVisual';
import { BespokeCadStudio } from './components/BespokeCadStudio';
import { StyleQuizSection } from './components/StyleQuizSection';
import {
  ProductDetailModal,
  ShoppingBagDrawer,
  ServiceUtilityModal,
  QuickLinkTopic,
} from './components/ModalsAndDrawers';
import {
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  CheckCircle2,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<MomentCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProductModal, setActiveProductModal] = useState<JewelryProduct | null>(null);
  const [bagItems, setBagItems] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[2], // The Soleil Layered Trio
      selectedMetal: '18k Solid Yellow Gold',
      selectedSize: '16" / 18" / 20" Adjustable',
      quantity: 1,
    },
  ]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);
  const [activeQuickLink, setActiveQuickLink] = useState<QuickLinkTopic>(null);

  // Inner Circle VIP & Free Ring Sizer state
  const [vipEmail, setVipEmail] = useState<string>('');
  const [vipAddress, setVipAddress] = useState<string>('');
  const [vipStatus, setVipStatus] = useState<'idle' | 'error' | 'subscribed'>('idle');

  // Collector review spotlight state
  const [activeReviewIndex, setActiveReviewIndex] = useState<number>(0);

  // Toast notification banner for actions
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // GSAP Root & Custom Cursor Refs
  const appRootRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
  const catalogGridRef = useRef<HTMLDivElement | null>(null);

  const filteredProducts = filterProductsByCategory(INITIAL_PRODUCTS, selectedCategory, searchQuery);
  const bagTotals = calculateBagTotals(bagItems, promoCode);

  // Master GSAP + ScrollTrigger Choreography (Awwwards Luxury Editorial Style)
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !appRootRef.current) return;

    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      // 1. Top Scroll Progress Bar
      gsap.fromTo(
        '[data-gsap-scroll-bar]',
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: appRootRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.25,
          },
        }
      );

      // 2. Hero Master Entrance Timeline
      const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      heroTl
        .fromTo(
          '[data-gsap-announcement]',
          { yPercent: -100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.85 }
        )
        .fromTo(
          '[data-gsap-nav-item]',
          { y: -14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.06 },
          '-=0.55'
        )
        .fromTo(
          '[data-gsap-hero-eyebrow]',
          { y: 18, opacity: 0, letterSpacing: '0.32em' },
          { y: 0, opacity: 1, letterSpacing: '0.22em', duration: 0.9 },
          '-=0.45'
        )
        .fromTo(
          '[data-gsap-hero-line]',
          { yPercent: 115, rotateZ: 1.8, opacity: 0 },
          { yPercent: 0, rotateZ: 0, opacity: 1, duration: 1.25, stagger: 0.14, ease: 'power4.out' },
          '-=0.65'
        )
        .fromTo(
          '[data-gsap-hero-copy]',
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.95, stagger: 0.1 },
          '-=0.8'
        )
        .fromTo(
          '[data-gsap-hero-stat]',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, stagger: 0.12 },
          '-=0.65'
        );

      // Animated Number Counters in Hero (750‰ and 800+ Verified Collectors)
      const finenessEl = appRootRef.current?.querySelector<HTMLElement>('[data-gsap-counter-750]');
      if (finenessEl) {
        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: 750,
          duration: 2.1,
          delay: 0.5,
          ease: 'power3.out',
          onUpdate: () => {
            finenessEl.textContent = `${Math.round(counterObj.val)}‰`;
          },
        });
      }

      const collectorsEl = appRootRef.current?.querySelector<HTMLElement>('[data-gsap-counter-collectors]');
      if (collectorsEl) {
        const collectorObj = { val: 0 };
        gsap.to(collectorObj, {
          val: 800,
          duration: 2.2,
          delay: 0.4,
          ease: 'power3.out',
          onUpdate: () => {
            collectorsEl.textContent = `4.9/5 from ${Math.round(collectorObj.val)}+ Verified Collectors`;
          },
        });
      }

      // 3. Magnetic Button Physics for Primary Hero & Studio CTAs
      const magneticButtons = gsap.utils.toArray<HTMLElement>('[data-gsap-magnetic]');
      magneticButtons.forEach((btn) => {
        const xTo = gsap.quickTo(btn, 'x', { duration: 0.45, ease: 'power3.out' });
        const yTo = gsap.quickTo(btn, 'y', { duration: 0.45, ease: 'power3.out' });

        const onMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const relX = e.clientX - (rect.left + rect.width / 2);
          const relY = e.clientY - (rect.top + rect.height / 2);
          xTo(relX * 0.24);
          yTo(relY * 0.28);
        };

        const onLeave = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
        };

        btn.addEventListener('mousemove', onMove);
        btn.addEventListener('mouseleave', onLeave);
        cleanupFns.push(() => {
          btn.removeEventListener('mousemove', onMove);
          btn.removeEventListener('mouseleave', onLeave);
        });
      });

      // 4. Provenance Strip Scroll Reveal
      gsap.fromTo(
        '[data-gsap-provenance-item]',
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-gsap-provenance-strip]',
            start: 'top 86%',
          },
        }
      );

      // 5. Section Headers & Architectural Dividers
      gsap.utils.toArray<HTMLElement>('[data-gsap-section-header]').forEach((header) => {
        gsap.fromTo(
          header.querySelectorAll('[data-gsap-header-reveal]'),
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 84%',
            },
          }
        );
      });

      // 6. "Shop by Moment" Architectural Cards — Clip-Path Curtain + Parallax
      const momentCards = gsap.utils.toArray<HTMLElement>('[data-gsap-moment-card]');
      if (momentCards.length > 0) {
        gsap.fromTo(
          momentCards,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.16,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: momentCards[0],
              start: 'top 82%',
            },
          }
        );

        momentCards.forEach((card) => {
          const img = card.querySelector('img');
          if (img) {
            gsap.fromTo(
              img,
              { scale: 1.12, yPercent: -5 },
              {
                scale: 1.0,
                yPercent: 5,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              }
            );
          }
        });
      }

      // 7. "The Uncompromising Difference" 4 Risk-Reversal Pillars & Price Counter
      const pillars = gsap.utils.toArray<HTMLElement>('[data-gsap-pillar]');
      if (pillars.length > 0) {
        gsap.fromTo(
          pillars,
          { y: 42, opacity: 0, rotateX: 8, transformPerspective: 800 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.95,
            stagger: 0.13,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: pillars[0],
              start: 'top 82%',
            },
          }
        );
      }

      const legacyPriceEl = appRootRef.current?.querySelector<HTMLElement>('[data-gsap-price-legacy]');
      const directPriceEl = appRootRef.current?.querySelector<HTMLElement>('[data-gsap-price-direct]');
      if (legacyPriceEl && directPriceEl) {
        const priceState = { legacy: 0, direct: 0 };
        gsap.to(priceState, {
          legacy: 11200,
          direct: 4850,
          duration: 2.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-gsap-comparison-strip]',
            start: 'top 84%',
          },
          onUpdate: () => {
            legacyPriceEl.textContent = `$${Math.round(priceState.legacy).toLocaleString()}+`;
            directPriceEl.textContent = `$${Math.round(priceState.direct).toLocaleString()}`;
          },
        });
      }

      // 8. Verified Collector Stories & Inner Circle Footer Reveal
      const reviewCards = gsap.utils.toArray<HTMLElement>('[data-gsap-review-card]');
      if (reviewCards.length > 0) {
        gsap.fromTo(
          reviewCards,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: reviewCards[0],
              start: 'top 84%',
            },
          }
        );
      }

      gsap.fromTo(
        '[data-gsap-vip-reveal]',
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-gsap-vip-band]',
            start: 'top 85%',
          },
        }
      );

      // 9. Custom Luxury Reticle Cursor Follower (Desktop fine pointer only)
      const isFinePointer = window.matchMedia('(pointer: fine)').matches;
      if (isFinePointer && cursorRingRef.current) {
        const ring = cursorRingRef.current;
        const xRing = gsap.quickTo(ring, 'x', { duration: 0.38, ease: 'power3.out' });
        const yRing = gsap.quickTo(ring, 'y', { duration: 0.38, ease: 'power3.out' });

        const onWindowMove = (e: MouseEvent) => {
          xRing(e.clientX);
          yRing(e.clientY);
          const target = e.target as HTMLElement | null;
          const isInteractive = Boolean(
            target?.closest('a, button, input, select, [role="tab"], [role="button"]')
          );
          gsap.to(ring, {
            scale: isInteractive ? 1.65 : 1,
            borderColor: isInteractive ? 'rgba(71, 50, 212, 0.55)' : 'rgba(157, 129, 77, 0.45)',
            duration: 0.25,
            overwrite: 'auto',
          });
        };

        window.addEventListener('mousemove', onWindowMove, { passive: true });
        cleanupFns.push(() => window.removeEventListener('mousemove', onWindowMove));
      }
    }, appRootRef);

    return () => {
      cleanupFns.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  // Reactive GSAP Staggered Cascade when Filtering or Searching the Signature Catalog
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !catalogGridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = catalogGridRef.current?.querySelectorAll('[data-gsap-product-card]');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 28, opacity: 0, scale: 0.985 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.72,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          }
        );
      }
    }, catalogGridRef);

    return () => ctx.revert();
  }, [selectedCategory, searchQuery]);

  const triggerStatusMessage = (msg: string) => {
    setStatusMessage(msg);
    window.setTimeout(() => {
      setStatusMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const handleAddToBag = (
    product: JewelryProduct,
    metal: string = product.availableMetals[0],
    size: string = product.availableSizes[0],
    engraving: string = ''
  ) => {
    setBagItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedMetal === metal &&
          item.selectedSize === size &&
          (item.customEngraving || '') === engraving
      );
      if (existingIndex > -1) {
        const clone = [...prev];
        clone[existingIndex] = {
          ...clone[existingIndex],
          quantity: clone[existingIndex].quantity + 1,
        };
        return clone;
      }
      return [
        ...prev,
        {
          product,
          selectedMetal: metal,
          selectedSize: size,
          quantity: 1,
          customEngraving: engraving || undefined,
        },
      ];
    });
    triggerStatusMessage(`Added "${product.name}" to your Insured Atelier Bag.`);
    setIsBagOpen(true);
  };

  const handleUpdateBagQuantity = (index: number, delta: number) => {
    setBagItems((prev) => {
      const clone = [...prev];
      const nextQty = clone[index].quantity + delta;
      if (nextQty <= 0) {
        clone.splice(index, 1);
      } else {
        clone[index] = { ...clone[index], quantity: nextQty };
      }
      return clone;
    });
  };

  const handleRemoveBagItem = (index: number) => {
    setBagItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSelectMomentCategory = (cat: MomentCategory) => {
    setSelectedCategory(cat);
    const catalogEl = document.getElementById('signature-catalog-grid');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleVipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipEmail.trim() || !vipEmail.includes('@')) {
      setVipStatus('error');
      return;
    }
    setVipStatus('subscribed');
    setPromoCode('INNERCIRCLE10');
    triggerStatusMessage(
      'Welcome to the Inner Circle! Your Complimentary Ring Sizer Kit & INNERCIRCLE10 privilege are active.'
    );
  };

  const collectorReviews = [
    {
      quote:
        'Seeing the 3D render and holding the wax model before they cast my fiancé\'s ring gave me total peace of mind. When the real diamond arrived, it literally took her breath away.',
      author: 'Marcus T.',
      badge: 'Verified Buyer',
      piece: 'Custom Oval Pavé Ring',
      location: 'New York · GIA Dossier #6492819042',
      image: 'assets/jewelry/eternity-pave-rings.png?v=2',
    },
    {
      quote:
        'I haven\'t taken off my huggie earrings and pendant since the day they arrived six months ago. The weight and shine of the gold put big-box luxury brands to shame.',
      author: 'Sophia L.',
      badge: 'Verified Buyer',
      piece: 'The Daily Icons Collection',
      location: 'London · 18k Solid Gold Assay #ZR-402',
      image: 'assets/jewelry/layered-necklaces.png?v=2',
    },
  ];

  const marqueeItems = [
    { label: 'HAND-FORGED 18K SOLID GOLD · 750‰', serif: 'Swiss Assay Certified' },
    { label: 'TOP 1% GIA OPTICAL BRILLIANCE', serif: 'Zero Fluorescence' },
    { label: 'INTERACTIVE 360° WEBGL CAD STUDIO', serif: 'Free 3D Wax Preview' },
    { label: 'ZERO TRADITIONAL BOUTIQUE MARKUP', serif: 'Direct From Master Bench' },
    { label: 'LIFETIME ULTRASONIC ATELIER CARE', serif: 'Insured Worldwide Courier' },
  ];

  return (
    <div
      ref={appRootRef}
      className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#242325] selection:bg-[#242325] selection:text-[#FDFBF7]"
    >
      {/* GSAP Top Scroll Progress Bar */}
      <div
        aria-hidden="true"
        data-gsap-scroll-bar
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#4732D4] via-[#D5C096] to-[#9D814D] z-50 pointer-events-none origin-left scale-x-0"
      />

      {/* Custom Luxury Reticle Cursor Follower (Desktop fine pointer only) */}
      <div
        ref={cursorRingRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-7 h-7 -ml-3.5 -mt-3.5 rounded-full border border-[#9D814D]/45 pointer-events-none z-50 hidden lg:block"
      />

      {/* 1. Top Announcement Bar (Immediate Trust & Urgency) */}
      <div
        role="region"
        aria-label="Atelier Guarantees"
        data-gsap-announcement
        className="w-full bg-[#181719] text-[#FDFBF7] py-3 px-6 text-center border-b border-[#9D814D]/35"
      >
        <p className="font-tabular-mono text-[11px] sm:text-xs tracking-[0.18em] uppercase font-light flex items-center justify-center flex-wrap gap-x-3 gap-y-1">
          <span className="text-[#D5C096] animate-twinkle">✦</span>
          <span>Complimentary Insured Express Shipping</span>
          <span className="text-[#9D814D] opacity-60">|</span>
          <span className="text-[#D5C096]">Certified Conflict-Free Top 1% GIA</span>
          <span className="text-[#9D814D] opacity-60">|</span>
          <span>Lifetime Care Guarantee</span>
          <span className="text-[#D5C096] animate-twinkle">✦</span>
        </p>
      </div>

      {/* Top Navigation Bar (Strict 3-Zone Contract: Brand — 4-5 Single-Line Nav Links — 1 Primary Action) */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/92 backdrop-blur-md border-b border-[#9D814D]/25 px-6 sm:px-12 lg:px-16 py-5">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark with diamond star */}
          <a
            href="#"
            data-gsap-nav-item
            className="text-lg sm:text-xl font-bold tracking-[0.22em] uppercase text-[#242325] whitespace-nowrap shrink-0 inline-flex items-center gap-2.5"
          >
            <span className="text-[#9D814D] text-base animate-twinkle" aria-hidden="true">
              ✦
            </span>
            <span>BLING ATELIER</span>
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-10 text-sm font-light tracking-widest text-[#242325]/85"
          >
            <a
              href="#collections"
              data-gsap-nav-item
              className="hover:text-[#9D814D] hover:underline underline-offset-8 transition-all whitespace-nowrap shrink-0"
            >
              Collections
            </a>
            <a
              href="#bespoke-studio"
              data-gsap-nav-item
              className="hover:text-[#9D814D] hover:underline underline-offset-8 transition-all whitespace-nowrap shrink-0"
            >
              Bespoke Studio
            </a>
            <a
              href="#uncompromising-difference"
              data-gsap-nav-item
              className="hover:text-[#9D814D] hover:underline underline-offset-8 transition-all whitespace-nowrap shrink-0"
            >
              Craftsmanship
            </a>
            <a
              href="#style-quiz"
              data-gsap-nav-item
              className="hover:text-[#9D814D] hover:underline underline-offset-8 transition-all whitespace-nowrap shrink-0"
            >
              Style Quiz
            </a>
            <a
              href="#collector-stories"
              data-gsap-nav-item
              className="hover:text-[#9D814D] hover:underline underline-offset-8 transition-all whitespace-nowrap shrink-0"
            >
              Collectors
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0" data-gsap-nav-item>
            <button
              type="button"
              data-gsap-magnetic
              onClick={() => setIsBagOpen(true)}
              aria-label={`Open shopping bag with ${bagTotals.itemCount} items`}
              className="py-2.5 px-6 rounded-full bg-[#181719] text-[#FDFBF7] border border-[#9D814D]/50 text-xs sm:text-sm font-normal tracking-wider uppercase hover:bg-[#242325] hover:border-[#D5C096] transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D5C096]" />
              <span>Bag ({bagTotals.itemCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Live Action Status Banner */}
      {statusMessage && (
        <div
          role="status"
          className="bg-[#4732D4] text-white text-xs font-tabular-mono py-3 px-6 text-center tracking-wider"
        >
          {statusMessage}
        </div>
      )}

      <main className="flex-1">
        {/* 2. Homepage: Hero Section (Emotional Hook with Ambient Golden-Hour Lighting) */}
        <section className="relative overflow-hidden w-full bg-[#FDFBF7] text-[#242325] py-20 lg:py-32 px-6 sm:px-12 lg:px-16 border-b border-[#9D814D]/20">
          {/* Ambient Golden-Hour & Royal Indigo Light Orbs */}
          <div
            aria-hidden="true"
            className="
              absolute top-0 left-0 w-full h-full pointer-events-none
              bg-[radial-gradient(circle_at_12%_22%,rgba(213,192,150,0.28),transparent_48%),radial-gradient(circle_at_88%_75%,rgba(71,50,212,0.07),transparent_52%)]
            "
          />

          <div className="max-w-[1280px] mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
              {/* Left Column: Emotional Hook Headline, Subheadline, Dual CTAs, Verified Micro-Copy */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div className="space-y-8">
                  <div
                    data-gsap-hero-eyebrow
                    className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-1.5 rounded-full bg-[#F7F3E8] border border-[#9D814D]/40 text-xs font-tabular-mono uppercase tracking-[0.22em] text-[#242325] shadow-2xs"
                  >
                    <span className="text-[#9D814D] animate-twinkle" aria-hidden="true">
                      ✦
                    </span>
                    <span className="whitespace-nowrap font-medium">18K SOLID GOLD ATELIER</span>
                    <span className="text-[#9D814D]" aria-hidden="true">
                      ·
                    </span>
                    <span className="whitespace-nowrap text-[#9D814D]">ANTWERP & GENEVA</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-light uppercase tracking-[0.03em] leading-[1.04] text-[#242325] text-balance">
                    <span className="block overflow-hidden pb-1">
                      <span data-gsap-hero-line className="block will-change-transform">
                        Rare By Nature.{' '}
                      </span>
                    </span>
                    <span className="block overflow-hidden pt-1 pb-2">
                      <span
                        data-gsap-hero-line
                        className="font-editorial-serif italic font-medium normal-case text-5xl sm:text-7xl lg:text-[76px] block text-prismatic-foil will-change-transform"
                      >
                        Yours Forever.
                      </span>
                    </span>
                  </h1>

                  <p
                    data-gsap-hero-copy
                    className="text-base sm:text-lg font-light text-[#242325]/80 leading-relaxed max-w-lg"
                  >
                    Hand-forged in <strong className="font-medium text-[#242325]">18k solid gold</strong> and set with
                    the world's <strong className="font-medium text-[#242325]">top 1%</strong> of ethically sourced
                    diamonds. Discover fine jewellery designed to outlive trends and become tomorrow’s heirlooms.
                  </p>

                  {/* Primary & Secondary CTAs with GSAP Magnetic Physics & Specular Sheen */}
                  <div data-gsap-hero-copy className="pt-4 flex flex-wrap items-center gap-5">
                    <a
                      href="#collections"
                      data-gsap-magnetic
                      className="btn-luxury-sheen py-4 px-8 rounded-full bg-[#181719] text-[#FDFBF7] border border-[#9D814D]/60 text-sm font-normal tracking-wider uppercase hover:bg-[#242325] shadow-[0_18px_40px_-12px_rgba(36,35,37,0.4)] transition-all inline-flex items-center gap-3 whitespace-nowrap shrink-0"
                    >
                      <span>Shop Signature Pieces</span>
                      <ArrowRight className="w-4 h-4 text-[#D5C096]" />
                    </a>

                    <a
                      href="#bespoke-studio"
                      data-gsap-magnetic
                      className="py-4 px-8 rounded-full bg-[#F7F3E8]/80 border border-[#9D814D]/50 text-[#242325] text-sm font-normal tracking-wider uppercase hover:bg-[#242325] hover:text-[#FDFBF7] transition-colors inline-flex items-center gap-2.5 whitespace-nowrap shrink-0"
                    >
                      <span className="text-[#9D814D]" aria-hidden="true">
                        ✦
                      </span>
                      <span>Design Your Custom Ring</span>
                    </a>
                  </div>

                  {/* Micro-Copy Under CTAs */}
                  <div data-gsap-hero-copy className="pt-2">
                    <p className="font-tabular-mono text-xs sm:text-sm text-[#242325]/80 tracking-wide flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="w-4 h-4 fill-[#9D814D] text-[#9D814D] shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span data-gsap-counter-collectors className="font-medium">
                          4.9/5 from 800+ Verified Collectors
                        </span>
                      </span>
                      <span className="text-[#9D814D]" aria-hidden="true">
                        |
                      </span>
                      <span>Free 30-Day Resizing</span>
                    </p>
                  </div>
                </div>

                {/* Editorial Spec Footnote with Liquid Gold Foil Metrics */}
                <div className="mt-16 pt-10 border-t border-[#9D814D]/25 grid grid-cols-3 gap-8">
                  <div data-gsap-hero-stat className="border-l-2 border-[#9D814D]/50 pl-4">
                    <p className="font-editorial-serif italic text-2xl sm:text-3xl font-semibold text-gold-foil">
                      Top 1%
                    </p>
                    <p className="text-xs font-light text-[#242325]/70 mt-1">GIA Optical Cut & Fire</p>
                  </div>
                  <div data-gsap-hero-stat className="border-l-2 border-[#9D814D]/50 pl-4">
                    <p
                      data-gsap-counter-750
                      className="font-editorial-serif italic text-2xl sm:text-3xl font-semibold text-gold-foil"
                    >
                      750‰
                    </p>
                    <p className="text-xs font-light text-[#242325]/70 mt-1">18k Solid Recycled Gold</p>
                  </div>
                  <div data-gsap-hero-stat className="border-l-2 border-[#9D814D]/50 pl-4">
                    <p className="font-editorial-serif italic text-2xl sm:text-3xl font-semibold text-gold-foil">
                      0% Markup
                    </p>
                    <p className="text-xs font-light text-[#242325]/70 mt-1">Direct From Master Bench</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Cue (Macro Pavé Refraction -> Sunlit Layered Gold Necklaces) */}
              <div className="lg:col-span-6">
                <MacroRefractionVisual
                  onExploreCustom={() => {
                    document.getElementById('bespoke-studio')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Infinite Luxury Editorial Marquee Ribbon */}
        <div
          aria-label="Atelier Hallmarks Marquee"
          className="w-full bg-[#181719] text-[#FDFBF7] py-4 border-b border-[#9D814D]/35 overflow-hidden select-none"
        >
          <div className="animate-marquee flex items-center">
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <div key={idx} className="flex items-center gap-6 px-6 shrink-0">
                <span className="text-[#D5C096] text-sm animate-twinkle" aria-hidden="true">
                  ✦
                </span>
                <span className="font-tabular-mono text-xs tracking-[0.22em] uppercase text-[#FDFBF7]/90">
                  {item.label}
                </span>
                <span className="font-editorial-serif italic text-base text-gold-foil">
                  — {item.serif}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Airy Champagne Provenance Strip */}
        <section
          aria-label="Metallurgy and Certification Specification"
          data-gsap-provenance-strip
          className="w-full bg-[#F7F3E8] text-[#242325] py-14 lg:py-16 px-6 sm:px-12 lg:px-16 border-b border-[#9D814D]/20"
        >
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div data-gsap-provenance-item className="md:col-span-4 flex items-center gap-5">
              <div className="relative p-1 border border-[#9D814D]/45 bg-[#FDFBF7] shrink-0 shadow-sm">
                <img
                  src="assets/jewelry/raw-gold-ore.png?v=2"
                  alt="Raw traceable gold crystal specimen in 3D wireframe cradle"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-cover"
                />
              </div>
              <div>
                <p className="font-editorial-serif italic text-3xl font-medium tracking-wider text-gold-foil">
                  18K · 750
                </p>
                <p className="text-xs font-tabular-mono uppercase tracking-widest text-[#9D814D] mt-0.5">
                  RJC Certified Bullion
                </p>
              </div>
            </div>

            <div data-gsap-provenance-item className="md:col-span-5">
              <p className="text-xs sm:text-sm font-light uppercase tracking-[0.08em] leading-relaxed text-[#242325]/80">
                We forge heirloom jewellery with microscopic attention to detail & ethical responsibility. Every bespoke
                and signature piece is transposed to a precision 3D model.
              </p>
            </div>

            <div data-gsap-provenance-item className="md:col-span-3 flex flex-col md:items-end justify-center">
              <span className="bg-[#181719] text-[#D5C096] border border-[#9D814D]/50 text-[11px] font-tabular-mono uppercase tracking-widest px-4 py-1.5 shadow-2xs">
                ✦ ONLY THE TOP 1% MATERIALS
              </span>
              <p className="text-xs font-light mt-2 text-[#242325]/70">
                75.0% Pure Fine Gold · Tarnish-Free Forever
              </p>
            </div>
          </div>
        </section>

        {/* 3. "Shop by Moment" & Featured Collections (Curated Discovery) */}
        <section
          id="collections"
          className="relative w-full bg-[#FDFBF7] text-[#242325] py-28 lg:py-36 px-6 sm:px-12 lg:px-16"
        >
          <div className="max-w-[1280px] mx-auto">
            {/* Section Heading */}
            <div
              data-gsap-section-header
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end pb-16 border-b border-[#9D814D]/25"
            >
              <div className="lg:col-span-7">
                <p
                  data-gsap-header-reveal
                  className="font-tabular-mono text-xs uppercase tracking-[0.22em] text-[#4732D4] font-medium mb-4 flex items-center gap-2"
                >
                  <span className="text-[#9D814D]" aria-hidden="true">
                    ✦
                  </span>
                  <span>01 · CURATED DISCOVERY</span>
                </p>
                <h2
                  data-gsap-header-reveal
                  className="text-3xl sm:text-5xl font-light uppercase tracking-[0.03em] leading-[1.1] text-balance"
                >
                  Curated for Life’s{' '}
                  <span className="font-editorial-serif italic font-normal normal-case text-4xl sm:text-6xl text-gold-foil">
                    Defining Chapters
                  </span>
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p
                  data-gsap-header-reveal
                  className="text-base sm:text-lg font-light text-[#242325]/75 leading-relaxed"
                >
                  Whether celebrating a milestone or elevating your daily ritual, find the piece that speaks to you.
                </p>
              </div>
            </div>

            {/* 3 "Shop by Moment" Architectural Category Cards — Gilded Museum Styling */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 my-20 lg:my-28">
              {/* Category 1: Bridal & Forever Rings */}
              <article
                data-gsap-moment-card
                onClick={() => handleSelectMomentCategory('bridal')}
                className="card-luxury-glow bg-[#F7F3E8]/55 border border-[#9D814D]/25 p-6 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden bg-[#181719] mb-7 relative">
                    <img
                      src="assets/jewelry/eternity-pave-rings.png?v=2"
                      alt="Bridal and Forever Rings — 18k solid gold pavé and solitaire engagement rings"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-2.5 border border-[#D5C096]/40 pointer-events-none z-10"
                    />
                    <span className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-[#181719]/80 backdrop-blur-xs border border-[#D5C096]/45 font-tabular-mono text-[10px] uppercase tracking-[0.18em] text-[#D5C096]">
                      ✦ CHAPTER I
                    </span>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#161517]/85 via-transparent to-transparent p-4 z-10">
                      <span className="font-editorial-serif italic text-lg text-[#FDFBF7]">
                        "Engineered for maximum diamond fire"
                      </span>
                    </div>
                  </div>
                  <p className="font-tabular-mono text-xs uppercase tracking-[0.18em] text-[#9D814D]">
                    FOREVER PROMISE · GIA IDEAL CUT
                  </p>
                  <h3 className="text-2xl font-light uppercase tracking-wide mt-2 group-hover:text-[#4732D4] transition-colors">
                    Bridal & Forever Rings
                  </h3>
                  <p className="text-sm font-light text-[#242325]/75 leading-relaxed mt-3">
                    Breathtaking solitaire, halo, and vintage-inspired engagement rings engineered for maximum
                    brilliance.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-[#9D814D]/20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectMomentCategory('bridal');
                    }}
                    className="w-full py-3.5 px-6 rounded-full border border-[#242325]/35 text-xs uppercase tracking-wider text-[#242325] group-hover:bg-[#181719] group-hover:text-[#D5C096] group-hover:border-[#9D814D] transition-all flex items-center justify-between whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Explore Bridal</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </article>

              {/* Category 2: The Daily Icons */}
              <article
                data-gsap-moment-card
                onClick={() => handleSelectMomentCategory('daily')}
                className="card-luxury-glow bg-[#F7F3E8]/55 border border-[#9D814D]/25 p-6 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden bg-[#181719] mb-7 relative">
                    <img
                      src="assets/jewelry/layered-necklaces.png?v=2"
                      alt="The Daily Icons — Waterproof tarnish-free 18k solid gold layered necklaces"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-2.5 border border-[#D5C096]/40 pointer-events-none z-10"
                    />
                    <span className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-[#181719]/80 backdrop-blur-xs border border-[#D5C096]/45 font-tabular-mono text-[10px] uppercase tracking-[0.18em] text-[#D5C096]">
                      ✦ CHAPTER II
                    </span>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#161517]/85 via-transparent to-transparent p-4 z-10">
                      <span className="font-editorial-serif italic text-lg text-[#FDFBF7]">
                        "Liquid 18k gold made to live in"
                      </span>
                    </div>
                  </div>
                  <p className="font-tabular-mono text-xs uppercase tracking-[0.18em] text-[#9D814D]">
                    EVERYDAY RITUAL · 750‰ SOLID GOLD
                  </p>
                  <h3 className="text-2xl font-light uppercase tracking-wide mt-2 group-hover:text-[#4732D4] transition-colors">
                    The Daily Icons
                  </h3>
                  <p className="text-sm font-light text-[#242325]/75 leading-relaxed mt-3">
                    Waterproof, tarnish-free 18k gold essentials designed to be stacked, lived in, and never taken off.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-[#9D814D]/20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectMomentCategory('daily');
                    }}
                    className="w-full py-3.5 px-6 rounded-full border border-[#242325]/35 text-xs uppercase tracking-wider text-[#242325] group-hover:bg-[#181719] group-hover:text-[#D5C096] group-hover:border-[#9D814D] transition-all flex items-center justify-between whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Shop Essentials</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </article>

              {/* Category 3: One-of-a-Kind Gemstones */}
              <article
                data-gsap-moment-card
                onClick={() => handleSelectMomentCategory('vault')}
                className="card-luxury-glow bg-[#F7F3E8]/55 border border-[#9D814D]/25 p-6 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden bg-[#181719] mb-7 relative">
                    <img
                      src="assets/jewelry/ruby-shell.png?v=2"
                      alt="One-of-a-Kind Gemstones — Rare rubellite tourmalines and sapphires"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-2.5 border border-[#D5C096]/40 pointer-events-none z-10"
                    />
                    <span className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-[#4732D4]/90 backdrop-blur-xs border border-[#D5C096]/45 font-tabular-mono text-[10px] uppercase tracking-[0.18em] text-[#FDFBF7]">
                      ✦ CHAPTER III · 1 OF 1
                    </span>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#161517]/85 via-transparent to-transparent p-4 z-10">
                      <span className="font-editorial-serif italic text-lg text-[#FDFBF7]">
                        "Unrepeatable natural saturation"
                      </span>
                    </div>
                  </div>
                  <p className="font-tabular-mono text-xs uppercase tracking-[0.18em] text-[#4732D4] font-medium">
                    UNREPEATABLE VAULT · ARCHIVE EDITIONS
                  </p>
                  <h3 className="text-2xl font-light uppercase tracking-wide mt-2 group-hover:text-[#4732D4] transition-colors">
                    One-of-a-Kind Gemstones
                  </h3>
                  <p className="text-sm font-light text-[#242325]/75 leading-relaxed mt-3">
                    Rare sapphires, emeralds, and tourmalines—once a stone is claimed, it is never replicated.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-[#9D814D]/20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectMomentCategory('vault');
                    }}
                    className="w-full py-3.5 px-6 rounded-full border border-[#242325]/35 text-xs uppercase tracking-wider text-[#242325] group-hover:bg-[#181719] group-hover:text-[#D5C096] group-hover:border-[#9D814D] transition-all flex items-center justify-between whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>View Rare Vault</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            </div>

            {/* Interactive Filterable Signature Catalog Grid */}
            <div ref={catalogGridRef} id="signature-catalog-grid" className="pt-20 border-t border-[#9D814D]/25">
              <div className="flex flex-wrap items-center justify-between gap-6 mb-14">
                {/* Interactive Filter Tabs */}
                <div role="tablist" aria-label="Filter jewellery by moment" className="flex flex-wrap items-center gap-3">
                  {[
                    { id: 'all' as const, label: 'All Signature Pieces (6)' },
                    { id: 'bridal' as const, label: 'Bridal & Forever Rings' },
                    { id: 'daily' as const, label: 'The Daily Icons' },
                    { id: 'vault' as const, label: 'One-of-a-Kind Gemstones' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={selectedCategory === tab.id}
                      type="button"
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`py-2.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedCategory === tab.id
                          ? 'bg-[#181719] text-[#D5C096] border border-[#9D814D]/60 font-medium shadow-sm'
                          : 'border border-[#242325]/25 text-[#242325]/80 hover:border-[#9D814D]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative min-w-[260px]">
                  <Search className="w-3.5 h-3.5 absolute left-4 top-1/2 -translate-y-1/2 text-[#9D814D]" />
                  <input
                    type="search"
                    aria-label="Search pieces by gemstone, cut, or GIA certificate"
                    placeholder="Search cut, stone, or GIA ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-5 rounded-full bg-[#F7F3E8] border border-[#9D814D]/35 text-xs text-[#242325] placeholder-[#242325]/45 focus:outline-none focus:border-[#4732D4]"
                  />
                </div>
              </div>

              {/* 3-Column Uniform Product Grid with Generous Gallery Spacing */}
              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center bg-[#F7F3E8] border border-[#242325]/10 p-12">
                  <p className="text-base font-light text-[#242325]/75">
                    No pieces matched "{searchQuery}".
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="mt-5 py-2.5 px-6 rounded-full border border-[#242325] text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Reset Catalog Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                  {filteredProducts.map((product) => {
                    const directSavings = product.traditionalRetailPrice - product.price;
                    return (
                      <article
                        key={product.id}
                        data-gsap-product-card
                        className="card-luxury-glow bg-[#FDFBF7] border border-[#9D814D]/25 flex flex-col justify-between group h-full p-5 sm:p-6"
                      >
                        {/* Product Image (Uniform 4:3 aspect ratio with Dynamic Dual-Perspective Hover Reveal) */}
                        <div
                          onClick={() => setActiveProductModal(product)}
                          className="aspect-[4/3] overflow-hidden bg-[#181719] relative shrink-0 mb-6 cursor-pointer"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
                          />
                          <img
                            src={product.secondaryImage}
                            alt={`${product.name} alternate editorial perspective`}
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100"
                          />
                          {/* Top-Left Luxury Provenance Badge */}
                          <span
                            className={`absolute top-3 left-3 px-3 py-1 rounded-full font-tabular-mono text-[10px] uppercase tracking-widest backdrop-blur-xs border ${
                              product.isOneOfAKind
                                ? 'bg-[#181719]/90 text-[#D5C096] border-[#D5C096]/60'
                                : 'bg-[#FDFBF7]/90 text-[#242325] border-[#9D814D]/40'
                            }`}
                          >
                            {product.isOneOfAKind ? '✦ 1 of 1 Vault Edition' : '★ Top 1% GIA Cut'}
                          </span>

                          <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#181719]/85 text-[#D5C096] border border-[#D5C096]/40 font-tabular-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            02 · Alternate Angle
                          </span>
                        </div>

                        {/* Clean Metadata with aligned price baseline */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-xs font-tabular-mono text-[#9D814D] uppercase tracking-wider">
                              <span>{product.karat}</span>
                              <span>·</span>
                              <span className="inline-flex items-center gap-1 text-[#242325]">
                                <svg className="w-3.5 h-3.5 fill-[#9D814D] text-[#9D814D]" viewBox="0 0 20 20" aria-hidden="true">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span>{product.rating.toFixed(1)}</span>
                              </span>
                            </div>

                            <h3 className="text-lg font-medium text-[#242325] mt-2.5 leading-snug group-hover:text-[#4732D4] transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-xs font-light text-[#242325]/70 mt-2 leading-relaxed line-clamp-2">
                              {product.stoneSpec}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-[#9D814D]/20 flex items-center justify-between gap-2">
                            <div className="flex items-baseline gap-2">
                              <span className="font-tabular-mono text-xl font-medium text-[#242325]">
                                ${product.price.toLocaleString()}
                              </span>
                              <span className="font-tabular-mono text-xs text-[#242325]/45 line-through">
                                ${product.traditionalRetailPrice.toLocaleString()}
                              </span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#F7F3E8] border border-[#9D814D]/40 font-tabular-mono text-[10px] uppercase tracking-wider text-[#8A6A30]">
                              Save ${directSavings.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="pt-5 flex items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() => setActiveProductModal(product)}
                            className="flex-1 py-2.5 px-4 rounded-full border border-[#242325]/35 text-xs uppercase tracking-wider text-[#242325] hover:bg-[#242325] hover:text-[#FDFBF7] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            Inspect Passport
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddToBag(product)}
                            aria-label={`Add ${product.name} to bag`}
                            className="btn-luxury-sheen flex-1 py-2.5 px-4 rounded-full bg-[#181719] text-[#D5C096] border border-[#9D814D]/50 text-xs uppercase tracking-wider hover:bg-[#242325] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            Add to Bag
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. The Bespoke Experience (High-Ticket Conversion Driver) */}
        <BespokeCadStudio
          onCustomConceptSubmitted={({ dossierId, booking }) => {
            triggerStatusMessage(
              `Bespoke 3D CAD Concept #${dossierId} registered for ${booking.fullName}. Check your inbox for your consultation link.`
            );
          }}
        />

        {/* 5. The Uncompromising Difference (Risk Reversal & Objection Handling) */}
        <section
          id="uncompromising-difference"
          className="w-full bg-[#F7F3E8] text-[#242325] py-28 lg:py-36 px-6 sm:px-12 lg:px-16 border-t border-[#9D814D]/25"
        >
          <div className="max-w-[1280px] mx-auto">
            {/* Editorial Banner Header */}
            <div
              data-gsap-section-header
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end pb-16 border-b border-[#9D814D]/25"
            >
              <div className="lg:col-span-8">
                <p
                  data-gsap-header-reveal
                  className="font-tabular-mono text-xs uppercase tracking-[0.22em] text-[#4732D4] font-medium mb-4 flex items-center gap-2"
                >
                  <span className="text-[#9D814D]" aria-hidden="true">
                    ✦
                  </span>
                  <span>03 · THE UNCOMPROMISING DIFFERENCE</span>
                </p>
                <h2
                  data-gsap-header-reveal
                  className="text-3xl sm:text-5xl font-light uppercase tracking-[0.03em] leading-[1.1] text-balance"
                >
                  Luxury Without the{' '}
                  <span className="font-editorial-serif italic font-normal normal-case text-4xl sm:text-6xl text-gold-foil">
                    Traditional Markup
                  </span>
                </h2>
              </div>
              <div data-gsap-header-reveal className="lg:col-span-4 flex lg:justify-end">
                <button
                  type="button"
                  data-gsap-magnetic
                  onClick={() => setActiveQuickLink('gia-lookup')}
                  className="py-3.5 px-7 rounded-full bg-[#181719] text-[#D5C096] border border-[#9D814D]/50 text-xs uppercase tracking-wider hover:bg-[#242325] transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
                >
                  ✦ Verify a GIA Digital Passport →
                </button>
              </div>
            </div>

            {/* 4 Risk-Reversal & Objection-Handling Pillars with Gold-Foil Editorial Numerals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 my-20">
              <div
                data-gsap-pillar
                className="card-luxury-glow bg-[#FDFBF7] border border-[#9D814D]/25 border-t-2 border-t-[#9D814D] p-8 lg:p-9 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-editorial-serif italic text-3xl text-gold-foil">01</span>
                    <span className="font-tabular-mono text-[10px] uppercase tracking-[0.2em] text-[#9D814D]">
                      OPTICAL SELECTION
                    </span>
                  </div>
                  <h3 className="text-lg font-medium uppercase tracking-wide text-[#242325] mb-3">
                    Top 1% Brilliance.
                  </h3>
                  <p className="text-sm font-light text-[#242325]/75 leading-relaxed">
                    We reject 99% of the stones we inspect, selecting only GIA-certified diamonds with superior cut and
                    fire.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#9D814D]/20 font-tabular-mono text-[11px] text-[#9D814D]">
                  IDEAL PROPORTIONS · ZERO FLUORESCENCE
                </div>
              </div>

              <div
                data-gsap-pillar
                className="card-luxury-glow bg-[#FDFBF7] border border-[#9D814D]/25 border-t-2 border-t-[#9D814D] p-8 lg:p-9 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-editorial-serif italic text-3xl text-gold-foil">02</span>
                    <span className="font-tabular-mono text-[10px] uppercase tracking-[0.2em] text-[#9D814D]">
                      MINE-TO-MARKET
                    </span>
                  </div>
                  <h3 className="text-lg font-medium uppercase tracking-wide text-[#242325] mb-3">
                    100% Traceable Origins.
                  </h3>
                  <p className="text-sm font-light text-[#242325]/75 leading-relaxed">
                    Every piece comes with a digital passport detailing the exact mine-to-market journey of your
                    gemstones and recycled 18k gold.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#9D814D]/20 font-tabular-mono text-[11px] text-[#9D814D]">
                  BLOCKCHAIN & GIA VERIFIED DOSSIER
                </div>
              </div>

              <div
                data-gsap-pillar
                className="card-luxury-glow bg-[#FDFBF7] border border-[#9D814D]/25 border-t-2 border-t-[#9D814D] p-8 lg:p-9 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-editorial-serif italic text-3xl text-gold-foil">03</span>
                    <span className="font-tabular-mono text-[10px] uppercase tracking-[0.2em] text-[#9D814D]">
                      PERPETUAL CARE
                    </span>
                  </div>
                  <h3 className="text-lg font-medium uppercase tracking-wide text-[#242325] mb-3">
                    The Lifetime Brilliance Promise.
                  </h3>
                  <p className="text-sm font-light text-[#242325]/75 leading-relaxed">
                    Enjoy free annual ultrasonic cleaning, prong tightening, and rhodium plating—for life.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#9D814D]/20 font-tabular-mono text-[11px] text-[#9D814D]">
                  COMPLIMENTARY ANNUAL ATELIER SPA
                </div>
              </div>

              <div
                data-gsap-pillar
                className="card-luxury-glow bg-[#FDFBF7] border border-[#9D814D]/25 border-t-2 border-t-[#9D814D] p-8 lg:p-9 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-editorial-serif italic text-3xl text-gold-foil">04</span>
                    <span className="font-tabular-mono text-[10px] uppercase tracking-[0.2em] text-[#9D814D]">
                      ZERO RISK
                    </span>
                  </div>
                  <h3 className="text-lg font-medium uppercase tracking-wide text-[#242325] mb-3">
                    Risk-Free At-Home Trial.
                  </h3>
                  <p className="text-sm font-light text-[#242325]/75 leading-relaxed">
                    Not in love? Enjoy complimentary 30-day insured returns and free first-time ring resizing.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#9D814D]/20 font-tabular-mono text-[11px] text-[#9D814D]">
                  INSURED DOOR-TO-DOOR COURIER
                </div>
              </div>
            </div>

            {/* Direct-from-Bench vs. Legacy Luxury House Comparison Strip */}
            <div
              data-gsap-comparison-strip
              className="relative overflow-hidden bg-[#181719] text-[#FDFBF7] border border-[#9D814D]/45 p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center shadow-[0_30px_70px_-20px_rgba(36,35,37,0.35)]"
            >
              <div
                aria-hidden="true"
                className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#D5C096]/12 blur-3xl pointer-events-none"
              />
              <div className="lg:col-span-4 flex items-center gap-6 relative z-10">
                <img
                  src="assets/jewelry/raw-platinum-ore.png?v=2"
                  alt="Handcrafted from each individual stone specimen"
                  referrerPolicy="no-referrer"
                  className="w-24 h-32 object-cover border border-[#D5C096]/40 shrink-0"
                />
                <div>
                  <p className="font-tabular-mono text-xs uppercase tracking-widest text-[#D5C096]">
                    ✦ ART & SOUL OF JEWELLERY
                  </p>
                  <p className="text-xs sm:text-sm font-light text-[#FDFBF7]/80 mt-2 leading-relaxed">
                    Handcrafted from each individual stone at our bench without wholesale middlemen.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t lg:border-t-0 lg:border-l border-[#9D814D]/30 pt-8 lg:pt-0 lg:pl-12 relative z-10">
                <div>
                  <p className="font-tabular-mono text-xs uppercase tracking-wider text-[#FDFBF7]/60">
                    Legacy Bond St / 5th Ave Markups
                  </p>
                  <p
                    data-gsap-price-legacy
                    className="font-tabular-mono text-2xl sm:text-3xl font-light text-[#FDFBF7]/45 line-through mt-2"
                  >
                    $11,200+
                  </p>
                  <p className="text-xs font-light text-[#FDFBF7]/65 mt-2 leading-relaxed">
                    Inflated by flagship real estate, wholesale brokers, and celebrity licensing.
                  </p>
                </div>

                <div>
                  <p className="font-tabular-mono text-xs uppercase tracking-wider text-[#D5C096]">
                    BLING Direct Bench Price
                  </p>
                  <p
                    data-gsap-price-direct
                    className="font-editorial-serif italic text-3xl sm:text-4xl font-semibold text-gold-foil mt-1"
                  >
                    $4,850
                  </p>
                  <p className="text-xs font-light text-[#FDFBF7]/80 mt-2 leading-relaxed">
                    Identical 18k solid gold density & superior Top 1% GIA diamond specification.
                  </p>
                </div>

                <div className="flex flex-col justify-center">
                  <a
                    href="#collections"
                    data-gsap-magnetic
                    className="btn-luxury-sheen py-3.5 px-6 rounded-full bg-gradient-to-r from-[#D5C096] to-[#B89758] text-[#181719] text-xs uppercase tracking-wider font-semibold text-center hover:scale-[1.02] transition-transform whitespace-nowrap shrink-0 shadow-md"
                  >
                    Compare Collection Pricing
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Interactive Engagement Hook (Lead Magnet — 60-Second Style Quiz) */}
        <StyleQuizSection
          products={INITIAL_PRODUCTS}
          onApplyPromoAndSelectProduct={(code, product) => {
            setPromoCode(code);
            if (product) {
              handleAddToBag(product);
            } else {
              triggerStatusMessage(`Privilege code ${code} (10% Off) has been applied to your Atelier Bag!`);
              setIsBagOpen(true);
            }
          }}
        />

        {/* 7. Social Proof & Collector Stories */}
        <section
          id="collector-stories"
          className="w-full bg-[#F7F3E8] text-[#242325] py-28 lg:py-36 px-6 sm:px-12 lg:px-16 border-t border-[#9D814D]/25"
        >
          <div className="max-w-[1280px] mx-auto">
            <div
              data-gsap-section-header
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end pb-16 border-b border-[#9D814D]/25"
            >
              <div className="lg:col-span-7">
                <p
                  data-gsap-header-reveal
                  className="font-tabular-mono text-xs uppercase tracking-[0.22em] text-[#4732D4] font-medium mb-4 flex items-center gap-2"
                >
                  <span className="text-[#9D814D]" aria-hidden="true">
                    ✦
                  </span>
                  <span>05 · VERIFIED COLLECTOR STORIES</span>
                </p>
                <h2
                  data-gsap-header-reveal
                  className="text-3xl sm:text-5xl font-light uppercase tracking-[0.03em] leading-[1.1] text-balance"
                >
                  Worn & Loved{' '}
                  <span className="font-editorial-serif italic font-normal normal-case text-4xl sm:text-6xl text-gold-foil">
                    Around the World
                  </span>
                </h2>
              </div>
              <div data-gsap-header-reveal className="lg:col-span-5 lg:text-right">
                <p className="font-tabular-mono text-sm sm:text-base font-medium text-[#242325]">
                  Over 2,500+ engagements, anniversaries, and milestones celebrated.
                </p>
                <p className="text-xs font-light text-[#242325]/70 mt-1.5">
                  Independently audited collector reviews across 38 countries
                </p>
              </div>
            </div>

            {/* Both Core Verified Reviews Side-by-Side + Editorial Spotlight */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 my-20">
              {collectorReviews.map((rev, idx) => (
                <blockquote
                  key={rev.author}
                  data-gsap-review-card
                  className={`card-luxury-glow p-10 sm:p-12 border transition-all flex flex-col justify-between ${
                    activeReviewIndex === idx
                      ? 'bg-[#FDFBF7] border-[#9D814D]/60 shadow-sm'
                      : 'bg-[#FDFBF7]/75 border-[#9D814D]/25'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-[#9D814D]/20">
                      <div className="flex items-center gap-4">
                        <img
                          src={rev.image}
                          alt={rev.piece}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#9D814D]/50"
                        />
                        <div>
                          <cite className="not-italic text-sm font-medium text-[#242325] block">
                            {rev.author} — {rev.badge}
                          </cite>
                          <span className="font-tabular-mono text-xs text-[#4732D4] block mt-0.5">
                            ({rev.piece})
                          </span>
                        </div>
                      </div>
                      <span className="font-tabular-mono text-xs text-[#242325] inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F3E8] border border-[#9D814D]/35">
                        <svg className="w-3.5 h-3.5 fill-[#9D814D] text-[#9D814D]" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>5.0 / 5.0</span>
                      </span>
                    </div>

                    <p className="font-editorial-serif italic text-2xl sm:text-[26px] font-normal text-[#242325] leading-relaxed">
                      "{rev.quote}"
                    </p>
                  </div>

                  <footer className="mt-8 pt-5 border-t border-[#9D814D]/20 flex items-center justify-between text-xs font-tabular-mono text-[#9D814D]">
                    <span>{rev.location}</span>
                    <span>✦ VERIFIED ACQUISITION</span>
                  </footer>
                </blockquote>
              ))}
            </div>

            {/* Editorial Pull-Quote Bar */}
            <div
              data-gsap-review-card
              className="bg-[#181719] text-[#FDFBF7] border border-[#9D814D]/45 p-8 sm:p-10 flex flex-wrap items-center justify-between gap-8 shadow-md"
            >
              <div className="flex items-center gap-5">
                <img
                  src="assets/jewelry/editorial-gemstone.png?v=2"
                  alt="Editorial collector portrait"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#D5C096]"
                />
                <div>
                  <p className="font-tabular-mono text-xs uppercase tracking-widest text-[#D5C096]">
                    ✦ COLLECTOR ARCHIVE HIGHLIGHT
                  </p>
                  <p className="text-sm sm:text-base font-light text-[#FDFBF7]/90 mt-1">
                    98.7% of bespoke clients report their final hand-forged piece exceeded the 360° CAD render.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveReviewIndex(0)}
                  aria-label="Highlight review 1"
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                    activeReviewIndex === 0
                      ? 'bg-[#D5C096] text-[#181719] border-[#D5C096]'
                      : 'border-[#D5C096]/40 text-[#FDFBF7]'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReviewIndex(1)}
                  aria-label="Highlight review 2"
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                    activeReviewIndex === 1
                      ? 'bg-[#D5C096] text-[#181719] border-[#D5C096]'
                      : 'border-[#D5C096]/40 text-[#FDFBF7]'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 8. Footer & VIP Club ("Join the Inner Circle") */}
      <footer className="w-full bg-[#181719] text-[#FDFBF7] border-t border-[#9D814D]/35">
        {/* Upper VIP Club Lead Capture Band */}
        <div
          data-gsap-vip-band
          className="max-w-[1280px] mx-auto py-24 lg:py-28 px-6 sm:px-12 lg:px-16 border-b border-[#9D814D]/25"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
            <div data-gsap-vip-reveal className="lg:col-span-6 space-y-4">
              <span className="font-tabular-mono text-xs uppercase tracking-[0.22em] text-[#D5C096]">
                ✦ PRIVATE ATELIER MEMBERSHIP
              </span>
              <h2 className="text-3xl sm:text-5xl font-light uppercase tracking-[0.03em] leading-tight">
                Join the{' '}
                <span className="font-editorial-serif italic font-normal normal-case text-4xl sm:text-6xl text-gold-foil">
                  Inner Circle
                </span>
              </h2>
              <p className="text-base sm:text-lg font-light text-[#FDFBF7]/75 leading-relaxed max-w-xl">
                Receive early access to one-of-a-kind gemstone drops, private vault sales, and our complimentary Ring
                Sizer Kit shipped free to your home.
              </p>
            </div>

            <div data-gsap-vip-reveal className="lg:col-span-6">
              {vipStatus === 'subscribed' ? (
                <div className="p-8 bg-[#242325] border border-[#D5C096] space-y-3">
                  <div className="flex items-center gap-2.5 text-[#D5C096]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-tabular-mono text-xs uppercase tracking-widest">
                      Inner Circle Membership & Free Ring Sizer Confirmed
                    </span>
                  </div>
                  <p className="text-sm font-light text-[#FDFBF7]/85 leading-relaxed">
                    Your complimentary precision Ring Sizer Kit is queued for dispatch to{' '}
                    <strong>{vipAddress || vipEmail}</strong>, and code <code>INNERCIRCLE10</code> is active in your
                    bag.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleVipSubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="vip-email-input" className="sr-only">
                        Email Address
                      </label>
                      <input
                        id="vip-email-input"
                        type="email"
                        placeholder="Enter your email address..."
                        value={vipEmail}
                        onChange={(e) => setVipEmail(e.target.value)}
                        className="w-full py-3.5 px-5 rounded-full bg-[#242325] border border-[#9D814D]/45 text-sm text-[#FDFBF7] placeholder-[#FDFBF7]/45 focus:outline-none focus:border-[#D5C096]"
                      />
                    </div>
                    <div>
                      <label htmlFor="vip-address-input" className="sr-only">
                        Mailing Address for Free Ring Sizer Kit (Optional)
                      </label>
                      <input
                        id="vip-address-input"
                        type="text"
                        placeholder="Mailing address for Free Ring Sizer..."
                        value={vipAddress}
                        onChange={(e) => setVipAddress(e.target.value)}
                        className="w-full py-3.5 px-5 rounded-full bg-[#242325] border border-[#9D814D]/45 text-sm text-[#FDFBF7] placeholder-[#FDFBF7]/45 focus:outline-none focus:border-[#D5C096]"
                      />
                    </div>
                  </div>
                  {vipStatus === 'error' && (
                    <p className="text-xs text-[#D5C096]">
                      Please enter a valid email address to claim your complimentary Ring Sizer Kit.
                    </p>
                  )}
                  <button
                    type="submit"
                    className="btn-luxury-sheen w-full sm:w-auto py-4 px-8 rounded-full bg-gradient-to-r from-[#D5C096] to-[#B89758] text-[#181719] text-xs sm:text-sm font-semibold uppercase tracking-wider hover:scale-[1.02] transition-transform inline-flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0 shadow-md cursor-pointer"
                  >
                    <span>Request Free Ring Sizer / Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Lower Quick Links & Hallmark Bar */}
        <div className="max-w-[1280px] mx-auto py-12 px-6 sm:px-12 lg:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-1.5">
            <p className="text-sm font-bold tracking-[0.22em] uppercase text-[#D5C096]">
              ✦ BLING FINE JEWELLERY ATELIER
            </p>
            <p className="text-xs font-light text-[#FDFBF7]/60">
              © {new Date().getFullYear()} BLING Atelier. 18k Solid Gold · GIA Certified Top 1% Diamonds.
            </p>
          </div>

          {/* Interactive Quick Links required by Section 8 */}
          <nav aria-label="Atelier Concierge Quick Links" className="flex flex-wrap items-center gap-6 sm:gap-8">
            <button
              type="button"
              onClick={() => setActiveQuickLink('virtual-styling')}
              className="text-xs font-light text-[#FDFBF7]/80 hover:text-[#D5C096] underline-offset-4 hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              Book Virtual Styling
            </button>
            <button
              type="button"
              onClick={() => setActiveQuickLink('track-order')}
              className="text-xs font-light text-[#FDFBF7]/80 hover:text-[#D5C096] underline-offset-4 hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              Track Your Order
            </button>
            <button
              type="button"
              onClick={() => setActiveQuickLink('gia-lookup')}
              className="text-xs font-light text-[#FDFBF7]/80 hover:text-[#D5C096] underline-offset-4 hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              GIA Certification Lookup
            </button>
            <button
              type="button"
              onClick={() => setActiveQuickLink('financing')}
              className="text-xs font-light text-[#FDFBF7]/80 hover:text-[#D5C096] underline-offset-4 hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              Financing (0% APR Available)
            </button>
            <button
              type="button"
              onClick={() => setActiveQuickLink('care-warranty')}
              className="text-xs font-light text-[#FDFBF7]/80 hover:text-[#D5C096] underline-offset-4 hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              Care & Warranty
            </button>
          </nav>
        </div>
      </footer>

      {/* Product Detail & Traceable Digital Passport Modal */}
      <ProductDetailModal
        product={activeProductModal}
        onClose={() => setActiveProductModal(null)}
        onAddToBag={handleAddToBag}
      />

      {/* Slide-Over Shopping Bag & Insured Express Checkout Drawer */}
      <ShoppingBagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        items={bagItems}
        promoCode={promoCode}
        onApplyPromo={(code) => {
          setPromoCode(code);
          triggerStatusMessage(`Promo code "${code.toUpperCase()}" evaluated.`);
        }}
        onUpdateQuantity={handleUpdateBagQuantity}
        onRemoveItem={handleRemoveBagItem}
        onClearBag={() => setBagItems([])}
      />

      {/* Footer Quick Link Service Modal */}
      <ServiceUtilityModal
        topic={activeQuickLink}
        onClose={() => setActiveQuickLink(null)}
        products={INITIAL_PRODUCTS}
      />
    </div>
  );
}
