"use client";

import React from "react";
import { motion } from "framer-motion";

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: React.ReactNode;
}

export const ModernButton: React.FC<ModernButtonProps> = ({ 
  children, 
  loading, 
  icon, 
  className = "", 
  ...props 
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group w-full py-4 bg-primary text-white font-headline font-bold rounded-lg hover:bg-primary-light transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <span>{children}</span>
          {icon && (
            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
              {icon}
            </span>
          )}
        </>
      )}
    </motion.button>
  );
};
