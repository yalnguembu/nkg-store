"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, MessageCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { config } from "@/lib/config"

export default function CheckoutPage() {
  const { items, total } = useCart()
  const [step, setStep] = useState<"address" | "installation" | "summary">("address")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    city: "",
    region: "",
    postalCode: "",
    country: "CM",
  })
  const [installationServices, setInstallationServices] = useState<string[]>([])
  const [installationNotes, setInstallationNotes] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleInstallation = (serviceId: string) => {
    setInstallationServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const deliveryCost = 5000
  const installationCost = installationServices.length * 25000
  const totalAmount = total + deliveryCost + installationCost

  const generateWhatsAppMessage = () => {
    const itemsList = items
      .map(
        (item) =>
          `• ${item.productName} (x${item.quantity}) - ${(item.unitPrice * item.quantity).toLocaleString("fr-CM")} XAF`,
      )
      .join("%0A")

    const message = `Bonjour, je souhaite confirmer ma commande:%0A%0A${itemsList}%0A%0AClientèle: ${formData.fullName}%0ATéléphone: ${formData.phone}%0AAdresse: ${formData.addressLine1}, ${formData.city}%0A%0ASous-total: ${total.toLocaleString("fr-CM")} XAF%0ALivraison: ${deliveryCost.toLocaleString("fr-CM")} XAF%0AInstallation: ${installationCost.toLocaleString("fr-CM")} XAF%0ATOTAL: ${totalAmount.toLocaleString("fr-CM")} XAF`

    return `https://wa.me/${config.company.phone.replace(/[^0-9]/g, '')}?text=${message}`
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Panier vide</h1>
          <Button asChild>
            <Link href="/shop">Retour à la boutique</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Steps */}
        <div className="flex items-center gap-4 mb-12">
          {(["address", "installation", "summary"] as const).map((s, idx) => (
            <div key={s} className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${step === s || (["address", "installation", "summary"].indexOf(step) > idx)
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                  : "bg-gray-200 text-gray-600"
                  }`}
              >
                {["address", "installation", "summary"].indexOf(s) + 1}
              </div>
              {idx < 2 && (
                <div
                  className={`h-0.5 w-12 ${["address", "installation", "summary"].indexOf(step) > idx ? "bg-gradient-to-r from-amber-500 to-orange-600" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === "address" && (
              <div className="bg-white rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Adresse de livraison</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Nom complet</label>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Téléphone</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+237 696 123 456"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jean@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Adresse</label>
                    <Input
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="123 Rue de la Paix"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Ville</label>
                      <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="Yaoundé" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Région</label>
                      <Input
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        placeholder="Littoral"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Code Postal</label>
                      <Input
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="1000"
                      />
                    </div>
                  </div>
                </form>

                <div className="flex gap-4 mt-8">
                  <Button variant="outline" asChild>
                    <Link href="/cart">
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Retour au panier
                    </Link>
                  </Button>
                  <Button
                    className="ml-auto bg-gradient-to-r from-amber-500 to-orange-600"
                    onClick={() => setStep("installation")}
                    disabled={!formData.fullName || !formData.phone || !formData.addressLine1}
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            )}

            {step === "installation" && (
              <div className="bg-white rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Services d'installation</h2>

                <p className="text-gray-600 mb-6">Sélectionnez les services d'installation dont vous avez besoin:</p>

                <div className="space-y-4 mb-6">
                  {[
                    {
                      id: "basic",
                      name: "Installation basique",
                      price: 25000,
                      desc: "Installation simple - 2-4 heures",
                    },
                    {
                      id: "complete",
                      name: "Installation complète",
                      price: 25000,
                      desc: "Installation avec configuration - 4-6 heures",
                    },
                    {
                      id: "maintenance",
                      name: "Maintenance annuelle",
                      price: 25000,
                      desc: "Vérification et entretien du système",
                    },
                  ].map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={installationServices.includes(service.id)}
                        onChange={() => handleToggleInstallation(service.id)}
                        className="w-5 h-5"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-semibold text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.desc}</p>
                      </div>
                      <span className="font-bold text-amber-600">{service.price.toLocaleString("fr-CM")} XAF</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Notes spéciales (optionnel)</label>
                  <textarea
                    value={installationNotes}
                    onChange={(e) => setInstallationNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3"
                    rows={4}
                    placeholder="Décrivez vos besoins spécifiques..."
                  />
                </div>

                <div className="flex gap-4 mt-8">
                  <Button variant="outline" onClick={() => setStep("address")}>
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Précédent
                  </Button>
                  <Button
                    className="ml-auto bg-gradient-to-r from-amber-500 to-orange-600"
                    onClick={() => setStep("summary")}
                  >
                    Vérifier la commande
                  </Button>
                </div>
              </div>
            )}

            {step === "summary" && (
              <div className="bg-white rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Résumé de la commande</h2>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Articles</h3>
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-gray-600">
                        <span>
                          {item.productName} x{item.quantity}
                        </span>
                        <span>{(item.unitPrice * item.quantity).toLocaleString("fr-CM")} XAF</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">{formData.fullName}</p>
                      <p className="text-sm text-gray-600">
                        {formData.addressLine1}, {formData.city}
                      </p>
                      <p className="text-sm text-gray-600">{formData.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Installation Services */}
                {installationServices.length > 0 && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="font-semibold text-gray-900 mb-2">Services d'installation</p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {installationServices.map((svc) => (
                        <li key={svc}>
                          • {["basic", "complete", "maintenance"].includes(svc) && "Service sélectionné"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  <Button variant="outline" onClick={() => setStep("installation")}>
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Précédent
                  </Button>
                  <Button asChild className="ml-auto bg-gradient-to-r from-amber-500 to-orange-600">
                    <a href={generateWhatsAppMessage()} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 w-4 h-4" />
                      Confirmer via WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="bg-white rounded-lg p-6 h-fit border border-gray-200 sticky top-4">
            <h3 className="font-bold text-lg text-gray-900 mb-6">Résumé</h3>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{total.toLocaleString("fr-CM")} XAF</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>{deliveryCost.toLocaleString("fr-CM")} XAF</span>
              </div>
              {installationCost > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Installation</span>
                  <span>{installationCost.toLocaleString("fr-CM")} XAF</span>
                </div>
              )}
            </div>

            <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
              <span>Total</span>
              <span>{totalAmount.toLocaleString("fr-CM")} XAF</span>
            </div>

            {step === "summary" && (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-700">
                    <p className="font-semibold">Prêt à confirmer</p>
                    <p>Cliquez sur "Confirmer via WhatsApp" pour financer</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
