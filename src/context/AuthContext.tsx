"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { AuthState, UserData } from "@/lib/types/user";

const AuthContext = createContext<AuthState & {
  login: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string, metadata: any) => Promise<any>;
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

  const fetchDBUser = async (firebaseUser: User) => {
    try {
      const response = await fetch(`/api/auth/me?uid=${firebaseUser.uid}&email=${firebaseUser.email}`);
      if (response.ok) {
        const dbData: UserData = await response.json();
        setState({
          user: firebaseUser,
          dbUser: dbData,
          loading: false,
          isAdmin: dbData.role === 'admin' || dbData.role === 'superadmin',
          isSuperAdmin: dbData.role === 'superadmin',
        });
        return dbData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching DB user:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchDBUser(firebaseUser);
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
  
  const signUp = async (email: string, pass: string, metadata: any) => {
    // 1. Crear en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const firebaseUser = userCredential.user;

    // 2. Sincronizar inmediatamente con SQL
    try {
      const syncRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...metadata
        }),
      });

      if (!syncRes.ok) {
        throw new Error("Error al sincronizar con la base de datos local.");
      }

      // 3. Forzar actualización del estado local con datos de SQL
      await fetchDBUser(firebaseUser);
    } catch (error) {
      console.error("SQL Sync Error during signUp:", error);
      throw error;
    }

    return userCredential;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ ...state, login, signUp, logout }}>
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
