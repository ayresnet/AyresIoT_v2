"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";

export default function RegisterPage() {
  const { signUp } = useAuth() as any;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    celular: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      setLoading(false);
    } catch (err: any) {
      setError("Error al crear la cuenta.");
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
        
        {/* SECCIÓN IZQUIERDA (IGUAL AL LOGIN) */}
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
              <span style={{ fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#d1d5db', fontWeight: 600 }}>PLATAFORMA IOT DE CONTROL</span>
            </div>
            <h1 style={{ fontSize: '5.5rem', fontWeight: 'bold', lineHeight: 1.05, maxWidth: '700px', color: 'white', letterSpacing: '-0.035em' }}>
              Únete a la <br />
              <span style={{ color: '#3949AB' }}>red</span> de <br />
              <span style={{ fontStyle: 'italic', fontWeight: 300 }}>innovación.</span>
            </h1>
          </div>
        </div>

        {/* SECCIÓN DERECHA (REGISTRO - DISEÑO PROFESIONAL DE DOS COLUMNAS) */}
        <div className="login-right" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#0a0a0c', flex: 1, position: 'relative', overflowY: 'auto', overflowX: 'hidden', padding: '2rem 0' }}>
          <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
            
            <div className="mobile-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
              <img src="/icono_ayresiot_v2.svg" alt="ayresIoT" style={{ width: '32px', height: '32px' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '-0.025em', color: 'white' }}>ayresIoT</span>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'white', letterSpacing: '-0.025em' }}>Crear Cuenta</h2>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: 500 }}>Complete sus datos para acceder al ecosistema.</p>
            </div>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {error && (
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.875rem', borderRadius: '0.5rem', textAlign: 'center' }}>{error}</div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '1.5rem', rowGap: '1.5rem' }}>
                <AuthInput label="Nombre" name="nombre" required value={formData.nombre} onChange={handleChange} placeholder="Ej. Juan" />
                <AuthInput label="Apellido" name="apellido" required value={formData.apellido} onChange={handleChange} placeholder="Ej. Pérez" />
                <AuthInput label="DNI" name="dni" required value={formData.dni} onChange={handleChange} placeholder="12.345.678" />
                <AuthInput label="Celular" name="celular" required value={formData.celular} onChange={handleChange} placeholder="+54 9 11 ..." />
                <div style={{ gridColumn: 'span 2' }}>
                  <AuthInput label="Email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="nombre@ejemplo.com" />
                </div>
                <AuthInput 
                  label="Contraseña" 
                  name="password"
                  type="password" 
                  required 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Contraseña" 
                  showPassword={showPassword} 
                  onTogglePassword={() => setShowPassword(!showPassword)} 
                />
                <AuthInput 
                  label="Confirmar" 
                  name="confirmPassword"
                  type="password" 
                  required 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  placeholder="Repetir contraseña" 
                  showPassword={showConfirmPassword} 
                  onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
                <AuthButton loading={loading}>
                  Regístrate ahora
                </AuthButton>
                
                <div style={{ textAlign: 'center' }}>
                  <a href="/login" style={{ fontSize: '0.75rem', color: '#9ca3af', textDecoration: 'none' }}>¿Ya tienes cuenta? <span style={{ color: '#3949AB', fontWeight: 'bold' }}>Regresar al login</span></a>
                </div>
              </div>
            </form>

            <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(31, 41, 55, 0.3)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem' }}>
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
