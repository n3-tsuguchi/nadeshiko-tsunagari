import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-pink-600 text-white hover:bg-pink-700 active:bg-pink-800 border border-pink-600",
  secondary:
    "bg-white text-gray-900 hover:bg-gray-100 active:bg-gray-200 border border-gray-300",
  danger:
    "bg-red-700 text-white hover:bg-red-800 active:bg-red-900 border border-red-700",
  ghost:
    "bg-transparent text-gray-900 hover:bg-gray-100 active:bg-gray-200 border border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-[40px] px-3 py-2 text-base rounded-md",
  md: "min-h-[48px] px-5 py-3 text-lg rounded-lg",
  lg: "min-h-[56px] px-6 py-4 text-xl font-semibold rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center font-medium transition-colors duration-150",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600",
        "disabled:opacity-50 disabled:pointer-events-none",
        "select-none cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
