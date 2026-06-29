import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../utils/classNames";

type ButtonVariant = "solid" | "outline" | "ghost" | "danger";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  solid: "border-neutral-950 bg-neutral-950 text-white hover:border-red-800 hover:bg-red-800",
  outline: "border-neutral-950 bg-white text-neutral-950 hover:bg-neutral-100",
  ghost: "border-transparent bg-transparent text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100",
  danger: "border-red-800 bg-red-800 text-white hover:border-red-950 hover:bg-red-950",
};

export function Button({
  variant = "solid",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center border px-4 py-2 font-sans text-sm font-semibold uppercase tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className
      )}
      type={type}
      {...props}
    />
  );
}
