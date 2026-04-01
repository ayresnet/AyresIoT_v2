import React from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export const AuthInput: React.FC<AuthInputProps> = ({ 
  label, 
  showPassword, 
  onTogglePassword, 
  type, 
  ...props 
}) => {
  const isPassword = type === "password" || (type === "text" && onTogglePassword);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', width: '100%' }}>
      <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </label>
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          {...props}
          className="auth-custom-input"
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '1px solid rgba(156, 163, 175, 0.3)',
            padding: '0.75rem 0',
            color: 'white',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'border-bottom-color 0.2s',
          }}
        />
        {onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            style={{
              position: 'absolute',
              right: 0,
              bottom: '0.75rem',
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
            }}
          >
            {showPassword ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            )}
          </button>
        )}
      </div>
      <style jsx>{`
        .auth-custom-input:focus {
          border-bottom-color: #3949AB !important;
        }
      `}</style>
    </div>
  );
};
