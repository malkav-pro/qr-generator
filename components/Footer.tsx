export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center space-y-2">
          <p className="text-sm text-[var(--color-text-muted)]">
            &copy; {new Date().getFullYear()} Malkav Production
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Your data never leaves your browser
          </p>
          <a
            href="/MANIFESTO.md"
            className="inline-block text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:rounded"
          >
            Read our manifesto
          </a>
        </div>
      </div>
    </footer>
  );
}
