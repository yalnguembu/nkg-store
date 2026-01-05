"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useShopView } from "@/hooks/views/useShopView"
import { formatCurrency } from "@/lib/utils"

export default function ShopPage() {
  const {
    products,
    categories,
    brands,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy
  } = useShopView()

  const [showFilters, setShowFilters] = useState(true)

  const mainCategories = categories.filter((c) => !c.parentId)

  const filteredProducts = useMemo(() => {
    let sorted = [...products]
    if (sortBy === "price-low") {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
    } else if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    return sorted
  }, [products, sortBy])

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Boutique</h1>
          <p className="text-gray-600">Découvrez notre large gamme de produits électriques</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Input
              type="search"
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6 text-lg"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? "block" : "hidden"} md:block md:w-56 flex-shrink-0`}>
            <div className="space-y-6">
              {/* Categories */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                  Catégories
                  <button onClick={() => setShowFilters(false)} className="md:hidden">
                    <X className="w-4 h-4" />
                  </button>
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${!selectedCategory ? "bg-amber-100 text-amber-900" : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    Tous les produits
                  </button>
                  {mainCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat.id ? "bg-amber-100 text-amber-900" : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Marques</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrand === brand.id}
                        onChange={(e) => setSelectedBrand(e.target.checked ? brand.id : null)}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-600">{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Prix (XAF)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Min: {priceRange.min.toLocaleString()}</label>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="5000"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number.parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Max: {priceRange.max.toLocaleString()}</label>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="5000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number.parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedCategory || selectedBrand) && (
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory(null)
                    setSelectedBrand(null)
                    setPriceRange({ min: 0, max: 1000000 })
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-600">
                {isLoading ? "Chargement..." : `${filteredProducts.length} produit${filteredProducts.length !== 1 ? "s" : ""} trouvé${filteredProducts.length !== 1 ? "s" : ""}`}
              </p>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
                  Filtres
                </Button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="featured">Mis en avant</option>
                  <option value="newest">Plus récent</option>
                  <option value="price-low">Prix: moins cher</option>
                  <option value="price-high">Prix: plus cher</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-80"></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <Link key={product.id} href={`/product/${product.slug}`}>
                    <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all group border border-gray-100 h-full flex flex-col">
                      <div className="h-56 bg-gray-50 flex items-center justify-center overflow-hidden">
                        <Image
                          src={product.images?.[0]?.imageUrl || "https://placehold.co/400x400?text=No+Image"}
                          alt={product.name}
                          width={224}
                          height={224}
                          className="group-hover:scale-105 transition-transform object-contain"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                            {categories.find((c) => c.id === product.categoryId)?.name || "Général"}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{product.description}</p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                          <span className="font-bold text-amber-600">
                            {product.price ? formatCurrency(product.price) : "Contactez-nous"}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Aucun produit ne correspond à votre recherche.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

