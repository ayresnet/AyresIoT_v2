"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Credenciales incorrectas.");
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .login-layout { display: flex; min-height: 100vh; width: 100%; background-color: #0a0a0c; color: white; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; }
        .login-left { display: none; width: 60%; position: relative; flex-direction: column; justify-content: space-between; background-color: #070a13; }
        .login-right { flex: 1; position: relative; display: flex; flex-direction: column; justify-content: center; background-color: #0a0a0c; z-index: 20; }
        
        @media (min-width: 1024px) {
          .login-left { display: flex; }
          .mobile-logo { display: none !important; }
        }
      `}} />

      <div className="login-layout">
        
        {/* SECCIÓN IZQUIERDA (ORIGINAL) */}
        <div className="login-left">
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
              <span style={{ fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#d1d5db', fontWeight: 600 }}>ECOSISTEMA IOT AVANZADO</span>
            </div>
            <h1 style={{ fontSize: '5.5rem', fontWeight: 'bold', lineHeight: 1.05, maxWidth: '650px', color: 'white', letterSpacing: '-0.035em' }}>
              El nexo entre el <br />
              <span style={{ color: '#3949AB' }}>espacio</span> y el <br />
              <span style={{ fontStyle: 'italic', fontWeight: 300 }}>control.</span>
            </h1>
          </div>
        </div>

        {/* SECCIÓN DERECHA */}
        <div className="login-right">
          <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
            
            <div className="mobile-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
              <img src="/icono_ayresiot_v2.svg" alt="ayresIoT" style={{ width: '32px', height: '32px' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '-0.025em', color: 'white' }}>ayresIoT</span>
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'white', letterSpacing: '-0.025em' }}>Bienvenido</h2>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: 500 }}>Ingrese sus credenciales para acceder al ecosistema.</p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {error && (
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.875rem', borderRadius: '0.5rem', textAlign: 'center' }}>{error}</div>
              )}

              <AuthInput label="Correo Electrónico" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@empresa.com" />

              <AuthInput 
                label="Contraseña" 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Contraseña" 
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              <div style={{ display: 'flex', borderTop: '1px solid rgba(31, 41, 55, 0.5)', paddingTop: '1.5rem', paddingBottom: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
                <a href="#" style={{ fontSize: '0.75rem', color: '#9ca3af', textDecoration: 'none' }}>¿Problemas de acceso?</a>
                <a href="/register" style={{ fontSize: '0.75rem', color: '#3949AB', fontWeight: 'bold', textDecoration: 'none' }}>Crear una cuenta</a>
              </div>

              <AuthButton loading={loading}>
                Ingresar al Sistema
              </AuthButton>
            </form>

            <div style={{ marginTop: '4rem', borderTop: '1px solid rgba(31, 41, 55, 0.5)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Copyright 2026 desarrollado por</span>
                <a href="https://AyresNet.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3949AB', fontSize: '10px', fontWeight: 'bold', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AyresNet</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
