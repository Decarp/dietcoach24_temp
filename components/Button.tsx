import { classNames } from "@/utils/classNames";
import { ReactNode } from "react";

type ButtonProps = {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  loadingIcon?: ReactNode;
  children: ReactNode;
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger";
};

const Button = ({
  onClick,
  loading = false,
  disabled = false,
  className = "",
  icon,
  loadingIcon,
  children,
  loadingText = "Loading...",
  variant = "primary",
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm hover:scale-105 transition-transform";
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-green-700",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={classNames(baseStyles, variantStyles[variant], className)}
      disabled={loading || disabled}
    >
      {loading ? (
        <>
          {loadingIcon && <span className="mr-2">{loadingIcon}</span>}
          {loadingText}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}{" "}
          {/* Render icon if provided */}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
