"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Truck,
  Shield,
  Check,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  ArrowRight,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductDetailView } from "@/hooks/views/useProductDetailView";
import { formatCurrency } from "@/lib/utils";
import { config } from "@/lib/config";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations("ProductDetails");

  const { product, relatedProducts, isLoading } = useProductDetailView(slug);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  // Get current variant or default to product base data
  const currentVariant =
    product?.variants?.find((v) => v.id === selectedVariantId) ||
    product?.variants?.[0];

  // Pricing logic
  const unitPrice = currentVariant?.bestPrice?.unitPrice || product?.price || 0;
  const bulkPrice =
    currentVariant?.bestPrice?.bulkPrice || product?.bulkPrice || null;
  const bulkMinQty =
    currentVariant?.bestPrice?.bulkMinQuantity ||
    product?.bulkMinQuantity ||
    null;

  const isBulkActive =
    bulkPrice !== null && bulkMinQty !== null && quantity >= bulkMinQty;
  const currentUnitPrice = isBulkActive ? bulkPrice : unitPrice;
  const totalAmount = currentUnitPrice * quantity;

  const handleAddToCart = () => {
    const whatsappMessage = encodeURIComponent(
      `Bonjour, je souhaite commander :\n\n` +
        `📦 *Produit* : ${product?.name}\n` +
        `${currentVariant && currentVariant.name !== "Default" ? `🎨 *Option* : ${currentVariant.name}\n` : ""}` +
        `🔢 *Quantité* : ${quantity}\n` +
        `💰 *Prix appliqué* : ${formatCurrency(currentUnitPrice)} ${isBulkActive ? `(${t("bulkRate")})` : `(${t("unitRate")})`}\n` +
        `💵 *Total* : ${formatCurrency(totalAmount)}\n\n` +
        `Merci !`,
    );
    window.open(
      `https://wa.me/${config.company.phone2.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`,
      "_blank",
    );
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-20">
        <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
        <Button asChild>
          <Link href="/shop">Boutique</Link>
        </Button>
      </div>
    );
  }

  const productImages = product.images?.length
    ? product.images.map((img) => img.imageUrl)
    : ["https://placehold.co/500x500?text=No+Image"];

  return (
    <div className="bg-[#FCFBFA] min-h-screen font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Dynamic SEO Title */}
      <title>
        {product.metaTitle || `${product.name} | ${product.brand?.name || ""}`}
      </title>

      {/* Breadcrumbs - Softened */}
      <div className="border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Accueil
            </Link>
            <span className="opacity-30">/</span>
            <Link
              href="/shop"
              className="hover:text-amber-600 transition-colors"
            >
              Boutique
            </Link>
            <span className="opacity-30">/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Gallery Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] aspect-square flex items-center justify-center overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group">
              <Image
                src={productImages[0]}
                alt={product.name ?? ""}
                width={700}
                height={700}
                className="object-contain p-12 group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  className="bg-white rounded-2xl aspect-square p-3 border border-gray-100 hover:border-amber-300 transition-all shadow-sm active:scale-95"
                >
                  <Image
                    src={img}
                    alt=""
                    width={150}
                    height={150}
                    className="object-contain w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Core Info Section */}
          <div className="flex flex-col justify-center">
            <div className="mb-8 flex flex-wrap gap-3 items-center">
              {product.category && (
                <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-amber-100/50">
                  {product.category.name}
                </span>
              )}
              {product.brand && (
                <span className="bg-gray-50 text-gray-500 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-gray-100">
                  {product.brand.name}
                </span>
              )}
            </div>

            <h1 className="text-5xl lg:text-4xl font-black text-gray-900 mb-4 leading-[1.05] tracking-tight">
              {product.name}
            </h1>

            {/* Premium Pricing Section - Soft & Airy */}
            <div className="mb-12 relative">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-6xl font-black text-amber-700 tracking-tighter">
                  {formatCurrency(currentUnitPrice)}
                </span>
                <span className="text-2xl font-bold text-gray-300 line-through opacity-50">
                  {formatCurrency(unitPrice * 1.2)}{" "}
                  {/* Mock comparison for premium feel */}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <div
                  className={`px-4 py-2 rounded-2xl border flex items-center gap-2 transition-all ${isBulkActive ? "bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-200" : "bg-white text-gray-600 border-gray-100 shadow-sm"}`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {isBulkActive ? t("bulkRate") : t("unitRate")}
                  </span>
                </div>
                {bulkPrice && !isBulkActive && (
                  <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2 animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                      Save with {t("bulkPrice")} ({formatCurrency(bulkPrice)})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart Area - High Contrast focal point in a soft world */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20">
                <div className="flex items-center px-4 bg-gray-50 rounded-2xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-amber-600 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-14 text-center font-black text-xl bg-transparent focus:outline-none text-gray-900"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-amber-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="flex-1 h-16 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-xl shadow-amber-200 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="text-lg font-black tracking-tight">
                    {t("orderViaWhatsApp")}
                  </span>
                </Button>
              </div>

              {/* Total Summary - Subtle Integration */}
              <div className="flex items-center justify-between px-8 py-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                <span className="text-xs font-bold text-amber-800/60 uppercase tracking-widest">
                  {t("totalToOrder")}
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-black text-amber-900">
                    {formatCurrency(totalAmount)}
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter opacity-70">
                    Incl. all taxes
                  </span>
                </div>
              </div>
            </div>

            {/* Trusts Badges */}
            <div className="grid grid-cols-2 gap-4 mt-12">
              <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-gray-50 shadow-sm">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                    {t("delivery")}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {t("deliveryDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-gray-50 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                    {t("warranty")}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {t("warrantyDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs Refined as Sections */}
        <div className="space-y-32">
          {/* Options Section - Soft Grid */}
          {product.variants && product.variants.length > 0 && (
            <section className="scroll-mt-32" id="options">
              <div className="flex flex-col items-center mb-16 text-center max-w-2xl mx-auto">
                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">
                  {t("availableOptions")}
                </h2>
                <p className="text-gray-400 font-medium leading-relaxed">
                  Personnalisez votre commande en choisissant l'une des
                  configurations premium ci-dessous.
                </p>
                <div className="w-20 h-1 bg-amber-500 mt-6 rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10">
                {product.variants.map((v) => {
                  const isSelected =
                    selectedVariantId === v.id ||
                    (!selectedVariantId && v.name === "Default");
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`group relative cursor-pointer p-8 rounded-[3rem] transition-all duration-700 border-2 ${isSelected ? "bg-white border-amber-500 shadow-[0_40px_100px_-20px_rgba(245,158,11,0.15)]" : "bg-transparent border-gray-100 hover:border-amber-200"}`}
                    >
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h4
                            className={`text-2xl font-black mb-1 transition-colors ${isSelected ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"}`}
                          >
                            {v.name}
                          </h4>
                          <span className="text-[10px] font-bold text-amber-600/60 uppercase tracking-widest">
                            Variation
                          </span>
                        </div>
                        {isSelected && (
                          <div className="bg-amber-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200 transition-transform hover:scale-110">
                            <Check className="w-5 h-5 stroke-[3px]" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 mb-10">
                        {v.attributes &&
                          Object.entries(v.attributes).map(([key, val]) => (
                            <div
                              key={key}
                              className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 opacity-80"
                            >
                              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                {key}
                              </span>
                              <span className="text-xs font-black text-gray-800">
                                {String(val)}
                              </span>
                            </div>
                          ))}
                      </div>

                      <div className="mt-auto flex items-end justify-between">
                        <div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                            Price
                          </p>
                          <p
                            className={`text-2xl font-black ${isSelected ? "text-amber-600" : "text-gray-400 group-hover:text-amber-600/60"}`}
                          >
                            {formatCurrency(
                              v.bestPrice?.unitPrice || product.price || 0,
                            )}
                          </p>
                        </div>
                        <div
                          className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest transition-all ${isSelected ? "bg-amber-100 text-amber-700" : "bg-gray-50 text-gray-300"}`}
                        >
                          {isSelected ? t("selected") : t("select")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Detailed Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Description Card */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-amber-500 rounded-full" />
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                  {t("description")}
                </h2>
              </div>
              <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden group">
                <div className="prose prose-amber max-w-none text-gray-500 leading-relaxed text-lg whitespace-pre-wrap font-medium">
                  {product.description}
                </div>
              </div>
            </div>

            {/* Technical Specs Card */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-amber-500 rounded-full" />
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                  {t("technicalSpecs")}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {product.technicalSpecs ? (
                  Object.entries(product.technicalSpecs).map(([key, val]) => (
                    <div
                      key={key}
                      className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2">
                        {key.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm font-black text-gray-900 line-clamp-2">
                        {String(val)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-12 text-center text-gray-300 italic">
                    Aucune spécification technique disponible.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Installation - Softened Dark Theme */}
          {product.requiresInstallation && (
            <div className="bg-[#1A1A1A] rounded-[4rem] p-16 text-white flex flex-col lg:flex-row items-center gap-12 shadow-2xl shadow-gray-300/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />
              <div className="bg-amber-500 p-10 rounded-[2.5rem] shadow-2xl shadow-amber-500/30 transform transition-transform group-hover:scale-110">
                <Wrench className="w-16 h-16 text-white" />
              </div>
              <div className="text-center lg:text-left relative z-10 flex-1 space-y-4">
                <h3 className="text-4xl font-black tracking-tight">
                  {t("installationService")}
                </h3>
                <p className="text-gray-400 text-xl leading-relaxed max-w-2xl font-medium opacity-80">
                  {t("installationServiceDesc")}
                </p>
              </div>
              <Button
                onClick={handleAddToCart}
                className="h-20 px-12 rounded-3xl bg-white text-gray-900 hover:bg-amber-50 font-black text-lg shadow-xl"
              >
                Demander l'installation
              </Button>
            </div>
          )}

          {/* Recommendation Header */}
          {relatedProducts.length > 0 && (
            <div className="pt-20">
              <div className="flex flex-col items-center mb-16 text-center">
                <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight uppercase">
                  Vous aimerez aussi
                </h2>
                <p className="text-gray-400 font-medium">
                  Découvrez notre sélection de produits complémentaires
                  sélectionnés pour vous.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/product/${related.slug}`}
                    className="group relative"
                  >
                    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
                      <div className="aspect-[4/5] bg-[#F9F9F8] flex items-center justify-center p-8 overflow-hidden">
                        <Image
                          src={
                            related.images?.[0]?.imageUrl ||
                            "https://placehold.co/400x400?text=No+Image"
                          }
                          alt=""
                          width={300}
                          height={400}
                          className="object-contain transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-8">
                        <p className="text-[10px] font-black text-amber-600/60 mb-2 uppercase tracking-[0.2em]">
                          {related.category?.name}
                        </p>
                        <h4 className="font-extrabold text-gray-900 mb-6 line-clamp-2 leading-snug">
                          {related.name}
                        </h4>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-black text-2xl text-gray-900">
                            {formatCurrency(related.price)}
                          </span>
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 shadow-sm border border-gray-100 group-hover:border-amber-400">
                            <ArrowRight className="w-6 h-6 stroke-[3px]" />
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
  );
}
