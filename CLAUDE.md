# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Dev server at localhost:3000
yarn build        # Production build
yarn lint         # ESLint
yarn test         # Vitest watch mode
yarn test:run     # Single test run
yarn test:run path/to/file.test.ts  # Single test file
```

## Architecture

Static QR code generator built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4. Fully client-side — no backend, no tracking, no analytics.

**Core data flow:** `app/page.tsx` owns all QR config state → components update state → `useQRCode` hook debounces (300ms) and renders to canvas via `@liquid-js/qr-code-styling` → export via `png-export.ts` / `svg-export.ts`.

**Key areas:**
- `app/page.tsx` — Central state, assembles all UI sections
- `hooks/useQRCode.ts` — Debounced QR generation and canvas rendering
- `hooks/useURLState.ts` — Compresses config into URL hash (lz-string) for shareable links
- `lib/formatters/` — Convert structured input to QR payloads (URL, vCard, iCalendar, mailto, WiFi, etc.)
- `lib/registry.ts` — Maps payload types to their formatter and form component
- `lib/types/qr-config.ts` — `QRConfig` interface (central type)
- `components/qr-forms/` — Per-type input forms (URL, Email, WiFi, VCard, Event, WhatsApp, Telegram, Text)
- `components/StylePicker.tsx`, `ColorPicker.tsx`, `GradientColorPicker.tsx` — Visual customization
- `lib/contrast-validation.ts` — WCAG contrast checking between foreground/background

**Forms:** Uses react-hook-form + zod for validation. Each QR type has a dedicated form component in `components/forms/qr-forms/`.

**Logo overlay:** When a logo is added, error correction is forced to level H. Logo validation in `lib/utils/logo-validation.ts`.

## Key Conventions

- Path alias: `@/*` maps to project root
- Test environment: happy-dom (via vitest)
- No backend API routes — everything runs in the browser
- QR codes are permanent and static (no redirect/tracking layer — this is a core design principle)
