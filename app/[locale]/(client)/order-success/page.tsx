"use client"

import Link from "next/link"
import { CheckCircle, MessageCircle, Home, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Commande confirmée!</h1>
        <p className="text-gray-600 mb-8">
          Merci pour votre achat. Un agent NKG Services va vous contacter bientôt via WhatsApp pour confirmer votre
          commande et les détails de livraison.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-700">
            Assurez-vous que vous pouvez recevoir des messages WhatsApp sur le numéro fourni.
          </p>
        </div>

        <div className="space-y-3">
          <Button asChild size="lg" className="w-full bg-gradient-to-r from-green-500 to-blue-600">
            <Link href={`https://wa.me/${config.company.phone.replace(/[^0-9]/g, '')}`} target="_blank">
              <MessageCircle className="mr-2 w-5 h-5" />
              Ouvrir WhatsApp
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/shop">
              <ShoppingBag className="mr-2 w-4 h-4" />
              Continuer les achats
            </Link>
          </Button>

          <Button asChild variant="ghost" className="w-full">
            <Link href="/">
              <Home className="mr-2 w-4 h-4" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-8">Numéro WhatsApp: {config.company.phone}</p>
      </div>
    </div>
  )
}
