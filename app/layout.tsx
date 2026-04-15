import type { Metadata } from "next";
import { Header } from "@/app/Header";
import { Providers } from "@/app/providers";
import { ConditionalHeader } from "@/app/conditionalHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secure Campus IA",
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
      className="h-[100dvh] antialiased overflow-hidden font-sans"
      suppressHydrationWarning
    >
      <body 
        className="h-full flex flex-col overflow-hidden"
        suppressHydrationWarning
      >
        <Providers>
      <ConditionalHeader />
       {children}
      </Providers>
      </body>
    </html>
  );
}