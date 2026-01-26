# A Manifesto for Static QR Codes

QR codes were designed to be simple, durable, and boring infrastructure.

- They encode data.
- They do not expire.
- They do not phone home.
- They do not depend on a vendor’s continued goodwill.

Somewhere along the way, that simplicity was deliberately broken.

So-called "dynamic QR" services interpose themselves between the code and its destination, quietly replacing a permanent artifact with a revocable lease. The result is QR codes that can be deactivated after printing, held hostage behind subscriptions, or turned into advertising surfaces — often without clear disclosure at the moment they are created.

This project exists as a direct rejection of that model.

## What this tool is

This is a static QR code generator.

What you enter is exactly what gets encoded:

- No redirects
- No shortening
- No tracking
- No timers
- No deactivation

If you encode a URL, the QR code contains that URL — not a pointer to a service that may or may not exist tomorrow.

Once generated, the QR code is yours. Permanently.

## What this tool is not

- It is not a growth funnel.
- It is not a SaaS experiment.
- It is not an analytics platform.
- It is not a lead capture mechanism disguised as utility.
- There are no paid tiers because there is nothing to upsell.
- There are no “advanced” features that undermine the core promise.
- There is no backend dependency required to keep your QR codes alive.

## Why this matters

QR codes are frequently printed onto physical objects:

- business cards
- signage
- packaging
- books
- exhibits

When a QR code fails after printing, the damage is real and irreversible.
Reprints cost money. Lost trust costs more.

Encoding permanence behind a paywall is not innovation — it is rent-seeking applied to infrastructure that was never meant to be leased.

## Design principles

- Static by default, static forever
- The encoded payload is always visible
- Offline-capable generation
- Print-safe outputs
- No third-party control over resolution
- No telemetry, now or later

If any future feature compromises these principles, it does not belong in this project.

## Closing

QR codes should not be able to disappear.

This tool exists so they don’t.
