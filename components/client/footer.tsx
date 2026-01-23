import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Box } from "lucide-react"
import { config } from "@/lib/config"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 mb-4" />
            <h3 className="font-semibold text-white mb-2">NKG Services</h3>
            <p className="text-sm text-gray-400">Votre partenaire de confiance pour tous vos besoins électriques</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Entreprise</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition">
                  Carrières
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition">
                  Retours
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              {config.company.email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-500" />
                  <a href={`mailto:${config.company.email}`} className="hover:text-white transition">
                    {config.company.email}
                  </a>
                </li>
              )}
              {config.company.email2 && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <a href={`mailto:${config.company.email2}`} className="hover:text-white transition">
                    {config.company.email2}
                  </a>
                </li>
              )}
              {config.company.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <a href={`tel:${config.company.phone}`} className="hover:text-white transition">
                    {config.company.phone}
                  </a>
                </li>
              )}
              {config.company.phone2 && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <a href={`tel:${config.company.phone2}`} className="hover:text-white transition">
                    {config.company.phone2}
                  </a>
                </li>
              )}
              {config.company.phone3 && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <a href={`tel:${config.company.phone3}`} className="hover:text-white transition">
                    {config.company.phone3}
                  </a>
                </li>
              )}
              {config.company.pobox && (
                <li className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-orange-500" />
                  <span>{config.company.pobox}</span>
                </li>
              )}
              {config.company.location && (
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>{config.company.location}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2025 NKG Services. Tous droits réservés.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition">
              Confidentialité
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Conditions
            </Link>
            <Link href="/cookies" className="hover:text-white transition">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
