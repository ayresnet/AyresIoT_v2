import * as React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", isLoading, className = "", ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]",
      secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
      ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
    };

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        ref={ref}
        {...props as any}
        disabled={isLoading || props.disabled}
        className={`
          relative w-full px-4 py-3 rounded-xl font-semibold 
          transition-all duration-200 flex items-center justify-center gap-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${className}
        `}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
