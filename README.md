## QR Code Generator (Static, no tracking)

Static QR codes are supposed to be permanent.

This app generates **truly static** QR codes: what you enter is what gets encoded. There are **no redirects**, **no link shorteners**, **no accounts**, and **no tracking**.

For the project philosophy, see `Intro.md` and `MANIFESTO.md`.

## Features

- **Payload types**
  - **URL** (with a validation hint when missing `http://` / `https://`)
  - **Text**
  - **Email** (builds a `mailto:` payload from `to`, `subject`, `body`)
- **Styling**
  - **Solid or gradient** foreground
  - Dot styles and corner styles (from `qr-code-styling`)
  - Optional **logo overlay** (with high error correction for resilience)
- **Export**
  - **PNG** export at selectable resolutions (designed for print; crisp pixels, no smoothing)
  - **SVG** export for vector workflows
- **Shareable URLs**
  - QR configuration is encoded into the **URL hash** (compressed) so you can share a link that reproduces the same QR.
  - **Logos are not included** in share links (URLs would get too large).
- **Privacy by design**
  - No backend dependency required for generation
  - No analytics/telemetry in the app logic

## Tech stack

- **Next.js** (App Router)
- **React**
- **Tailwind CSS**
- **qr-code-styling** for rendering/styling/export
- **Vitest** + Testing Library for tests

## Quick start

### Prerequisites

- **Node.js** (recent LTS recommended)
- **Yarn** (this repo uses Yarn; see `package.json` `packageManager`)

### Install

```bash
cd /home/malkav/work/malkav.pro/qrcode
yarn install
```

### Run locally

```bash
yarn dev
```

Open `http://localhost:3000`.

## Scripts

From `/home/malkav/work/malkav.pro/qrcode`:

- **Development**: `yarn dev`
- **Production build**: `yarn build`
- **Start production server**: `yarn start`
- **Lint**: `yarn lint`
- **Tests (watch)**: `yarn test`
- **Tests (CI mode)**: `yarn test:run`
- **Test UI**: `yarn test:ui`
- **Coverage**: `yarn test:coverage`

## How it works

### QR generation

QR codes are rendered client-side using `qr-code-styling`. The app uses:

- **Error correction level H** for better resilience (especially with logo overlays)
- A **quiet zone (margin)** appropriate for scanning reliability
- Canvas rendering for the on-screen preview (to avoid scaling artifacts)

Key code:

- `hooks/useQRCode.ts`: debounced generation and DOM rendering
- `lib/qr-generation.ts`: creation/render helpers (canvas + raw export helpers)

### URL sharing (state in hash)

The current configuration is synced into the URL hash (after a debounce) so it can be shared.

- `hooks/useURLState.ts` manages bidirectional sync (initial restore, updates, and back/forward navigation).
- `lib/url-state/*` encodes/decodes a **shareable config** using compression (lz-string).

Notes:

- The hash is updated via `history.replaceState` to avoid spamming browser history during slider/color adjustments.
- **Logos are intentionally excluded** from shareable config due to size constraints.
- Anything you encode and then share via URL is visible to whoever receives the link (it’s not sent to a server by this app, but it’s still part of the URL).

### Export behavior and “DPI”

PNG exports focus on print outcomes by controlling **pixel dimensions** and keeping edges crisp.

- The app offers several presets (for example 600×600, 1024×1024, 1200×1200).
- Some image viewers may display “72 DPI/96 DPI” metadata; the practical print quality comes from **pixel count**, not embedded DPI metadata.

Relevant code:

- `lib/png-export.ts`: render-at-size PNG export + download helper
- `lib/svg-export.ts`: SVG export

## Development notes

### Project structure (high level)

- `app/`: Next.js pages/layouts
- `components/`: UI controls (type selector, inputs, color pickers, export/share, etc.)
- `hooks/`: QR generation + URL state + debouncing
- `lib/`: QR generation, exports, validations, URL-state encoding, shared types

### Clipboard sharing requirements

Copy-to-clipboard uses the browser Clipboard API, which requires a **secure context**:

- Works on `https://...` and on `http://localhost`
- May not work on plain `http://` on a remote host

## Contributing

Contributions that strengthen the core guarantees are welcome:

- Static-by-default (no redirects, no “dynamic QR” resolution layers)
- No tracking/telemetry
- Print-safe exports and reliable scanning

If you propose a feature that compromises these principles, it likely does not belong here (see `MANIFESTO.md`).

## License

See `LICENSE`.
