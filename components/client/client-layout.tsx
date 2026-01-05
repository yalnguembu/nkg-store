"use client"

import type React from "react"
import { Navbar } from "./navbar"
import { Footer } from "./footer"
import "@/lib/config"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

