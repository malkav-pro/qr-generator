export function Footer() {
  return (
    <footer className="relative border-t border-[var(--border-subtle)] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 lg:px-12">
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold text-[var(--text-secondary)] tracking-tight">
            &copy; {new Date().getFullYear()} Malkav Production
          </p>
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Your data never leaves your browser
          </p>
          <a
            href="/manifesto"
            className="inline-block text-sm gradient-text font-bold hover:opacity-80 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-start)] focus-visible:rounded-md focus-visible:px-2 focus-visible:py-1"
          >
            Read our manifesto →
          </a>
        </div>
      </div>
    </footer>
  );
}
