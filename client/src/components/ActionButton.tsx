import { Link } from "react-router-dom";
import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "secondary"
  | "outline";

type ActionButtonProps = {
  children: ReactNode;
  to?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  fullWidthMobile?: boolean;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

export default function ActionButton({
  children,
  to,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  fullWidthMobile = false,
}: ActionButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center text-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed";

  const mobileWidthClass = fullWidthMobile ? "w-full sm:w-auto" : "";

  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-gray-400 text-white hover:bg-gray-500",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-100",
  };

  const classes = `${baseClasses} ${mobileWidthClass} ${variantClasses[variant]}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}>
      {children}
    </button>
  );
}
