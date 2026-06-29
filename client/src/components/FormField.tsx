import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../utils/classNames";

const inputClasses =
  "w-full border border-neutral-300 bg-white px-3 py-2 font-sans text-sm text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500";

type NativeInputProps = Omit<ComponentPropsWithoutRef<"input">, "id">;
type NativeTextAreaProps = Omit<ComponentPropsWithoutRef<"textarea">, "id">;

interface BaseFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

interface TextInputProps extends BaseFieldProps, NativeInputProps {}

interface TextAreaProps extends BaseFieldProps, NativeTextAreaProps {}

function describedBy(id: string, error?: string, hint?: string) {
  const ids = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(
    (value): value is string => Boolean(value)
  );

  return ids.length ? ids.join(" ") : undefined;
}

export function TextInput({
  id,
  label,
  error,
  hint,
  wrapperClassName,
  className,
  ...props
}: TextInputProps) {
  return (
    <div className={cx("space-y-2", wrapperClassName)}>
      <label className="block font-sans text-sm font-semibold text-neutral-900" htmlFor={id}>
        {label}
      </label>
      <input
        aria-describedby={describedBy(id, error, hint)}
        aria-invalid={Boolean(error)}
        className={cx(inputClasses, error && "border-red-800", className)}
        id={id}
        {...props}
      />
      {hint ? (
        <p className="font-sans text-xs text-neutral-500" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="font-sans text-xs font-medium text-red-800" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextArea({
  id,
  label,
  error,
  hint,
  wrapperClassName,
  className,
  ...props
}: TextAreaProps) {
  return (
    <div className={cx("space-y-2", wrapperClassName)}>
      <label className="block font-sans text-sm font-semibold text-neutral-900" htmlFor={id}>
        {label}
      </label>
      <textarea
        aria-describedby={describedBy(id, error, hint)}
        aria-invalid={Boolean(error)}
        className={cx(inputClasses, "min-h-40 resize-y", error && "border-red-800", className)}
        id={id}
        {...props}
      />
      {hint ? (
        <p className="font-sans text-xs text-neutral-500" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="font-sans text-xs font-medium text-red-800" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
