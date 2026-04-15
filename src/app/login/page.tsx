"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthShell } from "@/components/auth/AuthShell";

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
      console.error("Login Error Details:", err);
      // Muestra el mensaje real para debug o un mensaje genérico
      if (err.code === "auth/invalid-credential") {
        setError("Credenciales incorrectas.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError(`Error: El dominio ${window.location.hostname} no está autorizado en Firebase Console.`);
      } else {
        setError(`Error: ${err.message || "No se pudo iniciar sesión"}`);
      }
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Bienvenido"
      subtitle="Ingrese sus credenciales para acceder al ecosistema."
      brandingSubtitle="ECOSISTEMA IOT AVANZADO"
      brandingTitle={
        <>
          El nexo entre el <br />
          <span style={{ color: '#3949AB' }}>espacio</span> y el <br />
          <span style={{ fontStyle: 'italic', fontWeight: 300 }}>control.</span>
        </>
      }
      maxWidth="420px"
    >
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
    </AuthShell>
  );
}
