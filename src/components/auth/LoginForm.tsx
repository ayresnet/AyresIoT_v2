"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ModernInput } from "@/components/ui/ModernInput";
import { ModernButton } from "@/components/ui/ModernButton";

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Credenciales incorrectas o problema de conexión.");
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 w-full max-w-sm mx-auto"
    >
      <header className="mb-12">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8 text-on-surface">
          <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          <span className="font-headline text-2xl font-bold tracking-tighter">ayresIoT</span>
        </div>
        <h1 className="font-headline text-4xl font-bold mb-4 tracking-tight text-on-surface">Bienvenido</h1>
        <p className="text-on-surface-variant font-medium text-sm leading-relaxed">Ingrese sus credenciales para acceder al ecosistema.</p>
      </header>

      <form onSubmit={handleLogin} className="space-y-8">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        <ModernInput 
          label="Correo Electrónico" 
          id="email" 
          placeholder="nombre@empresa.com" 
          required 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <ModernInput 
          label="Contraseña" 
          id="password" 
          placeholder="••••••••••••" 
          required 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between pt-2">
          <Link className="font-label text-[11px] text-on-surface-variant hover:text-on-surface transition-colors font-medium border-b border-transparent hover:border-on-surface" href="#">
            ¿Problemas de acceso?
          </Link>
        </div>

        <div className="pt-4">
          <ModernButton loading={loading} icon="arrow_forward">
            Ingresar al Sistema
          </ModernButton>
        </div>
      </form>

      <footer className="mt-16">
        <div className="h-px bg-outline/50 w-full opacity-30 mb-8"></div>
        <div className="flex flex-col items-center lg:items-start gap-2">
          <span className="font-label text-[10px] text-on-surface-variant/60 tracking-[0.2em] font-medium text-center lg:text-left">
            Copyright 2026 desarrollado por {" "}
            <a href="https://AyresNet.com" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline font-bold transition-all">
              AyresNet
            </a>
          </span>
        </div>
      </footer>
    </motion.div>
  );
};
