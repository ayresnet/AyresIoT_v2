"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Bell, 
  Power, 
  Smartphone, 
  ShieldCheck,
  User as UserIcon,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardLayout() {
  const { dbUser, logout, loading, user } = useAuth();
  const router = useRouter();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  if (!user) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Vista General", roles: ["superadmin", "admin", "user"] },
    { icon: ShieldCheck, label: "Seguridad / Alarma", roles: ["superadmin", "admin", "user"] },
    { icon: Smartphone, label: "Mis Dispositivos", roles: ["superadmin", "admin", "user"] },
    { icon: Users, label: "Gestión de Usuarios", roles: ["superadmin", "admin"] },
    { icon: Bell, label: "Notificaciones", roles: ["superadmin", "admin", "user"] },
    { icon: Settings, label: "Configuración", roles: ["superadmin", "admin", "user"] },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex overflow-hidden">
      
      {/* Sidebar Glass */}
      <aside className="w-72 border-r border-slate-800/50 bg-slate-900/30 backdrop-blur-xl flex flex-col z-20">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Power className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">Ayres<span className="text-blue-500">IoT</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          {menuItems.map((item, index) => {
            if (dbUser && !item.roles.includes(dbUser.role)) return null;
            return (
              <button
                key={index}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 group"
              >
                <item.icon size={20} className="group-hover:text-blue-400 transition-colors" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile Mini */}
        <div className="p-4 border-t border-slate-800/50">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <UserIcon size={20} className="text-blue-400" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate leading-none mb-1">
                {dbUser?.nombre || "Usuario"} {dbUser?.apellido}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                {dbUser?.role || "user"}
              </p>
            </div>
            <button 
              onClick={() => logout()}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Bienvenido, {dbUser?.nombre || "Daniel"}
              </h2>
              <p className="text-slate-400">
                Tu sistema de IoT está operativo y protegido.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-green-500 uppercase">Sistema Online</span>
              </div>
            </div>
          </header>

          {/* Grid de Cards (Placeholder para el futuro) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 h-48 rounded-3xl flex items-center justify-center text-slate-600 border-dashed">
              Próximamente: Estado Alarma
            </div>
            <div className="glass-card p-6 h-48 rounded-3xl flex items-center justify-center text-slate-600 border-dashed">
              Próximamente: Cámaras / Monitor
            </div>
            <div className="glass-card p-6 h-48 rounded-3xl flex items-center justify-center text-slate-600 border-dashed">
              Próximamente: Control de Acceso
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
