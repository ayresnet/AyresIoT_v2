"use client";

import React from "react";

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  brandingTitle: React.ReactNode;
  brandingSubtitle: string;
  maxWidth?: string;
  footerContent?: React.ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({
  children,
  title,
  subtitle,
  brandingTitle,
  brandingSubtitle,
  maxWidth = "420px",
  footerContent
}) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .auth-layout-shell { display: flex; min-height: 100vh; width: 100%; background-color: #0a0a0c; color: white; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; box-sizing: border-box; }
        .auth-left { display: none; width: 60%; position: relative; flex-direction: column; justify-content: space-between; background-color: #070a13; }
        .auth-right { flex: 1; position: relative; display: flex; flex-direction: column; justify-content: center; background-color: #0a0a0c; z-index: 20; overflow-y: auto; overflow-x: hidden; }
        
        .auth-form-container { width: 100%; max-width: ${maxWidth}; margin: 0 auto; padding: 2rem; box-sizing: border-box; position: relative; z-index: 10; }
        .auth-mobile-logo { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2.5rem; }
        
        .auth-footer { margin-top: 2.5rem; border-top: 1px solid rgba(31, 41, 55, 0.3); padding-top: 1.25rem; display: flex; justify-content: center; align-items: center; gap: 0.4rem; }

        @media (min-width: 1024px) {
          .auth-left { display: flex; }
          .auth-mobile-logo { display: none !important; }
          .auth-form-container { padding: 0 2rem; }
        }

        @media (max-width: 768px) {
          .auth-form-container { padding: 3rem 1.5rem; }
          .auth-grid-responsive { grid-template-columns: 1fr !important; }
          .auth-grid-span-2 { grid-column: span 1 !important; }
        }
      `}} />

      <div className="auth-layout-shell">
        
        {/* SECCIÓN IZQUIERDA (BRANDING) */}
        <div className="auth-left">
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtPLHb-FvhV53a7Q3Q8FvuX7U3Gm8ds_AlZUKjKWEqq-UIu4FAk6nAPS5suXpVDS4tD6D3oPlxsoolPxTvMxPIDZklnBzniNJrwBFDB1nKUCub-gI7vLtzUso4IxJs54hrPOMD0yc14THGrcT7jLWAcrD4LRDOexP35TSKcHhCsIcCLKLl5-pRuRLNcdZDmLuPF7AFt_fSx5ny0AgbKrVaYQdLHrzV4Jv9YKTm-121PFMdfP2BkEmGO7LUidv-jGnOLkIpfCbQE1v7')", backgroundSize: 'cover', backgroundPosition: 'center 75%', opacity: 0.4, mixBlendMode: 'screen' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, #0a0a0c)' }}></div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0a0c, transparent)', opacity: 0.8 }}></div>
          </div>

          <div style={{ position: 'relative', zIndex: 10, padding: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img src="/icono_ayresiot_v2.svg" alt="ayresIoT" style={{ width: '40px', height: '40px' }} />
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.025em', color: 'white' }}>ayresIoT</span>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 10, padding: '4rem', paddingBottom: '6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '60px', height: '2px', backgroundColor: '#3949AB' }}></div>
              <span style={{ fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#d1d5db', fontWeight: 600 }}>{brandingSubtitle}</span>
            </div>
            <h1 style={{ fontSize: '5.5rem', fontWeight: 'bold', lineHeight: 1.05, maxWidth: '650px', color: 'white', letterSpacing: '-0.035em' }}>
              {brandingTitle}
            </h1>
          </div>
        </div>

        {/* SECCIÓN DERECHA (FORMULARIO) */}
        <div className="auth-right">
          <div className="auth-form-container">
            
            <div className="auth-mobile-logo">
              <img src="/icono_ayresiot_v2.svg" alt="ayresIoT" style={{ width: '32px', height: '32px' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '-0.025em', color: 'white' }}>ayresIoT</span>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'white', letterSpacing: '-0.025em' }}>{title}</h2>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: 500 }}>{subtitle}</p>
            </div>

            {children}

            {footerContent ? footerContent : (
              <div className="auth-footer">
                <span style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Copyright 2026 desarrollado por</span>
                <a href="https://AyresNet.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3949AB', fontSize: '10px', fontWeight: 'bold', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AyresNet</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
