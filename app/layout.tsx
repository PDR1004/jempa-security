import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import { Header } from "@/app/Header";
import { Providers } from "@/app/providers";
import "./globals.css";

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
});

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
      className={`h-[100dvh] overflow-hidden ${pressStart.variable} ${vt323.variable}`}
      suppressHydrationWarning
    >
      <body
        className="mc-body h-full flex flex-col overflow-hidden"
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
