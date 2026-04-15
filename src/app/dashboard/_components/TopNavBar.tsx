"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

interface TopNavBarProps {
  onMenuClick: () => void;
}

export function TopNavBar({ onMenuClick }: TopNavBarProps) {
  const { dbUser, logout } = useAuth();
  
  // Extraer iniciales (Placeholder JD si no hay)
  const initials = dbUser?.nombre && dbUser?.apellido 
    ? `${dbUser.nombre[0]}${dbUser.apellido[0]}`.toUpperCase() 
    : "JD";

  return (
    <header className="fixed top-0 w-full z-50 bg-[#131313] bg-neutral-900/50 backdrop-blur-xl flex justify-between items-center px-4 md:px-6 h-16 border-b border-outline-variant/10">
      <div className="flex items-center gap-2 md:gap-8">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-full text-neutral-400 hover:bg-neutral-800/50 transition-colors duration-200"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            alt="AyresNet Logo" 
            className="h-8 w-8 object-contain" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe-qngiMluapnPgt_EUzAdkILyMhqzqLMa1H8KrzdzHSxrX3qHnFK99q3wJdQRBkUCPw36LuxuBElWy6xaUg8K6HHb1Ym49aWIMx2dlRtfFc2YLpwXihWF7nSlSLuq6OV-UQ4rycqyDspKi8ayxsHDguTVRJ5AYgWvSjyQxatNbZXsjVqYT-5lDpz2OIEXDK3uZIGh-IfMsDv6doblnRSJ8GUccofQAIPT9ieTwuCXuN_8LbmYGgD8Fa14CQkHJXMEx_SjuaQpkfFM"
          />
          <span className="text-2xl font-bold tracking-tighter text-primary font-headline">AyresNet</span>
        </div>
        <div className="hidden md:flex relative items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">search</span>
          <input 
            className="bg-surface-container-high border-none rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/50 outline-none" 
            placeholder="Buscar dispositivos..." 
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full text-neutral-400 hover:bg-neutral-800/50 transition-colors duration-200">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="h-8 w-8 rounded-full bg-primary-container flex items-center justify-center text-primary-fixed font-bold text-xs">
          {initials}
        </div>
        <button 
          onClick={() => logout()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-neutral-400 hover:bg-neutral-800/50 transition-colors duration-200 group"
        >
          <span className="material-symbols-outlined group-hover:text-error transition-colors">logout</span>
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
}
