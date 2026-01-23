"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ShoppingCart, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { config } from "@/lib/config"
import { Phone, MapPin, Facebook, MessageCircle } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="sticky top-0 z-50">
      {/* Top Info Bar */}
      < div className="bg-orange-600 text-white py-1" >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs sm:text-sm">
          <div className="flex items-center gap-4">
            {config.company.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{config.company.location}</span>
              </div>
            )}
            {config.company.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                <a href={`tel:${config.company.phone}`} className="hover:text-orange-100 transition-colors">
                  {config.company.phone.replace(/(\d{3})(?=\d)/g, "$1 ")}
                </a>
              </div>
            )}
            {config.company.phone3 && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                <a href={`tel:${config.company.phone3}`} className="hover:text-orange-100 transition-colors">
                  {config.company.phone3.replace(/(\d{3})(?=\d)/g, "$1 ")}
                </a>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {config.company.facebookUrl && (
              <a
                href={config.company.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-100 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            )}
            {/* WhatsApp via Phone */}
            {config.company.phone2 && (
              <a
                href={`https://wa.me/${config.company.phone2.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-100 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            )}
          </div>
        </div>
      </div >

      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600" />
              <span className="font-semibold text-gray-900 hidden sm:inline">NKG Services</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 pl-2">

              <Link href="/shop" className="text-gray-600 hover:text-gray-900 transition-colors">
                Boutique
              </Link>
              <Link href="/services" className="text-gray-600 hover:text-gray-900 transition-colors">
                Services
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                À propos
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex items-center gap-4 flex-1 mx-8">
              <div className="relative w-full max-w-xs">
                <Input
                  type="search"
                  placeholder="Rechercher des produits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 md:hidden" />
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                  <User className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href="/cart">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    2
                  </span>
                </Link>
              </Button>

              {/* Mobile Menu Toggle */}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden border-t border-gray-100 py-4 space-y-4">
              <Link href="/" className="block text-gray-600 hover:text-gray-900">
                Accueil
              </Link>
              <Link href="/shop" className="block text-gray-600 hover:text-gray-900">
                Boutique
              </Link>
              <Link href="/services" className="block text-gray-600 hover:text-gray-900">
                Services
              </Link>
              <Link href="/about" className="block text-gray-600 hover:text-gray-900">
                À propos
              </Link>
              <div className="pt-4 border-t border-gray-100">
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50"
                />
              </div>
            </div>
          )}
        </div>
      </nav>
    </div >
  )
}
