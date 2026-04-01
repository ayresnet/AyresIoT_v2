"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { AuthState, UserData } from "@/lib/types/user";

const AuthContext = createContext<AuthState & {
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
} | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    dbUser: null,
    loading: true,
    isAdmin: false,
    isSuperAdmin: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Intentar obtener los datos del usuario desde nuestro SQL
          const response = await fetch(`/api/auth/me?uid=${firebaseUser.uid}`);
          if (response.ok) {
            const dbData: UserData = await response.json();
            setState({
              user: firebaseUser,
              dbUser: dbData,
              loading: false,
              isAdmin: dbData.role === 'admin' || dbData.role === 'superadmin',
              isSuperAdmin: dbData.role === 'superadmin',
            });
          } else {
            // Si no está en SQL todavía
            setState(prev => ({ ...prev, user: firebaseUser, loading: false }));
          }
        } catch (error) {
          console.error("Error al sincronizar con SQL:", error);
          setState(prev => ({ ...prev, user: firebaseUser, loading: false }));
        }
      } else {
        setState({
          user: null,
          dbUser: null,
          loading: false,
          isAdmin: false,
          isSuperAdmin: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
