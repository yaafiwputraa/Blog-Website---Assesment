import type { ReactNode } from "react";
import { cx } from "../utils/classNames";

type AlertVariant = "error" | "info" | "success";

interface AlertProps {
  children: ReactNode;
  title?: string;
  variant?: AlertVariant;
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  error: "border-red-800 bg-red-50 text-red-950",
  info: "border-neutral-300 bg-neutral-50 text-neutral-800",
  success: "border-emerald-700 bg-emerald-50 text-emerald-950",
};

export function Alert({ children, title, variant = "info", className }: AlertProps) {
  return (
    <div
      className={cx("border p-4 font-sans text-sm", variantClasses[variant], className)}
      role={variant === "error" ? "alert" : "status"}
    >
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      <div>{children}</div>
    </div>
  );
}
