import React from "react";

interface AuthBrandingProps {
  badgeText?: string;
  title: React.ReactNode;
}

export const AuthBranding: React.FC<AuthBrandingProps> = ({ badgeText, title }) => {
  return (
    <div className="auth-branding-container" style={{ display: 'none', width: '60%', position: 'relative', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#070a13', height: '100%' }}>
      {/* Background Image Area */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtPLHb-FvhV53a7Q3Q8FvuX7U3Gm8ds_AlZUKjKWEqq-UIu4FAk6nAPS5suXpVDS4tD6D3oPlxsoolPxTvMxPIDZklnBzniNJrwBFDB1nKUCub-gI7vLtzUso4IxJs54hrPOMD0yc14THGrcT7jLWAcrD4LRDOexP35TSKcHhCsIcCLKLl5-pRuRLNcdZDmLuPF7AFt_fSx5ny0AgbKrVaYQdLHrzV4Jv9YKTm-121PFMdfP2BkEmGO7LUidv-jGnOLkIpfCbQE1v7')", backgroundSize: 'cover', backgroundPosition: 'center bottom', opacity: 0.4, mixBlendMode: 'screen' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, #0a0a0c)' }}></div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0a0c, transparent)', opacity: 0.8 }}></div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, padding: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/icono_ayresiot_v2.svg" alt="ayresIoT" style={{ width: '40px', height: '40px' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.025em', color: 'white' }}>ayresIoT</span>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, padding: '4rem', paddingBottom: '5rem' }}>
        {badgeText && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '60px', height: '2px', backgroundColor: '#3949AB' }}></div>
            <span style={{ fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#d1d5db', fontWeight: 600 }}>
              {badgeText}
            </span>
          </div>
        )}
        <h1 style={{ fontSize: '5.5rem', fontWeight: 'bold', lineHeight: 1.05, maxWidth: '700px', color: 'white', letterSpacing: '-0.035em' }}>
          {title}
        </h1>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          .auth-branding-container {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};
