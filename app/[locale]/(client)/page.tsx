"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Wrench, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShopView } from "@/hooks/views/useShopView";
import { formatCurrency } from "@/lib/utils";
import { HomeBanner } from "@/components/client/HomeBanner";

export default function HomePage() {
  const { products, categories, isLoading } = useShopView();

  const bannerProducts = products.filter((p) => p.images?.length).slice(0, 5);
  const featuredProducts = products.slice(0, 3);
  const mainCategories = categories.filter((c) => !c.parentId);

  return (
    <div className="bg-white">
      {/* Promo Slider Banner */}
      <HomeBanner products={bannerProducts} />

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-[url('/banner.jpg')] bg-cover bg-center shadow-[inset_0_0_0_2000px_rgba(0,0,0,0.7)]">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute -bottom-8 right-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
            Électricité & Services{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              Professionnels
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Solutions électriques complètes pour résidences et entreprises.
            Matériel de qualité et services d'installation experts.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              <Link href="/shop">
                Découvrir la boutique <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">Nos services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Nos Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "Installation",
                desc: "Installations électriques professionnelles",
              },
              {
                icon: Truck,
                title: "Livraison",
                desc: "Livraison rapide partout au Cameroun",
              },
              {
                icon: Shield,
                title: "Garantie",
                desc: "Garantie complète sur tous les produits",
              },
              {
                icon: Wrench,
                title: "Support",
                desc: "Support technique 24/7 disponible",
              },
            ].map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Icon className="w-8 h-8 text-amber-500 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Catégories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading
              ? [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-200 rounded-xl h-64"
                  ></div>
                ))
              : mainCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop?category=${category.id}`}
                    className="group relative h-64 rounded-xl overflow-hidden bg-gray-900"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-600/20 group-hover:from-amber-500/40 group-hover:to-orange-600/40 transition-all" />
                    <div className="absolute inset-0 flex items-end p-6">
                      <div>
                        <h3 className="text-white font-bold text-2xl mb-2">
                          {category.name}
                        </h3>
                        <span className="inline-flex items-center text-amber-400 group-hover:translate-x-2 transition-transform">
                          Explorer <ArrowRight className="ml-2 w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Produits en vedette
            </h2>
            <Button variant="link" asChild>
              <Link href="/shop" className="flex items-center">
                Voir tous les produits <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading
              ? [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-100 rounded-xl h-80"
                  ></div>
                ))
              : featuredProducts.map((product, index) => (
                  <Link key={product.id} href={`/product/${product.slug}`}>
                    <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 group h-full flex flex-col">
                      <div className="h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                        <Image
                          src={
                            product.images?.[0]?.imageUrl ||
                            "https://placehold.co/400x400?text=No+Image"
                          }
                          alt={product.name}
                          width={180}
                          height={180}
                          className="group-hover:scale-105 transition-transform object-contain"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                          <span className="font-bold text-amber-600">
                            {product.price
                              ? formatCurrency(product.price)
                              : "Contactez-nous"}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Besoin d'une installation?
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Nos experts sont prêts à vous aider. Devis gratuit et sans
            engagement.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/services">Demander un devis</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
