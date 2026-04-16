"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/app/Header";

export function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/login") return null;
  return <Header />;
}