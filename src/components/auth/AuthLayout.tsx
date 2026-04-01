import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  branding: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, branding }) => {
  return (
    <div className="login-layout" style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: '#0a0a0c', color: 'white', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {branding}
      
      <div className="login-right" style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#0a0a0c', zIndex: 20 }}>
        <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto', padding: '2rem', position: 'relative', zIndex: 10 }}>
          {/* Mobile Logo Only */}
          <div className="mobile-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <img src="/icono_ayresiot_v2.svg" alt="ayresIoT" style={{ width: '32px', height: '32px' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '-0.025em', color: 'white' }}>ayresIoT</span>
          </div>
          
          {children}

          {/* Footer */}
          <div style={{ marginTop: '4rem', borderTop: '1px solid rgba(31, 41, 55, 0.5)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Copyright 2026 desarrollado por</span>
              <a href="https://AyresNet.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3949AB', fontSize: '10px', fontWeight: 'bold', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AyresNet</a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          .mobile-logo {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
