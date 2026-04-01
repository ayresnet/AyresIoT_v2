"use client";

import React from "react";

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const ModernInput: React.FC<ModernInputProps> = ({ label, id, ...props }) => {
  return (
    <div className="space-y-3">
      <label 
        className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] ml-1 transition-colors group-focus-within:text-primary" 
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative group">
        <input 
          {...props}
          id={id}
          className="block w-full px-0 py-3 bg-transparent border-0 border-b-2 border-outline focus:border-primary focus:ring-0 text-on-surface transition-all placeholder:text-on-surface-variant/30 text-base font-body outline-none" 
        />
        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-focus-within:w-full"></div>
      </div>
    </div>
  );
};
