import * as React from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">
          {label}
        </label>
        <div className="relative group">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-200">
              <Icon size={18} />
            </div>
          )}
          <input
            {...props}
            ref={ref}
            className={`
              w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3
              ${Icon ? 'pl-10' : 'pl-4'}
              text-slate-100 placeholder:text-slate-600 outline-none
              focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10
              transition-all duration-200 glass
              ${className}
            `}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
