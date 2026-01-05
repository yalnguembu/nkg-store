"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, Truck, Shield, Check, Plus, Minus, ShoppingCart, Heart, ArrowRight, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProductDetailView } from "@/hooks/views/useProductDetailView"
import { formatCurrency } from "@/lib/utils"

export default function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const { product, relatedProducts, isLoading } = useProductDetailView(params.slug)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "documents">("description")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showAddedToCart, setShowAddedToCart] = useState(false)

  const handleAddToCart = () => {
    setShowAddedToCart(true)
    setTimeout(() => setShowAddedToCart(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
          <Button asChild>
            <Link href="/shop">Retour à la boutique</Link>
          </Button>
        </div>
      </div>
    )
  }



  const productImages = product.images && product.images.length > 0
    ? product.images.map(img => img.imageUrl)
    : ["https://placehold.co/500x500?text=No+Image"]

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl auto px-4 py-4">
          <div className="flex gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 font-medium">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gray-900 font-medium">
              Boutique
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-gray-50 rounded-2xl aspect-square flex items-center justify-center mb-6 overflow-hidden border border-gray-100">
              <Image
                src={productImages[0]}
                alt={product.name}
                width={500}
                height={500}
                className="object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-xl aspect-square flex items-center justify-center cursor-pointer hover:border-amber-400 border-2 border-transparent transition-all overflow-hidden"
                  >
                    <Image src={img} alt={`View ${idx}`} width={100} height={100} className="object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Brand & Category */}
            <div className="mb-4 flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider">
                {product.category?.name || "Électricité"}
              </span>
              {product.brand && (
                <span className="text-sm font-bold text-gray-900 uppercase tracking-wide border-l border-gray-300 pl-3">
                  {product.brand.name}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">(128 avis clients)</span>
            </div>

            {/* Price */}
            <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
              <div className="text-4xl font-black text-amber-600 mb-2">
                {product.price ? formatCurrency(product.price) : "Sur devis"}
              </div>
              <div className="flex items-center gap-4 mt-4">
                {product.isDropshipping && (
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <Truck className="w-3 h-3" /> EN STOCK FOURNISSEUR
                  </span>
                )}
                <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                  <Check className="w-3 h-3" /> DISPONIBLE
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-gray mb-8">
              <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
            </div>

            {/* Features Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Truck className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Livraison</p>
                  <p className="text-xs text-gray-500">2-4 jours ouvrés</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Garantie</p>
                  <p className="text-xs text-gray-500">24 mois constructeur</p>
                </div>
              </div>
            </div>

            {/* Installation Option */}
            {product.requiresInstallation && (
              <div className="border-l-4 border-amber-500 rounded-r-xl p-5 mb-8 bg-amber-50/50 flex items-start gap-4">
                <Wrench className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-900">Service d'installation électrique</p>
                  <p className="text-sm text-gray-600">Bénéficiez de l'expertise de nos techniciens agréés pour une mise en service sécurisée.</p>
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-6 mb-8 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-6">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Quantité</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-200 transition-colors">
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="px-6 py-2 font-bold text-lg min-w-[3rem] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-200 transition-colors">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/20"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-3 w-6 h-6" />
                  Ajouter au panier
                </Button>
                <Button size="lg" variant="outline" className="h-14 w-14 p-0 rounded-xl" onClick={() => setIsWishlisted(!isWishlisted)}>
                  <Heart className={`w-6 h-6 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </Button>
              </div>

              {showAddedToCart && (
                <div className="bg-green-500 text-white rounded-xl p-4 text-center font-bold animate-in fade-in slide-in-from-top-2 duration-300">
                  Produit ajouté avec succès !
                </div>
              )}
            </div>

            {/* SKU */}
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <span className="uppercase tracking-widest text-gray-400">Référence:</span> {product.sku}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-t border-gray-100 pt-10">
          <div className="flex gap-10 mb-10 overflow-x-auto pb-2 scrollbar-hide">
            {(["description", "specs", "documents"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-bold text-lg whitespace-nowrap transition-all relative ${activeTab === tab ? "text-amber-600" : "text-gray-400 hover:text-gray-900"
                  }`}
              >
                {tab === "description" && "Description du produit"}
                {tab === "specs" && "Caractéristiques techniques"}
                {tab === "documents" && "Manuels & Certificats"}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600 rounded-full" />}
              </button>
            ))}
          </div>

          <div className="max-w-4xl">
            {activeTab === "description" && (
              <div className="prose prose-amber max-w-none">
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="bg-gray-50 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {product.technicalSpecs && Object.keys(product.technicalSpecs).length > 0 ? (
                  Object.entries(product.technicalSpecs).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
                      <span className="font-bold text-gray-500 uppercase text-sm tracking-wider">{key.replace(/_/g, ' ')}</span>
                      <span className="text-gray-900 font-bold">{String(value)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic col-span-2">Aucune spécification technique détaillée n'est disponible.</p>
                )}
              </div>
            )}

            {activeTab === "documents" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { type: "Manuel d'utilisation", size: "2.4 MB", icon: "📄" },
                  { type: "Fiche technique (PDF)", size: "1.2 MB", icon: "📊" },
                  { type: "Certificat de conformité", size: "0.8 MB", icon: "✓" },
                ].map((doc, i) => (
                  <Button key={i} variant="outline" className="h-20 justify-between bg-white px-6 rounded-2xl border-gray-200 hover:border-amber-400 group transition-all">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{doc.icon}</span>
                      <div className="text-left">
                        <p className="font-bold text-gray-900">{doc.type}</p>
                        <p className="text-xs text-gray-400">{doc.size}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500 transition-colors" />
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-gray-100">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Produits complémentaires</h2>
              <Button variant="ghost" asChild className="text-amber-600 font-bold hover:text-amber-700">
                <Link href="/shop" className="flex items-center gap-2">
                  Toute la boutique <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map((related, index) => (
                <Link key={related.id} href={`/product/${related.slug}`}>
                  <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
                    <div className="h-48 bg-gray-50 flex items-center justify-center p-6">
                      <Image
                        src={related.images?.[0]?.imageUrl || "https://placehold.co/400x400?text=No+Image"}
                        alt={related.name}
                        width={160}
                        height={160}
                        className="object-contain group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm h-10 group-hover:text-amber-600 transition-colors">
                        {related.name}
                      </h3>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-black text-amber-600">
                          {related.price ? formatCurrency(related.price) : "Sur devis"}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

