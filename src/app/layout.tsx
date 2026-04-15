import type { Metadata } from "next";
import { Montserrat, Poppins, Space_Grotesk, Manrope, Inter } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ayresIoT - Acceso Profesional",
  description: "Ecosistema de control IoT moderno y seguro",
  icons: { icon: "/icono_ayresiot_v2.svg" },
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${poppins.variable} ${spaceGrotesk.variable} ${manrope.variable} ${inter.variable} h-full antialiased dark`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <style>{`.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }`}</style>
      </head>
      <body className="min-h-full flex flex-col bg-background font-body text-on-surface selection:bg-primary selection:text-on-primary">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
