"use client"

import { useState, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, Truck, Shield, Check, Plus, Minus, ShoppingCart, Heart, ArrowRight, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProductDetailView } from "@/hooks/views/useProductDetailView"
import { formatCurrency } from "@/lib/utils"
import { config } from "@/lib/config"

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { product, relatedProducts, isLoading } = useProductDetailView(slug)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showAddedToCart, setShowAddedToCart] = useState(false)

  // Get current variant or default to product base data
  const currentVariant = product?.variants?.find(v => v.id === selectedVariantId) || product?.variants?.[0]
  
  // Pricing logic
  const unitPrice = currentVariant?.bestPrice?.unitPrice || product?.price || 0
  const bulkPrice = currentVariant?.bestPrice?.bulkPrice || product?.bulkPrice || null
  const bulkMinQty = currentVariant?.bestPrice?.bulkMinQuantity || product?.bulkMinQuantity || null
  
  const isBulkActive = bulkPrice !== null && bulkMinQty !== null && quantity >= bulkMinQty
  const currentUnitPrice = isBulkActive ? bulkPrice : unitPrice
  const totalAmount = currentUnitPrice * quantity

  const handleAddToCart = () => {
    const whatsappMessage = encodeURIComponent(
      `Bonjour, je souhaite commander :\n\n` +
      `📦 *Produit* : ${product?.name}\n` +
      `${currentVariant && currentVariant.name !== 'Default' ? `🎨 *Option* : ${currentVariant.name}\n` : ''}` +
      `🔢 *Quantité* : ${quantity}\n` +
      `💰 *Prix appliqué* : ${formatCurrency(currentUnitPrice)} ${isBulkActive ? '(Tarif de gros)' : '(Tarif unitaire)'}\n` +
      `💵 *Total* : ${formatCurrency(totalAmount)}\n\n` +
      `Merci !`
    )
    window.open(`https://wa.me/${config.company.phone2.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`, "_blank")
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
      <div className="min-h-screen flex items-center justify-center text-center p-20">
        <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
        <Button asChild><Link href="/shop">Boutique</Link></Button>
      </div>
    )
  }

  const productImages = product.images?.length ? product.images.map(img => img.imageUrl) : ["https://placehold.co/500x500?text=No+Image"]

  return (
    <div className="bg-white min-h-screen">
      {/* Dynamic SEO Title (UI only) */}
      <title>{product.metaTitle || `${product.name} | ${product.brand?.name || ''} ${product.category?.name || ''}`}</title>
      
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-amber-600">Accueil</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-amber-600">Boutique</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="bg-gray-50 rounded-2xl aspect-square flex items-center justify-center mb-6 overflow-hidden border border-gray-100">
              <Image
                src={productImages[0]}
                alt={product.name ?? ""}
                width={500}
                height={500}
                className="object-contain"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((img, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl aspect-square p-2 border border-gray-100">
                  <Image src={img} alt="" width={100} height={100} className="object-contain w-full h-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              {product.category && (
                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                   {product.category.imageUrl && (
                    <Image src={product.category.imageUrl} alt="" width={20} height={20} className="rounded-full object-cover" />
                  )}
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">{product.category.name}</span>
                </div>
              )}
              {product.brand && (
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  {product.brand.logoUrl && (
                    <Image src={product.brand.logoUrl} alt="" width={20} height={20} className="object-contain" />
                  )}
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{product.brand.name}</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
            <p className="text-gray-500 mb-6 font-medium">Référence: {currentVariant?.sku || product.sku}</p>

            {/* Pricing Section - Dual Display */}
            <div className="mb-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Unit Price Card */}
                <div className={`p-4 rounded-2xl border-2 transition-all duration-300 ${!isBulkActive ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-gray-100 bg-gray-50/50'}`}>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Prix Unitaire</p>
                  <div className={`text-2xl font-black transition-colors ${!isBulkActive ? 'text-amber-700' : 'text-gray-600'}`}>
                    {formatCurrency(unitPrice)}
                  </div>
                </div>

                {/* Bulk Price Card */}
                {bulkPrice && bulkMinQty ? (
                  <div className={`p-4 rounded-2xl border-2 transition-all duration-300 ${isBulkActive ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-gray-100 bg-gray-50/50'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Prix de Gros</p>
                    </div>
                    <div className={`text-2xl font-black transition-colors ${isBulkActive ? 'text-amber-700' : 'text-gray-600'}`}>
                      {formatCurrency(bulkPrice)}
                    </div>
                    <p className="text-[10px] font-bold text-amber-600 mt-1 uppercase">Dès {bulkMinQty} unités</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50 flex items-center justify-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase text-center">Pas de tarif <br/> de gros</p>
                  </div>
                )}
              </div>

              {/* Total Summary Card */}
              <div className="p-5 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white shadow-lg flex justify-between items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-1">Total à commander</p>
                  <div className="text-3xl font-black tabular-nums">{formatCurrency(totalAmount)}</div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Tarif Appliqué</p>
                   <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${isBulkActive ? 'bg-amber-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                     {isBulkActive ? 'Gros' : 'Unitaire'}
                   </span>
                </div>
              </div>
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 1 && (
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Options disponibles</label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                        (selectedVariantId === v.id || (!selectedVariantId && v.name === 'Default'))
                          ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-md scale-105' 
                          : 'border-gray-200 hover:border-amber-300 text-gray-600'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-6 mb-8">
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Quantité</label>
              <div className="flex items-center bg-white border-2 border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50 border-r border-gray-100">
                  <Minus className="w-4 h-4 text-amber-600" />
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center font-black text-lg focus:outline-none"
                />
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-50 border-l border-gray-100">
                  <Plus className="w-4 h-4 text-amber-600" />
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <Button size="lg" className="flex-1 h-16 text-lg font-black bg-amber-500 hover:bg-amber-600 shadow-xl shadow-amber-200" onClick={handleAddToCart}>
                <ShoppingCart className="mr-3 w-6 h-6" /> Commander via WhatsApp
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <Truck className="w-6 h-6 text-amber-600" />
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase">Livraison</p>
                  <p className="text-xs text-gray-500">Rapide à Douala & Yaoundé</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <Shield className="w-6 h-6 text-amber-600" />
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase">Garantie</p>
                  <p className="text-xs text-gray-500">Produits certifiés NKG</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stacked Sections */}
        <div className="space-y-12">
          {/* Description Card */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-amber-500 rounded-full" />
              Description du produit
            </h2>
            <div className="prose max-w-none text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
              {product.description}
            </div>
          </div>

          {/* Technical Specs Card */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-amber-500 rounded-full" />
              Fiche technique
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.technicalSpecs ? Object.entries(product.technicalSpecs).map(([key, val]) => (
                <div key={key} className="bg-white p-4 rounded-xl border border-gray-200/50 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{key.replace(/_/g, ' ')}</p>
                  <p className="text-gray-900 font-bold">{String(val)}</p>
                </div>
              )) : <p className="text-gray-400 italic">Aucune spécification technique disponible.</p>}
            </div>
          </div>

          {/* Installation if required */}
          {product.requiresInstallation && (
            <div className="bg-amber-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-amber-200">
               <div className="bg-white/20 p-6 rounded-2xl">
                <Wrench className="w-12 h-12" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black mb-2">Service d'installation professionnelle</h3>
                <p className="text-amber-50 text-lg opacity-90 max-w-2xl">
                  Ne prenez aucun risque ! Nos techniciens qualifiés assurent une installation conforme aux normes de sécurité en vigueur. Demandez votre devis d'installation lors de votre commande.
                </p>
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="pt-12">
              <h2 className="text-3xl font-black text-gray-900 mb-12 flex items-center gap-4">
                 Produits similaires
                 <div className="h-px bg-gray-200 flex-1" />
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {relatedProducts.map(related => (
                  <Link key={related.id} href={`/product/${related.slug}`} className="group">
                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <div className="aspect-square bg-gray-50 flex items-center justify-center p-6 grayscale group-hover:grayscale-0 transition-all">
                        <Image src={related.images?.[0]?.imageUrl || "https://placehold.co/400x400?text=No+Image"} alt="" width={200} height={200} className="object-contain" />
                      </div>
                      <div className="p-6">
                        <p className="text-xs font-bold text-amber-600 mb-1 uppercase tracking-widest">{related.category?.name}</p>
                        <h4 className="font-bold text-gray-900 mb-3 line-clamp-2 h-10">{related.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="font-black text-lg text-gray-900">{formatCurrency(related.price)}</span>
                          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all">
                            <ArrowRight className="w-5 h-5" />
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
    </div>
  )
}

