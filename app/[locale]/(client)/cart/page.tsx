"use client"

import Link from "next/link"
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const subtotal = total
  const deliveryCost = items.length > 0 ? 5000 : 0
  const totalAmount = subtotal + deliveryCost

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Panier vide</h1>
          <p className="text-gray-600 mb-8">Commencez vos achats en explorant nos produits</p>
          <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600">
            <Link href="/shop">Continuer les achats</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-6 flex gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0" />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.productName}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.sku}</p>

                    {item.requiresInstallation && (
                      <p className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded w-fit mb-3">
                        Installation disponible
                      </p>
                    )}

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-amber-600 text-lg">
                      {(item.unitPrice * item.quantity).toLocaleString("fr-CM")} XAF
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.unitPrice.toLocaleString("fr-CM")} XAF x {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="mt-6 bg-transparent" onClick={clearCart}>
              Vider le panier
            </Button>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-6 h-fit border border-gray-200">
            <h2 className="font-bold text-lg text-gray-900 mb-6">Résumé</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{subtotal.toLocaleString("fr-CM")} XAF</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>{deliveryCost.toLocaleString("fr-CM")} XAF</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>{totalAmount.toLocaleString("fr-CM")} XAF</span>
              </div>
            </div>

            <Button asChild size="lg" className="w-full bg-gradient-to-r from-amber-500 to-orange-600 mb-3">
              <Link href="/checkout">
                Procéder au paiement <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/shop">Continuer les achats</Link>
            </Button>

            {items.some((i) => i.requiresInstallation) && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  Vous avez des produits nécessitant installation. Vous pourrez ajouter ce service à l'étape suivante.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
