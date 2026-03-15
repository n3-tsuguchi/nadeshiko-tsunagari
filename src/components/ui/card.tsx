import { type ReactNode } from "react";

type CardVariant = "default" | "urgent";

type CardProps = {
  variant?: CardVariant;
  children: ReactNode;
  className?: string;
};

const variantStyles: Record<CardVariant, string> = {
  default: "border border-gray-200 bg-white",
  urgent: "border-2 border-red-600 bg-red-50",
};

export function Card({
  variant = "default",
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={[
        "rounded-xl shadow-sm overflow-hidden",
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={["px-5 py-4 border-b border-gray-100", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={["px-5 py-4", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "px-5 py-3 border-t border-gray-100 bg-gray-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
