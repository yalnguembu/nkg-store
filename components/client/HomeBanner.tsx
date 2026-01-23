"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";

interface HomeBannerProps {
  products: Product[];
}

export function HomeBanner({ products }: HomeBannerProps) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [api]);

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full py-0 pb-10">
      <div className="w-full">
        <Carousel setApi={setApi} opts={{ loop: true }}>
          <CarouselContent className="-ml-0">
            {products.map((product) => {
              const promo = Math.floor(Math.random() * (70 - 15 + 1)) + 15;

              return (
                <CarouselItem key={product.id} className="pl-0">
                  <div className="relative h-[250px] mt-4 md:h-[350px] w-full bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 overflow-hidden shadow-2xl group">
                    {/* Logo Badge */}
                    <div className="absolute bottom-6 right-6 md:bottom-10 rounded-full bg-white md:right-10 w-16 h-16 md:w-32 md:h-32 z-20 opacity-90 drop-shadow-2xl">
                      <Image
                        src="/logo.png"
                        alt="Logo NKG Services"
                        width={500}
                        height={500}
                        className="object-contain w-full h-full relative z-10 drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
                      />
                    </div>

                    {/* Background Image/Effect */}
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity">
                      <Image
                        src={
                          product.images?.[0]?.imageUrl ||
                          "https://placehold.co/1200x600?text=Premium+Material"
                        }
                        alt=""
                        fill
                        className="object-cover scale-105 blur-[2px] group-hover:scale-100 transition-transform duration-1000"
                      />
                    </div>

                    <div className="relative h-full w-full flex flex-col md:flex-row items-center px-8 md:px-24 gap-8">
                      {/* Content Left */}
                      <div className="flex-1 text-center md:text-left pt-16 md:pt-0 z-10">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                          <span className="bg-red-600 text-white text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-1 animate-pulse shadow-lg shadow-red-600/20">
                            <Zap className="w-3 h-3" /> VENTE FLASH
                          </span>
                          <span className="bg-amber-500 text-black text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-amber-500/20">
                            -{promo}%
                          </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 line-clamp-2 leading-[1.1] tracking-tight">
                          {product.name}
                        </h2>

                        <div className="flex items-center justify-center md:justify-start gap-6 mb-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-amber-500 tracking-[0.2em] uppercase mb-1">
                              Prix Promo
                            </span>
                            <span className="text-xl md:text-3xl font-black text-amber-400 drop-shadow-sm">
                              {formatCurrency(
                                product.variants?.[0]?.bestPrice?.unitPrice ??
                                  0,
                              )}
                            </span>
                          </div>
                          <div className="flex flex-col border-l border-white/20 pl-6">
                            <span className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase mb-1">
                              Prix Normal
                            </span>
                            <span className="text-xl md:text-2xl text-white/50 line-through font-bold">
                              {formatCurrency(
                                (product.variants?.[0]?.bestPrice?.unitPrice ??
                                  0) /
                                  (1 - promo / 100),
                              )}
                            </span>
                          </div>
                        </div>

                        <Button
                          asChild
                          size="lg"
                          className="bg-white text-black hover:bg-amber-500 hover:text-white font-black px-10 h-10 md:h-12 rounded-2xl transition-all shadow-2xl shadow-black/40 hover:scale-105 active:scale-95"
                        >
                          <Link
                            href={`/product/${product.slug}`}
                            className="flex items-center gap-3 text-base md:text-lg"
                          >
                            PRODUIT EN VEDETTE
                            <ArrowRight className="w-6 h-6" />
                          </Link>
                        </Button>
                      </div>

                      {/* Image Right */}
                      <div className="hidden md:flex flex-1 justify-center items-center h-full relative z-10">
                        <div className="w-64 h-64 lg:w-[400px] lg:h-[400px] relative transition-all duration-700 hover:scale-110">
                          <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-[100px] animate-pulse" />
                          <Image
                            src={
                              product.images?.[0]?.imageUrl ||
                              "https://placehold.co/400x400?text=Product"
                            }
                            alt={product.name}
                            width={400}
                            height={400}
                            className="object-contain w-full h-full relative z-10 drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
