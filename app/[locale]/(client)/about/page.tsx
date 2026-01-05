import { ArrowRight, Award, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">À propos de Elektrik Store</h1>
          <p className="text-xl text-gray-600">
            Votre partenaire de confiance pour les solutions électriques depuis plus de 10 ans
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre mission</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Chez Elektrik Store, nous nous engageons à fournir des solutions électriques de qualité supérieure,
              accompagnées d'un service client exceptionnel. Nous croyons que l'électricité de qualité est la base du
              développement durable.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Notre équipe d'experts travaille avec passion pour garantir que chaque client reçoit le meilleur conseil
              et les meilleures solutions pour ses besoins.
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-8 text-white">
            <Zap className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Pourquoi nous choisir?</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Award className="w-5 h-5" />
                <span>10+ ans d'expérience</span>
              </li>
              <li className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <span>+5000 clients satisfaits</span>
              </li>
              <li className="flex items-center gap-3">
                <Zap className="w-5 h-5" />
                <span>Produits premium certifiés</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Values */}
        <div className="bg-gray-50 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Nos valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Qualité", desc: "Nous n'utilisons que des produits et services de premier ordre" },
              { title: "Intégrité", desc: "Transparence totale dans nos prix et nos recommandations" },
              { title: "Excellence", desc: "Dédication à dépasser les attentes de nos clients" },
            ].map((value, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Prêt à explorer?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Découvrez notre large gamme de produits et services</p>
          <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600">
            <Link href="/shop">
              Découvrir la boutique <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
