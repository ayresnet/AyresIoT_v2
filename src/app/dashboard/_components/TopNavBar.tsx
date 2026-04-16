"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

interface TopNavBarProps {
  onMenuClick: () => void;
}

import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

export function TopNavBar({ onMenuClick }: TopNavBarProps) {
  const { user, dbUser, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  
  // Extraer iniciales (Fallback a primera letra del email si no hay nombre en SQL)
  const initials = dbUser?.nombre && dbUser?.apellido 
    ? `${dbUser.nombre[0]}${dbUser.apellido[0]}`.toUpperCase() 
    : user?.email 
      ? user.email[0].toUpperCase()
      : "JD";

  return (
    <header className="fixed top-0 w-full z-50 bg-background/50 backdrop-blur-xl flex justify-between items-center px-4 md:px-6 h-16 border-b border-outline-variant/10">
      <div className="flex items-center flex-1">
        {/* Contenedor Logo - Ancho fijo en desktop para alinear buscador post-sidebar */}
        <div className="flex items-center gap-2 lg:w-[252px] shrink-0">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          
          <div className="flex items-center gap-2">
            <img 
              alt="AyresNet Logo" 
              className="h-8 w-8 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe-qngiMluapnPgt_EUzAdkILyMhqzqLMa1H8KrzdzHSxrX3qHnFK99q3wJdQRBkUCPw36LuxuBElWy6xaUg8K6HHb1Ym49aWIMx2dlRtfFc2YLpwXihWF7nSlSLuq6OV-UQ4rycqyDspKi8ayxsHDguTVRJ5AYgWvSjyQxatNbZXsjVqYT-5lDpz2OIEXDK3uZIGh-IfMsDv6doblnRSJ8GUccofQAIPT9ieTwuCXuN_8LbmYGgD8Fa14CQkHJXMEx_SjuaQpkfFM"
            />
            <span className="text-xl md:text-2xl font-bold tracking-tighter text-primary font-headline">AyresNet</span>
          </div>
        </div>

        {/* Buscador Desktop (ml-5 = 20px) */}
        <div className="hidden md:flex relative items-center ml-5 max-w-md flex-1">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">search</span>
          <input 
            className="bg-surface-container-high border-none rounded-full pl-10 pr-4 py-1.5 text-sm w-full focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/50 outline-none transition-all" 
            placeholder="Buscar dispositivos..." 
            type="text"
          />
        </div>

        {/* Buscador Mobile (Modal/Overlay) */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 bg-background z-[60] flex items-center px-4 gap-3 md:hidden"
            >
              <button onClick={() => setIsSearchOpen(false)} className="p-2 text-on-surface-variant">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
                <input 
                  autoFocus
                  className="bg-surface-container-high border-none rounded-full pl-10 pr-4 py-2.5 text-sm w-full outline-none" 
                  placeholder="Buscar dispositivos..." 
                  type="text"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined">search</span>
        </button>
        <ThemeToggle />
        <button className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="h-8 w-8 rounded-full bg-primary-container flex items-center justify-center text-primary-fixed font-bold text-xs shrink-0">
          {initials}
        </div>
        <button 
          onClick={() => logout()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200 group cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined group-hover:text-error transition-colors">logout</span>
          <span className="hidden lg:inline text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
}
