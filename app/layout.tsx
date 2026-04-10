import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/app/Header";
import { Providers } from "@/app/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Secure Campus IA", // Te cambié el título por defecto para que quede más pro
  description: "Sistema de Control de Acceso",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      translate="no"
      className={`${geistSans.variable} ${geistMono.variable} h-[100dvh] antialiased overflow-hidden`}
      suppressHydrationWarning
    >
      <body 
        className="h-full flex flex-col overflow-hidden"
        suppressHydrationWarning
      >
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}