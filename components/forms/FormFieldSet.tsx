import { Control, Controller, FieldPath, FieldValues, FieldError } from 'react-hook-form';
import { ReactNode } from 'react';

type FormFieldSetProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  optional?: boolean;
  render: (field: {
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
  }, fieldState: {
    invalid: boolean;
    isTouched: boolean;
    isDirty: boolean;
    error?: FieldError;
  }) => ReactNode;
};

export function FormFieldSet<T extends FieldValues>({
  control,
  name,
  label,
  optional = false,
  render,
}: FormFieldSetProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2.5">
          <label
            htmlFor={name}
            className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
          >
            {label}
            {!optional && <span className="text-red-400 ml-1">*</span>}
            {optional && (
              <span className="text-[var(--text-muted)] text-xs normal-case ml-1">(optional)</span>
            )}
          </label>
          {render(field, fieldState)}
          {fieldState.error && (
            <p
              className="text-xs text-red-400 font-medium"
              role="alert"
              aria-live="polite"
            >
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
