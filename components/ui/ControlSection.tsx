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
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-[var(--color-border)]">
      <Disclosure defaultOpen={defaultOpen}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full items-center justify-between px-4 py-3 text-left text-base font-semibold text-gray-900 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] transition-colors duration-150 motion-reduce:transition-none">
              <span>{title}</span>
              <svg
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 motion-reduce:transition-none ${
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
            </Disclosure.Button>

            <Disclosure.Panel className="px-4 py-4 space-y-4 border-t border-gray-100">
              {children}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
