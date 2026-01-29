# QR Code Generator

## What This Is

A fully client-side QR code generator built with Next.js 16, React 19, and TypeScript. Users create customizable QR codes for URLs, emails, WiFi, vCards, events, WhatsApp, Telegram, and plain text. Supports dot/corner styling, color customization, logo overlays, and PNG/SVG export. No backend, no tracking, no analytics.

## Core Value

Users can generate beautiful, fully customized QR codes instantly in the browser with zero friction — no accounts, no tracking, no limitations.

## Requirements

### Validated

- ✓ Multi-type QR generation (URL, Email, WiFi, vCard, Event, WhatsApp, Telegram, Text) — existing
- ✓ Dot shape styles (square, rounded, extra-rounded, classy, classy-rounded, dots) — existing
- ✓ Corner square and corner dot style selection — existing
- ✓ Basic 2-color linear gradient for QR dots — existing
- ✓ Solid foreground and background color — existing
- ✓ Logo overlay with forced H error correction — existing
- ✓ Standard logo library (brand icons) — existing
- ✓ PNG export (1024/2048/4096px) and SVG export — existing
- ✓ Shareable URL state via lz-string compressed hash — existing
- ✓ WCAG contrast validation between foreground/background — existing
- ✓ Form validation via react-hook-form + zod — existing

### Active

- [ ] Full gradient editor with N color stops, per-stop offsets, and per-stop opacity
- [ ] Linear gradient support with angle control for all elements
- [ ] Radial gradient support for all elements
- [ ] Gradient control for QR dots/modules
- [ ] Gradient control for corner squares
- [ ] Gradient control for corner dots
- [ ] Gradient control for background
- [ ] Solid color with opacity for all elements (dots, corner squares, corner dots, background)
- [ ] Background image upload (photo/pattern behind QR code)
- [ ] Transparent background export (PNG with alpha)

### Out of Scope

- Conic gradients — added complexity with limited visual benefit for QR codes
- Animated QR codes — out of scope for static generator
- Backend/server-side rendering — core principle is fully client-side
- User accounts or saved codes — intentionally stateless

## Context

- Built with `@liquid-js/qr-code-styling` which supports gradients natively (linear/radial with color stops)
- Current gradient UI is minimal: 2 color string inputs + direction switcher in `GradientColorPicker.tsx`
- Uses `react-colorful` for solid color picking and `react-best-gradient-color-picker` for gradient picking
- All state centralized in `app/page.tsx` — color/gradient state will expand significantly
- QRConfig type in `lib/types/qr-config.ts` needs extension for per-element gradient support
- Export pipeline (`png-export.ts`, `svg-export.ts`) must handle transparent backgrounds and background images

## Constraints

- **Client-side only**: No server processing — all gradient rendering and image compositing must happen in browser
- **Library compatibility**: Must work within `@liquid-js/qr-code-styling` gradient API capabilities
- **Export fidelity**: Gradients and backgrounds must render identically in preview and exported PNG/SVG
- **URL state**: Extended gradient configs must compress into shareable URLs without excessive length

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Per-element gradient control (dots, corner squares, corner dots, background) | User wants full creative control over each QR element independently | — Pending |
| Multi-stop gradients with offsets and opacity | Current 2-color picker is too limiting for the desired customization depth | — Pending |
| Background image support | Extends background beyond solid/gradient to photo/pattern overlays | — Pending |

---
*Last updated: 2026-01-30 after initialization*
