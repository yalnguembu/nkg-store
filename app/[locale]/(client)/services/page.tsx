import { ArrowRight, Zap, Wrench, Lightbulb, BarChart3, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useServicesView } from "@/hooks/views/useServicesView"

export default function ServicesPage() {
  const { services, pricing, isLoading } = useServicesView()

  const iconMap: Record<string, any> = {
    "electrical-installation": Zap,
    "maintenance-repair": Wrench,
    "energy-optimization": Lightbulb,
    "consulting-audit": BarChart3,
  }

  const fallbackIcons = [Zap, Wrench, Lightbulb, BarChart3]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nos Services Professionnels</h1>
          <p className="text-xl text-gray-600">
            Solutions complètes pour tous vos besoins électriques - Expertise reconnue depuis plus de 10 ans
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, idx) => {
            const Icon = iconMap[service.slug] || fallbackIcons[idx % fallbackIcons.length]
            return (
              <div
                key={service.id}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <Icon className="w-12 h-12 text-amber-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-600">Sur devis</span>
                  <Button asChild size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600">
                    <a
                      href={`https://wa.me/237696123456?text=Je%20souhaite%20en%20savoir%20plus%20sur%20votre%20service%20:%20${encodeURIComponent(service.name)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Demander un devis
                    </a>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Pricing */}
        {pricing.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-200 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tarification des services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pricing.map((p) => (
                <div key={p.id} className="bg-white rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{p.serviceType === "ELECTRICAL" ? "Électricité" : "Sécurité"}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Tarif horaire: {Number(p.hourlyRate).toLocaleString("fr-CM")} XAF</p>
                    <p>Coût de déplacement: {Number(p.travelCostPerKm).toLocaleString("fr-CM")} XAF/km</p>
                    {p.pricingRules?.minCharge && (
                      <p>Charge minimale: {Number(p.pricingRules.minCharge).toLocaleString("fr-CM")} XAF</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Vous avez un projet?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Notre équipe d'experts est prête à vous aider. Contactez-nous via WhatsApp pour un devis gratuit et sans
            engagement.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a
              href="https://wa.me/237696123456?text=Bonjour,%20je%20souhaite%20discuter%20d'un%20projet%20électrique"
              target="_blank"
              rel="noreferrer"
            >
              <Phone className="mr-2 w-5 h-5" />
              Contactez-nous sur WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
