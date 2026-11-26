---
version: alpha
name: Apple Minimal
description: A clean, high-contrast, product-first system with restrained chrome and bright blue action.
colors:
  primary: "#0071E3"
  secondary: "#0066CC"
  tertiary: "#1D1D1F"
  neutral: "#FFFFFF"
  surface: "#F5F5F7"
  on-surface: "#1D1D1F"
  error: "#D92D20"
  border: "#E5E7EB"
  muted: "#86868B"
  overlay: "#000000"
typography:
  headline-display:
    fontFamily: "SF Pro Display"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: "56px"
    letterSpacing: "0px"
  headline-lg:
    fontFamily: "SF Pro Text"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: "48px"
    letterSpacing: "0px"
  headline-md:
    fontFamily: "SF Pro Text"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: "37.5px"
    letterSpacing: "-0.374px"
  headline-sm:
    fontFamily: "SF Pro Display"
    fontSize: "25px"
    fontWeight: 600
    lineHeight: "37.5px"
    letterSpacing: "0px"
  body-lg:
    fontFamily: "SF Pro Display"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "32px"
    letterSpacing: "0.196px"
  body-md:
    fontFamily: "SF Pro Display"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "32px"
    letterSpacing: "0.196px"
  body-sm:
    fontFamily: "SF Pro Text"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0px"
  label-lg:
    fontFamily: "SF Pro Text"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0px"
  label-md:
    fontFamily: "SF Pro Text"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0px"
  label-sm:
    fontFamily: "SF Pro Text"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
    letterSpacing: "0.06em"
  nav-link:
    fontFamily: "SF Pro Text"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: "0px"
  button:
    fontFamily: "SF Pro Text"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0px"
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 20px
  full: 9999px
spacing:
  xs: 4px
  sm: 12px
  md: 20px
  lg: 54px
  xl: 70px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "11px 21px"
    height: "44px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.secondary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "11px 21px"
    height: "44px"
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.secondary}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0px"
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "16px"
  input:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    padding: "11px 16px"
    height: "44px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
---

## Overview
This system feels restrained, premium, and product-led, with a calm editorial tone rather than a decorative one. It is designed for a broad consumer audience and relies on clarity, whitespace, and strong photography to carry hierarchy. The emotional register is confident and minimal, with just enough color to guide attention toward actions and product moments.

## Colors
- **Primary (#0071E3):** The signature action blue used for primary buttons, links, and key calls to action. It signals interactivity without overpowering the content.
- **Secondary (#0066CC):** A slightly deeper link blue used for secondary actions and textual affordances. It maintains the brand’s familiar clickable language.
- **Tertiary (#1D1D1F):** The core ink tone for headlines, body copy, and navigation on light surfaces. It reads as near-black without the harshness of pure black.
- **Neutral (#FFFFFF):** The dominant base for pages, cards, and content regions. It keeps the interface airy and allows product imagery to stand out.
- **Surface (#F5F5F7):** A soft off-white used for large background panels and section breaks. It adds gentle separation while preserving the minimal aesthetic.
- **On-surface (#1D1D1F):** The main readable text color on light backgrounds. It supports strong contrast and a clean visual rhythm.
- **Border (#E5E7EB):** A subtle divider tone for cards, inputs, and structural edges. It is intentionally quiet and rarely draws focus.
- **Muted (#86868B):** Used for secondary metadata, helper text, and subdued UI labels. It softens hierarchy without feeling disabled.
- **Overlay (#000000):** Reserved for overlays and shadows at low opacity when needed. The system otherwise prefers flatness over heavy dark treatment.
- **Error (#D92D20):** A restrained alert red for validation and destructive states. It should appear sparingly so it remains meaningful.

## Typography
The typography system is built around SF Pro Text for interface UI and SF Pro Display for larger editorial copy. Headings use medium to bold weights for crisp hierarchy, while body text stays regular and airy, with comfortable leading that gives the page a spacious feel. Navigation and buttons are compact, utility-driven, and visually quiet; labels generally avoid heavy letter spacing, while small utility text may use modest tracking for legibility.

Use **headline-display**, **headline-lg**, and **headline-md** for promotional titles and section headers. Use **headline-sm** for product feature headlines and shorter marketing statements. Use **body-lg** and **body-md** for descriptive copy, with **body-sm** for supporting details and footnotes. Use **label-lg**, **label-md**, and **label-sm** for buttons, navigation, and microcopy. The interface does not rely on uppercase branding conventions; the emphasis is on clean sentence case and precise spacing instead.

## Layout
The layout favors full-bleed horizontal sections with centered content blocks, producing a fluid and expansive feel. Rather than dense grid packing, it uses large visual modules, generous vertical breathing room, and clear separation between hero, promo, and product sections. Spacing follows a restrained rhythm based on 4px, 12px, 20px, 54px, and 70px increments, with larger jumps reserved for section spacing and smaller increments for internal component padding.

Primary content is typically centered within broad containers, while background art and product imagery often span edge to edge. Cards and callouts should use modest internal padding, leaving the overall page composition spacious and uncluttered. Horizontal alignment should remain precise and symmetrical whenever possible.

## Elevation & Depth
Depth is intentionally minimal. The system prefers tonal contrast, large color blocks, and subtle borders over dramatic shadows. When elevation is needed, it should be understated and soft, as in small image shadows or floating controls; otherwise, panels should appear flat and integrated into the page.

Hierarchy comes from contrast in color, scale, and whitespace rather than from layered chrome. Borders are thin and neutral, and shadows should be used sparingly so the design stays crisp and premium.

## Shapes
The shape language is rounded and approachable, but not bubbly. Interactive controls use pill-like radii, especially primary and secondary buttons, while cards and structural panels keep a mild 8px radius for a clean, engineered feel. The overall impression is smooth, precise, and highly polished.

Large hero surfaces may remain rectangular, but actions should soften with full rounding. Inputs and chips should follow the same language so the interface feels consistent and familiar.

## Components
Buttons are the clearest expression of the system. Use **button-primary** for the main action: solid blue, white text, full-pill radius, and a 44px minimum height. Use **button-secondary** for the alternate action: transparent background, blue border/text, same sizing, and the same pill geometry. Use **button-tertiary** for low-emphasis actions when no container is needed; it should feel like a text-first affordance. Hover and active states should remain subtle, with small tonal shifts rather than aggressive shadows or animation.

Cards should use the **card** token: white background, subtle border, 8px radius, and modest padding. Keep cards visually simple and let media or type carry the hierarchy. Inputs should echo the button shape with a full radius, 44px height, and soft border treatment; they should be quiet, legible, and not visually heavy.

Chips should be compact, pill-shaped, and low-contrast, using the surface tone or white depending on context. Navigation links should remain understated, using the **nav-link** typography style and avoiding bold emphasis unless active. Tooltips, if used, should follow the same restrained visual language: small, high-contrast, and lightly rounded.

## Do's and Don'ts
- Do keep the page spacious and let imagery and typography do most of the work.
- Do use the primary blue only for true actions and key links.
- Do favor pill buttons and subtle radii for interactive controls.
- Do maintain strong contrast with the near-black text color on light surfaces.
- Don't introduce heavy shadows or glossy effects.
- Don't use multiple competing accent colors for primary interactions.
- Don't crowd sections with dense grids or tight vertical stacking.
- Don't make cards or inputs feel more prominent than the content they contain.