---
version: alpha
name: Bling-website
description: |
  The Bling design system embodies understated luxury paired with contemporary
  minimalism. The visual language prioritizes clean typography, generous
  whitespace, and a restrained color palette anchored by warm neutrals and a
  striking violet accent. The aesthetic feels editorial and
  sophisticated—befitting high-end jewelry—while remaining approachable through
  generous spacing and deliberate use of negative space. Interactions are subtle
  and purposeful, with occasional kinetic details (hover transforms) that
  suggest movement without distraction. The mood is one of refined
  craftsmanship: every visual element serves the product and narrative.
source:
  url: "https://bling-website.webflow.io/"
  pagesAnalyzed: 1
  extractedAt: 2026-10-21
  tokensMeasured: true
colors:
  primary: "#242325"
  canvas: "#A3A3A3"
  surface-alt: "#ECECEC"
  on-primary: "#FFFFFF"
  hairline: "#636364"
  accent-1: "#4732D4"
  neutral-1: "#FCF9EB"
typography:
  display-xxl:
    fontFamily: nimbus-sans
    fontSize: 164px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 3.28px
    textTransform: uppercase
  display-xl:
    fontFamily: nimbus-sans
    fontSize: 115px
    fontWeight: 300
    lineHeight: 0.91
    letterSpacing: 2.3px
    textTransform: uppercase
  display-lg:
    fontFamily: nimbus-sans
    fontSize: 86px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 1.72px
    textTransform: uppercase
  display-md:
    fontFamily: nimbus-sans
    fontSize: 58px
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: 0px
    textTransform: uppercase
  display-sm:
    fontFamily: nimbus-sans
    fontSize: 55px
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: 1.12px
  display-sm-uppercase:
    fontFamily: nimbus-sans
    fontSize: 55px
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: 1.12px
    textTransform: uppercase
  body-xl:
    fontFamily: nimbus-sans
    fontSize: 21px
    fontWeight: 300
    lineHeight: 1.02
    letterSpacing: 0.16px
  body-xl-uppercase:
    fontFamily: nimbus-sans
    fontSize: 21px
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: 0.16px
    textTransform: uppercase
  body-xl-2:
    fontFamily: nimbus-sans
    fontSize: 21px
    fontWeight: 300
    lineHeight: 1.02
    letterSpacing: 0.16px
    textTransform: uppercase
  body-lg:
    fontFamily: acumin-pro
    fontSize: 16px
    fontWeight: 300
    lineHeight: 1.3
    letterSpacing: 0.16px
  body-lg-2:
    fontFamily: acumin-pro
    fontSize: 16px
    fontWeight: 300
    lineHeight: 1.3
    letterSpacing: 0.8px
  body-md:
    fontFamily: acumin-pro
    fontSize: 14px
    fontWeight: 300
    lineHeight: 1.3
    letterSpacing: 1.12px
  label:
    fontFamily: acumin-pro
    fontSize: 18px
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: 1.44px
rounded:
  none: 0px
  full: 9999px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 28px
  xxxl: 32px
  section: 36px
  band: 40px
borderWidths:
  thin: 1px
  medium: 2px
elevationStrategy: color-blocking
themes:
  derived: light   # the other theme is the site's measured palette
  light:
    bg: "#FBFBFB"
    surface: "#F1F1F1"
    surfaceRaised: "#E9E9E9"
    text: "#121212"
    textMuted: "#747474"
    border: "#D8D8D8"
    accent: "#242325"
    accentFg: "#FFFFFF"
    focusRing: "#242325"
    elevation: shadow
  dark:
    bg: "#A3A3A3"
    surface: "#ECECEC"
    surfaceRaised: "#EEEEEE"
    text: "#111111"
    textMuted: "#444444"
    border: "#636364"
    accent: "#242325"
    accentFg: "#FFFFFF"
    focusRing: "#242325"
    elevation: "border+surface"
  contrastFailures:
    - "dark: muted on bg = 3.86:1 (needs 4.5:1)"
components:
  button-outline:
    textColor: "{colors.primary}"
    border: "1px solid rgba(36, 35, 37, 0.5)"
    height: 41.375px
    padding: "6.4px 24px 9.6px 24px"
    fontSize: 18px
    fontFamily: acumin-pro
    fontWeight: 400
    lineHeight: 1.3
    rounded: 100px
  footer:
    typography: "{typography.body-lg}"
    textColor: "{colors.primary}"
  link:
    typography: "{typography.body-lg}"
    textColor: "{colors.primary}"
    rounded: 100px
    backgroundColor: "{colors.primary}"
  link-2:
    textColor: "{colors.primary}"
    fontSize: 18px
    fontFamily: acumin-pro
    fontWeight: 300
    lineHeight: 1.3
states:
  other-focus:
    target: other
    state: focus
    outline: none
  input-focus:
    target: input
    state: focus
    opacity: 0
  other-focus-visible:
    target: other
    state: focus-visible
    outline: "-webkit-focus-ring-color auto 0px"
    outlineColor: -webkit-focus-ring-color
  button-hover:
    target: button
    state: hover
    transform: "translate(0px, -150%)"
  other-hover:
    target: other
    state: hover
    transform: "rotate(-45deg)"
breakpoints:
  - width: 375
    containerWidth: 360
    gridColumns: 2
    navLinksVisible: 0
    menuToggleVisible: false
    headingPx: 0
    bodyPx: 5
    sectionPaddingX: 6
  - width: 768
    containerWidth: 738
    gridColumns: 2
    navLinksVisible: 0
    menuToggleVisible: false
    headingPx: 0
    bodyPx: 9
    sectionPaddingX: 12
  - width: 1024
    containerWidth: 984
    gridColumns: 2
    navLinksVisible: 0
    menuToggleVisible: false
    headingPx: 0
    bodyPx: 12
    sectionPaddingX: 15
  - width: 1280
    containerWidth: 1230
    gridColumns: 2
    navLinksVisible: 0
    menuToggleVisible: false
    headingPx: 0
    bodyPx: 15
    sectionPaddingX: 19
  - width: 1440
    containerWidth: 1281
    gridColumns: 2
    navLinksVisible: 0
    menuToggleVisible: false
    headingPx: 0
    bodyPx: 16
    sectionPaddingX: 20
coverage:
  statesFound: 14
  gradientsFound: 0
  rolesUnassigned: 2
  archetypesUnnamed: 0
  archetypesDetected: 0
  responsiveMeasured: true
  stylesheetsBlocked: true
  semanticRampDeclared: false
---

# Design System Inspired by Bling Gold Jewelry

## 1. Visual Theme & Atmosphere

The Bling design system embodies **understated luxury** paired with **contemporary minimalism**. The visual language prioritizes clean typography, generous whitespace, and a restrained color palette anchored by warm neutrals and a striking violet accent. The aesthetic feels editorial and sophisticated—befitting high-end jewelry—while remaining approachable through generous spacing and deliberate use of negative space. Interactions are subtle and purposeful, with occasional kinetic details (hover transforms) that suggest movement without distraction. The mood is one of refined craftsmanship: every visual element serves the product and narrative.

**Key Characteristics:**
- Minimal, typography-led layouts with prominent negative space
- Warm neutral grounds (`{colors.canvas}` — `#A3A3A3`) creating an elegant, gallery-like atmosphere
- Decorative violet accent (`{colors.accent-1}` — `#4732D4`) used sparingly for emphasis and badges
- Large, open sans-serif display faces dominating hero sections
- Soft pill-shaped buttons and inputs (`{rounded.full}`) for a contemporary, approachable feel
- Restrained use of borders and shadows; depth through color blocking rather than layering
- Interaction states leverage transform and filter effects (scale, translate, invert) for tactile feedback

## 2. Color Palette & Roles

### Primary
- **Primary / Brand** (`{colors.primary}` — `#242325`): Deep charcoal used for CTAs, brand mark, active states, and primary text on light grounds. The foundational color of the system.

### Accent Colors
- **Decorative Accent** (`{colors.accent-1}` — `#4732D4`): Vibrant violet used for hero badges, labels, and accent highlights. No assigned semantic role; functions as visual punctuation.

### Neutral Scale
- **Canvas** (`{colors.canvas}` — `#A3A3A3`): Warm grey serving as the default page background and primary surface tone.
- **Surface Alt** (`{colors.surface-alt}` — `#ECECEC`): Light neutral used for alternating section bands and subtle background differentiation.
- **Warm Cream** (`{colors.neutral-1}` — `#FCF9EB`): Soft cream background for content blocks, creating warmth against grey canvas.

### Interactive
- **On Primary** (`{colors.on-primary}` — `#FFFFFF`): White text and labels on brand surfaces (`{colors.primary}` backgrounds).

### Borders & Dividers
- **Hairline** (`{colors.hairline}` — `#636364`): Medium grey for 1px borders, dividers, and subtle structural lines.

## 3. Typography Rules

### Font Family
**Primary:** Nimbus Sans (generous, refined, geometric)
Fallback stack: `nimbus-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`

**Secondary:** Acumin Pro (body, labels, UI text)
Fallback stack: `acumin-pro, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

**Tertiary:** Articulat CF (limited use; role not fully measured)
Fallback stack: `articulat-cf, sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|---|---|
| **Display XXL** | Nimbus Sans | 164px | 700 | 1.0 | 3.28px | Hero headline; uppercase only |
| **Display LG** | Nimbus Sans | 86px | 700 | 1.0 | 1.72px | Large accent heading; uppercase |
| **Display XL** | Nimbus Sans | 115px | 300 | 0.91 | 2.30px | Banner display; lightweight; uppercase |
| **Display MD** | Nimbus Sans | 58px | 300 | 1.1 | 0px | Medium display; no tracking |
| **Display SM** | Nimbus Sans | 55px | 300 | 1.05 | 1.12px | Small display; uppercase variant |
| **Body XL** | Nimbus Sans | 21px | 300 | 1.02 | 0.16px | Large body text; loose tracking |
| **Body XL Uppercase** | Nimbus Sans | 21px | 300 | 1.20 | 0.16px | Large uppercase body; higher line height |
| **Body LG** | Acumin Pro | 16px | 300 | 1.3 | 0.16px | Link and body text |
| **Body LG Variant** | Acumin Pro | 16px | 300 | 1.3 | 0.80px | Body text with tighter tracking |
| **Body MD** | Acumin Pro | 14px | 300 | 1.3 | 0.70–1.12px | Small body; footnotes |
| **Label** | Acumin Pro | 18px | 300 | 1.4 | 1.44px | Form labels; generous letter-spacing |

### Principles
- **Generous letter-spacing** across all roles (minimum 0.16px on body; up to 3.28px on display) creates visual breathing room and reinforces luxury.
- **Display faces are lightweight** (weight 300 or 700) with wide tracking, lending editorial sophistication.
- **Body text favors weight 300** (light) for approachability; line heights between 1.02 and 1.4 ensure legibility at smaller sizes.
- **Uppercase transforms** are applied selectively to certain roles (Display XXL, Display LG, Display SM) to emphasize brand voice.
- **Acumin Pro handles UI** (labels, links, body text) with consistent 300 weight for visual coherence.

## 4. Component Stylings

### Buttons

**Outline Button (Default)**
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Border:** `1px solid rgba(36, 35, 37, 0.5)` (semi-transparent primary)
- **Text Color:** `{colors.primary}` (`#242325`)
- **Padding:** `6.4px 24px 9.6px 24px`
- **Font:** Acumin Pro, 18px, weight 400
- **Line Height:** 23.4px
- **Border Radius:** `{rounded.full}` (9999px — pill-shaped)
- **Box Shadow:** none
- **Hover States:**
  - `transform: scale(1.15)` or `transform: scale(1.05)` (size increase)
  - `transform: translate(0px, -150%)` or `transform: translate(150%, 0%)` (directional shift)
  - `filter: invert(100%) brightness(120%)` (optional color invert on hover)

### Links

**Primary Link**
- **Background:** `{colors.primary}` (`#242325`)
- **Text Color:** `{colors.primary}` (`#242325`)
- **Font:** Acumin Pro, 16px, weight 300
- **Line Height:** 20.8px
- **Border Radius:** `{rounded.full}` (9999px)
- **Box Shadow:** none
- **Padding:** 0px (intrinsic sizing)

**Secondary Link (No Background)**
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Text Color:** `{colors.primary}` (`#242325`)
- **Font:** Acumin Pro, 18px, weight 300
- **Line Height:** 23.4px
- **Border Radius:** `{rounded.none}` (0px)
- **Box Shadow:** none

### Inputs & Forms

**Text Input**
- **Background:** Inherits from context (typically `{colors.canvas}` or `{colors.surface-alt}`)
- **Border:** `2px` (medium border width) in `{colors.hairline}` (`#636364`)
- **Text Color:** `{colors.primary}` (`#242325`)
- **Font:** Acumin Pro, 18px, weight 300
- **Line Height:** 23.4px
- **Border Radius:** `{rounded.full}` (9999px — pill-shaped)
- **Padding:** `{spacing.md}` (16px) horizontal, `{spacing.sm}` (12px) vertical
- **Focus State:** `opacity: 0` (outline hidden; no visible focus ring)
- **Label Font:** `{typography.label}` (Acumin Pro, 18px, weight 300, 1.44px letter-spacing)

### Navigation

**Top Navigation Bar**
- **Background:** `{colors.canvas}` (`#A3A3A3`)
- **Text Color:** `{colors.primary}` (`#242325`)
- **Font:** Acumin Pro, 14–16px, weight 300
- **Links:** Outline style (transparent background, border optional)
- **Border Radius:** `{rounded.full}` (9999px on nav items)
- **Spacing:** `{spacing.md}` (16px) between nav items

### Footer

**Default Footer**
- **Background:** Transparent or `{colors.canvas}` (`#A3A3A3`)
- **Text Color:** `{colors.primary}` (`#242325`)
- **Font:** Acumin Pro, 16px, weight 300
- **Line Height:** 20.8px
- **Border Radius:** `{rounded.none}` (0px)
- **Box Shadow:** none
- **Width:** Full width (1440px max)
- **Height:** 160px
- **Padding:** 0px

### Cards & Containers

**Product Card / Content Block**
- **Background:** `{colors.neutral-1}` (`#FCF9EB`) or `{colors.surface-alt}` (`#ECECEC`) for distinction
- **Border:** `1px` in `{colors.hairline}` (`#636364`) if needed for subtle definition
- **Border Radius:** `{rounded.none}` (0px for sharp edges) or `{rounded.full}` depending on context
- **Padding:** `{spacing.md}` to `{spacing.band}` (16px–40px) as context requires
- **Box Shadow:** none (depth via color blocking, not shadow)
- **Hover State (Images):** `filter: drop-shadow(rgba(60, 48, 26, 0.5) 0.3rem 1.5rem 1rem), rotate(10deg) scale(0.9) translate(0rem, 1rem)` (subtle lift and rotation)

## 5. Layout Principles

### Spacing System

The system uses an **8px base unit** with a 1.25× multiplier, creating a predictable scale:

- **`{spacing.xxs}`** = 4px — micro gaps, icon padding
- **`{spacing.xs}`** = 8px — tight padding, element gaps
- **`{spacing.sm}`** = 12px — button vertical padding, small margins
- **`{spacing.md}`** = 16px — standard padding, component gutters
- **`{spacing.lg}`** = 20px — medium margins, list spacing
- **`{spacing.xl}`** = 24px — generous padding, section tops
- **`{spacing.xxl}`** = 28px — large margins, heading separation
- **`{spacing.xxxl}`** = 32px — extra-large padding, container insets
- **`{spacing.section}`** = 36px — section padding
- **`{spacing.band}`** = 40px — band/hero padding, large section margins

**Usage Context:**
- Button padding: `{spacing.sm}` vertical, `{spacing.md}` horizontal
- Section padding-x: `{spacing.section}` to `{spacing.band}` (responsive; see Responsive Behavior)
- Card padding: `{spacing.md}` to `{spacing.band}`
- Heading separation: `{spacing.lg}` to `{spacing.xxl}`

### Grid & Container

- **Max Content Width:** 1281px (measured at 1440px viewport; full bleed on narrower screens)
- **Column Strategy:** 2-column grid on all measured breakpoints (375px, 768px, 1024px, 1280px, 1440px)
- **Section Pattern:** Full-width color bands (`{colors.canvas}`, `{colors.surface-alt}`, `{colors.neutral-1}`) containing centered content
- **Hero Layout:** Full-width canvas with overlaid text and imagery; content center-aligned or left-aligned as needed

### Whitespace Philosophy

The design embraces **generous negative space** as a primary design tool. Large gaps between sections, ample padding around typography, and deliberate use of margin create visual rhythm and prevent cognitive overload. This supports the luxury positioning: space signals quality and confidence.

### Border Radius Scale

| Radius Value | Context | Component |
|---|---|---|
| **`{rounded.none}`** (0px) | Sharp, geometric edges | Cards, footer, secondary links, images |
| **`{rounded.full}`** (9999px) | Pill-shaped, fully rounded | Buttons, inputs, primary links, nav pills |

### Border Widths

| Width | Thickness | Usage |
|---|---|---|
| **Thin** | 1px | Button outlines, hairline dividers |
| **Medium** | 2px | Input borders, accent strokes |

## 6. Depth & Elevation

### Shadow Strategy

The Bling system uses **color blocking** for depth rather than traditional multi-layer shadows. Surfaces are differentiated by background color (`{colors.canvas}`, `{colors.surface-alt}`, `{colors.neutral-1}`) and subtle border lines in `{colors.hairline}`. When shadows are deployed, they are minimal and decorative:

- **Hover Shadow (Image/Card):** `drop-shadow(rgba(60, 48, 26, 0.5) 0.3rem 1.5rem 1rem)` — a warm, soft drop shadow activating on interaction
- **Micro Shadow (Icon/Button):** `drop-shadow(rgba(60, 48, 26, 0.6) 0rem 0.2rem 0.4rem)` — a tight, barely-perceptible lift
- **Default State:** No box-shadow; rely on border and background color for structure

### Opacity Levels

- **`0.80` (80%)** — Semi-transparent fills and overlays (e.g., button border `rgba(36, 35, 37, 0.5)`)

### Z-index / Layering

| Layer | Z-Index | Context |
|---|---|---|
| **Base (Background)** | 1–5 | Page content, cards, sections |
| **Dropdown** | 90, 99 | Navigation dropdowns, popovers |
| **Modal / Overlay** | 9999 | Modals, top-level alerts |

## 7. Do's and Don'ts

### Do

- **Use the full letter-spacing scale.** Tracking is a defining feature; 0.16px on body, up to 3.28px on display creates visual refinement.
- **Leverage pill-shaped buttons and inputs** (`{rounded.full}`). This softness is a brand signature.
- **Nest content in color-blocked sections.** Backgrounds (`{colors.canvas}`, `{colors.surface-alt}`, `{colors.neutral-1}`) create hierarchy without shadows.
- **Employ `{colors.accent-1}` (`#4732D4`) sparingly** for badges, labels, and discrete accents. Overuse dilutes impact.
- **Honor the 8px spacing grid.** All padding, margins, and gutters derive from the base unit or its multiples.
- **Prefer lightweight typography (weight 300)** on body and small display roles; reserve weight 700 for the largest headlines only.
- **Include generous whitespace around sections.** Silence is a design choice; do not fill every gap.
- **Apply hover transforms (scale, translate)** to interactive elements for tactile feedback without overwhelming the interface.

### Don't

- **Do not apply strong drop-shadows to primary surfaces.** Bling prioritizes color blocking; shadows are reserved for hover and accent states.
- **Do not mix pill-shaped and sharp components at the same hierarchy level.** If buttons are `{rounded.full}`, keep input styling consistent.
- **Do not flatten the display hierarchy.** Use the full spectrum of font sizes (164px down to 14px) to create visual priority.
- **Do not invent semantic colors** (error red, success green, warning yellow). Bling does not publish these; use brand colors or neutrals only.
- **Do not reduce letter-spacing on display faces.** The wide tracking (1.12px–3.28px) is a defining trait; a collapsed value defeats the aesthetic.
- **Do not apply focus rings to inputs.** The measured `:focus` state hides the outline; maintain this for visual cohesion.
- **Do not overuse the accent violet (`#4732D4`).** It is a punctuation mark, not a dominant color; reserve it for 10–15% of the interface.
- **Do not layer multiple shadows.** The system uses at most one micro-shadow (hover) or none (default). Avoid stacked elevation.

## 8. Responsive Behavior

### Breakpoints

| Viewport | Content Width | Columns | Nav Links Visible | Menu Toggle | Largest Heading | Body Text | Section Padding X |
|---|---|---|---|---|---|---|---|
| **375px** | 360px | 2 | 0 | No | — | 5px* | 6px |
| **768px** | 738px | 2 | 0 | No | — | 9px* | 12px |
| **1024px** | 984px | 2 | 0 | No | — | 12px* | 15px |
| **1280px** | 1230px | 2 | 0 | No | — | 15px* | 19px |
| **1440px** | 1281px | 2 | 0 | No | — | 16px* | 20px |

*Font size increments in body text appear to be responsive; exact display size changes were not fully measured but follow a proportional scale.

### Touch Targets

- **Minimum Interactive Size:** 44px × 44px (derived from button heights ≥ 41px and padding scales)
- **Button Height:** 41.375px minimum (measured on outline variant)
- **Link Target:** 40px minimum height, `{rounded.full}` padding ensures adequate touch zones
- **Input Height:** Matches button height; round to 44px for mobile-safe sizing

### Collapsing Strategy

- **Layout:** Grid remains 2-column across all breakpoints; content reflow achieved via width constraints and max-width containers, not grid column changes.
- **Typography:** Display faces scale proportionally; acumin-pro body text increments in 1–5px steps across breakpoints (see table above).
- **Section Padding:** Horizontal padding grows from 6px (375px) to 20px (1440px); maintain proportional rhythm using the spacing scale.
- **Navigation:** No menu toggle observed; nav links hidden on all measured breakpoints (likely mobile-first with progressive enhancement not captured).
- **Imagery:** Product images scale with container; maintain aspect ratio and adjust via `object-fit: cover` or similar.

## 9. Agent Prompt Guide

### Quick Color Reference

| Role | Token | Hex |
|---|---|---|
| Primary / Brand (CTA, text, mark) | `{colors.primary}` | `#242325` |
| Accent / Badge (decorative) | `{colors.accent-1}` | `#4732D4` |
| Canvas / Default Background | `{colors.canvas}` | `#A3A3A3` |
| Surface Alt / Section Band | `{colors.surface-alt}` | `#ECECEC` |
| Warm Content Block | `{colors.neutral-1}` | `#FCF9EB` |
| Text on Brand Surface | `{colors.on-primary}` | `#FFFFFF` |
| Hairline / Border | `{colors.hairline}` | `#636364` |

### Iteration Guide

1. **Start with the spacing grid.** Every padding and margin is a multiple of `{spacing.md}` (16px). Use `{spacing.sm}` (12px), `{spacing.md}`, `{spacing.lg}` (20px), and `{spacing.band}` (40px) as your primary levers.

2. **Typography defines hierarchy.** Display sizes range from 55px to 164px; body text from 14px to 21px. Always apply the letter-spacing value exactly as specified (e.g., 3.28px on Display XXL). Do not normalize tracking.

3. **Buttons and inputs are always `{rounded.full}` (9999px).** This pill-shape is non-negotiable. Pair with `{colors.primary}` (`#242325`) outlines or transparent backgrounds.

4. **Organize content into color-blocked bands.** Alternate between `{colors.canvas}` (warm grey), `{colors.surface-alt}` (light grey), and `{colors.neutral-1}` (cream). Do not rely on shadows for depth.

5. **Accent color (`#4732D4`) is rare.** Use it for badges, category labels, or a hero highlight. Reserve it for ≤15% of the UI; overuse weakens the visual system.

6. **Hover transforms (scale, translate, rotate) provide feedback.** Buttons scale 1.05–1.15x on hover; images rotate and drop-shadow on hover. Keep motion subtle and purposeful.

7. **Borders are 1px (thin) or 2px (medium) only.** Use `{colors.hairline}` (`#636364`) for dividers and input borders. Avoid thicker strokes unless explicitly called for.

8. **Typography family: Nimbus Sans for display, Acumin Pro for body/UI.** Maintain consistent weight (300 for body, 300–700 for display) and letter-spacing across all text roles.

9. **Responsive:** Content width grows but columns remain 2-column. Section padding scales from 6px (mobile) to 20px (desktop). Adjust font size and spacing proportionally; do not stack radically different layouts per breakpoint.

10. **Focus states are invisible.** Inputs and buttons have `:focus` with `outline: none`. Do not add focus rings; rely on color contrast and interaction feedback (transform) instead.

## 10. Known Gaps

- **Semantic status colors:** The site does not publish error, success, warning, or info states. Do not invent them; use brand and neutral colors only.
- **Dark mode / alternate theme:** One color set was extracted; no alternate theme was observed or confirmed by the site's stylesheets.
- **Gradients and decorative fills:** No gradients or mesh backgrounds were found in the measured styles.
- **Unassigned accent color:** `{colors.accent-1}` (`#4732D4`) has no declared semantic role beyond "decorative." Its exact usage scope (modals, badges, highlights) was inferred from screenshots, not a design specification.
- **Typography on Articulat CF:** One font stack (Articulat CF) was detected but not fully measured; its role and specific weights are unclear.
- **Interaction states beyond hover:** Extracted stylesheets reveal button hover transforms (scale, translate, invert), image hover filters, and input focus opacity changes. No active, disabled, or loading states were captured; assume these are not published or were not present during extraction.
- **Animation timing & easing:** Transform and filter values are recorded, but duration, delay, and easing functions were not extracted. Implement with standard ease-out timing (e.g., 200ms cubic-bezier(0.4, 0, 0.2, 1)).
- **Cross-origin stylesheet limitations:** Some CSS rules may be unavailable due to cross-origin restrictions, so additional component states or token values may exist but were not measured.
- **Pages behind authentication:** Only the public homepage was analyzed. Surfaces requiring login, account dashboards, or checkout flows were not visited.
- **Navigation behavior:** The nav appears hidden on all measured breakpoints; whether a menu toggle exists or if the nav reappears at larger widths is not fully documented.
- **Exact box-shadow on default (non-hover) state:** The primary shadow strategy is color blocking; measured shadows apply only on hover. Default cards and buttons have `box-shadow: none`.