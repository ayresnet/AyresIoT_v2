import React from "react";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ 
  children, 
  loading, 
  ...props 
}) => {
  return (
    <button 
      disabled={loading} 
      {...props}
      style={{ 
        width: '100%', 
        backgroundColor: '#1A237E', 
        color: 'white', 
        fontWeight: 600, 
        padding: '1rem 1.5rem', 
        borderRadius: '0.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        border: 'none', 
        cursor: loading ? 'not-allowed' : 'pointer', 
        boxShadow: '0 4px 14px 0 rgba(26, 35, 126, 0.39)',
        transition: 'all 0.2s ease-in-out',
        ...props.style
      }}
      className="auth-button"
    >
      <span style={{ fontSize: '0.875rem', letterSpacing: '0.025em' }}>
        {loading ? 'Procesando...' : children}
      </span>
      {!loading && (
        <svg style={{ width: '20px', height: '20px', stroke: 'currentColor' }} fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
      )}
      <style jsx>{`
        .auth-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px 0 rgba(26, 35, 126, 0.45);
        }
        .auth-button:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
    </button>
  );
};
