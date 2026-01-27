import Link from 'next/link';

export const metadata = {
  title: 'Manifesto | QR Code Generator',
  description: 'A manifesto for static QR codes - no tracking, no redirects, no expiration.',
};

export default function ManifestoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] relative">
      {/* Ambient background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[var(--accent-start)] to-transparent opacity-[0.03] blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[var(--accent-end)] to-transparent opacity-[0.02] blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto px-6 py-8 lg:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-start)] transition-colors duration-200 font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Generator
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16 lg:px-12 flex-1">
        <article className="prose prose-invert max-w-none">
          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight gradient-text mb-8">
            A Manifesto for Static QR Codes
          </h1>

          {/* Intro */}
          <p className="text-xl lg:text-2xl text-[var(--text-secondary)] leading-relaxed mb-12">
            QR codes were designed to be simple, durable, and boring infrastructure.
          </p>

          {/* Core principles list */}
          <ul className="space-y-3 mb-12 text-lg text-[var(--text-primary)]">
            <li className="flex items-start gap-3">
              <span className="text-[var(--accent-start)] mt-1">—</span>
              <span>They encode data.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--accent-start)] mt-1">—</span>
              <span>They do not expire.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--accent-start)] mt-1">—</span>
              <span>They do not phone home.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--accent-start)] mt-1">—</span>
              <span>They do not depend on a vendor's continued goodwill.</span>
            </li>
          </ul>

          <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-16">
            Somewhere along the way, that simplicity was deliberately broken.
          </p>

          <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-16">
            So-called "dynamic QR" services interpose themselves between the code and its destination,
            quietly replacing a permanent artifact with a revocable lease. The result is QR codes that
            can be deactivated after printing, held hostage behind subscriptions, or turned into
            advertising surfaces — often without clear disclosure at the moment they are created.
          </p>

          <p className="text-xl text-[var(--text-primary)] font-semibold mb-16">
            This project exists as a direct rejection of that model.
          </p>

          {/* Section: What this tool is */}
          <section className="mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-6">
              What this tool is
            </h2>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
              This is a static QR code generator. What you enter is exactly what gets encoded:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {['No redirects', 'No shortening', 'No tracking', 'No timers', 'No deactivation'].map((item) => (
                <div
                  key={item}
                  className="px-4 py-3 bg-[var(--surface-raised)] rounded-lg border border-[var(--border-medium)] text-[var(--text-primary)] font-medium text-center"
                >
                  {item}
                </div>
              ))}
            </div>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-4">
              If you encode a URL, the QR code contains that URL — not a pointer to a service that
              may or may not exist tomorrow.
            </p>
            <p className="text-xl text-[var(--accent-start)] font-semibold">
              Once generated, the QR code is yours. Permanently.
            </p>
          </section>

          {/* Section: What this tool is not */}
          <section className="mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-6">
              What this tool is not
            </h2>
            <ul className="space-y-3 text-lg text-[var(--text-secondary)]">
              {[
                'It is not a growth funnel.',
                'It is not a SaaS experiment.',
                'It is not an analytics platform.',
                'It is not a lead capture mechanism disguised as utility.',
                'There are no paid tiers because there is nothing to upsell.',
                'There are no "advanced" features that undermine the core promise.',
                'There is no backend dependency required to keep your QR codes alive.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[var(--text-muted)] mt-1">×</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section: Why this matters */}
          <section className="mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-6">
              Why this matters
            </h2>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
              QR codes are frequently printed onto physical objects:
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {['business cards', 'signage', 'packaging', 'books', 'exhibits'].map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 bg-[var(--surface-elevated)] rounded-full text-sm text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-4">
              When a QR code fails after printing, the damage is real and irreversible.
              Reprints cost money. Lost trust costs more.
            </p>
            <p className="text-lg text-[var(--text-primary)] font-medium">
              Encoding permanence behind a paywall is not innovation — it is rent-seeking
              applied to infrastructure that was never meant to be leased.
            </p>
          </section>

          {/* Section: Design principles */}
          <section className="mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-6">
              Design principles
            </h2>
            <ul className="space-y-3 text-lg text-[var(--text-secondary)]">
              {[
                'Static by default, static forever',
                'The encoded payload is always visible',
                'Offline-capable generation',
                'Print-safe outputs',
                'No third-party control over resolution',
                'No telemetry, now or later',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[var(--accent-start)] mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed mt-6">
              If any future feature compromises these principles, it does not belong in this project.
            </p>
          </section>

          {/* Closing */}
          <section className="pt-8 border-t border-[var(--border-subtle)]">
            <p className="text-2xl lg:text-3xl text-[var(--text-primary)] font-bold mb-4">
              QR codes should not be able to disappear.
            </p>
            <p className="text-xl text-[var(--accent-start)] font-semibold">
              This tool exists so they don't.
            </p>
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border-subtle)] mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-10 lg:px-12">
          <div className="text-center">
            <p className="text-sm font-semibold text-[var(--text-secondary)] tracking-tight">
              © {new Date().getFullYear()} Malkav Production
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
