import { type ReactNode } from "react";

type BadgeVariant =
  | "区役所"
  | "町会"
  | "防災"
  | "子育て"
  | "高齢者"
  | "スポーツ"
  | "その他"
  | "地域";

type BadgeSize = "sm" | "md";

type BadgeProps = {
  variant: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
};

const variantStyles: Record<BadgeVariant, string> = {
  区役所: "bg-blue-100 text-blue-900 border-blue-300",
  町会: "bg-green-100 text-green-900 border-green-300",
  防災: "bg-red-100 text-red-900 border-red-300",
  子育て: "bg-pink-100 text-pink-900 border-pink-300",
  高齢者: "bg-amber-100 text-amber-900 border-amber-300",
  スポーツ: "bg-violet-100 text-violet-900 border-violet-300",
  その他: "bg-gray-100 text-gray-900 border-gray-300",
  地域: "bg-emerald-100 text-emerald-900 border-emerald-300",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-sm",
  md: "px-3 py-1 text-base",
};

export function Badge({ variant, size = "md", children }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center font-medium rounded-full border whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
