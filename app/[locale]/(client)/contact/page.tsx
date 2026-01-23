"use client"

import type React from "react"

import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

import { config } from "@/lib/config"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const whatsappMessage = `Nom: ${formData.name}%0AEmail: ${formData.email}%0AObjet: ${formData.subject}%0AMéssage: ${formData.message}`
    window.open(`https://wa.me/${config.company.phone.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`, "_blank")
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-xl text-gray-600">Nous sommes là pour répondre à vos questions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Phone, title: "Téléphone", value: config.company.phone },
            { icon: Mail, title: "Email", value: config.company.email },
            { icon: MapPin, title: "Adresse", value: config.company.location },
          ].map((contact, idx) => {
            const Icon = contact.icon
            return (
              <div key={idx} className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <Icon className="w-8 h-8 text-amber-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{contact.title}</h3>
                <p className="text-gray-600">{contact.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Nom</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Sujet</label>
                <Input
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Sujet du message"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="Votre message..."
                />
              </div>
              <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-amber-500 to-orange-600">
                <MessageCircle className="mr-2 w-4 h-4" />
                Envoyer via WhatsApp
              </Button>
            </form>
          </div>

          {/* Info */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Heures de service</h2>
            <div className="space-y-4 mb-8">
              <div>
                <p className="font-semibold text-gray-900">Lundi - Vendredi</p>
                <p className="text-gray-600">8:00 - 18:00</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Samedi</p>
                <p className="text-gray-600">9:00 - 16:00</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Dimanche</p>
                <p className="text-gray-600">Sur rendez-vous</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Notre équipe est disponible pour répondre à toutes vos questions et vous fournir l'assistance dont vous
              avez besoin.
            </p>

            <Button asChild size="lg" className="w-full bg-gradient-to-r from-amber-500 to-orange-600">
              <a href={`https://wa.me/${config.company.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 w-4 h-4" />
                Envoyer un message
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
