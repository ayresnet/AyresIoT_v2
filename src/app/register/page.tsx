"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthShell } from "@/components/auth/AuthShell";

export default function RegisterPage() {
  const { signUp } = useAuth() as any;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    celular: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      // Metadatos para SQL
      const metadata = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        dni: formData.dni,
        celular: formData.celular
      };

      await signUp(formData.email, formData.password, metadata);
      setLoading(false);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Registration error:", err);
      let message = "Error al crear la cuenta.";
      if (err.code === "auth/email-already-in-use") {
        message = "Este email ya está en uso. Por favor, inicia sesión.";
      } else if (err.code === "auth/weak-password") {
        message = "La contraseña es muy débil.";
      } else if (err.code === "auth/invalid-email") {
        message = "El formato del email no es válido.";
      }
      setError(message);
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Crear Cuenta"
      subtitle="Complete sus datos para acceder al ecosistema."
      brandingSubtitle="PLATAFORMA IOT DE CONTROL"
      brandingTitle={
        <>
          Únete a la <br />
          <span style={{ color: '#3949AB' }}>red</span> de <br />
          <span style={{ fontStyle: 'italic', fontWeight: 300 }}>innovación.</span>
        </>
      }
      maxWidth="520px"
    >
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {error && (
          <div style={{ 
            padding: '0.75rem', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            color: '#ef4444', 
            fontSize: '0.875rem', 
            borderRadius: '0.5rem', 
            textAlign: 'center' 
          }}>
            {error}
          </div>
        )}

        <div className="auth-grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '1.5rem', rowGap: '1.5rem' }}>
          <AuthInput label="Nombre" name="nombre" required value={formData.nombre} onChange={handleChange} placeholder="Ej. Juan" />
          <AuthInput label="Apellido" name="apellido" required value={formData.apellido} onChange={handleChange} placeholder="Ej. Pérez" />
          <AuthInput label="DNI" name="dni" required value={formData.dni} onChange={handleChange} placeholder="Número DNI sin puntos" />
          <AuthInput label="Celular" name="celular" required value={formData.celular} onChange={handleChange} placeholder="+54 9 11 ..." />
          <div className="auth-grid-span-2" style={{ gridColumn: 'span 2' }}>
            <AuthInput label="Email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="nombre@correo.com" />
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
    </AuthShell>
  );
}
