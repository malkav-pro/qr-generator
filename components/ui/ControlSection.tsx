import { Disclosure } from '@headlessui/react';

export interface ControlSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function ControlSection({
  title,
  defaultOpen = false,
  children,
}: ControlSectionProps) {
  return (
    <div className="bg-[var(--surface-raised)] rounded-xl border border-[var(--border-medium)] transition-all duration-300 hover:border-[var(--border-strong)]"
         style={{ boxShadow: 'var(--shadow-md)' }}>
      <Disclosure defaultOpen={defaultOpen}>
        {({ open }) => (
          <>
            <Disclosure.Button className="group flex w-full items-center justify-between px-6 py-4 text-left text-base font-bold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-start)] transition-all duration-200 rounded-t-xl">
              <span className="tracking-tight">{title}</span>
              <div className="relative flex items-center justify-center w-6 h-6 rounded-md bg-[var(--surface-elevated)] group-hover:bg-[var(--surface-base)] transition-colors duration-200">
                <svg
                  className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-300 ${
                    open ? 'rotate-180' : ''
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Disclosure.Button>

            <Disclosure.Panel className="px-6 py-5 space-y-4 border-t border-[var(--border-subtle)]">
              {children}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
