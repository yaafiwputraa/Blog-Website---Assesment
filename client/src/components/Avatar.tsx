import { cx } from "../utils/classNames";

interface AvatarProps {
  name: string;
  avatarUrl: string | null;
  size?: "sm" | "md" | "lg";
}

const sizeClasses: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-24 w-24 text-2xl",
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || "U";
}

export function Avatar({ name, avatarUrl, size = "md" }: AvatarProps) {
  const className = cx(
    "border border-neutral-300 bg-neutral-100 object-cover font-sans font-semibold text-neutral-700",
    sizeClasses[size]
  );

  if (avatarUrl) {
    return <img alt={`${name}'s avatar`} className={className} src={avatarUrl} />;
  }

  return <div className={cx(className, "flex items-center justify-center")}>{initials(name)}</div>;
}
