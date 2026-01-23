"use client"

import { useState, useCallback, useEffect } from 'react'
import {
  productsControllerFindAll,
  categoriesControllerFindAll,
  brandsControllerFindAll
} from '@/lib/api'
import { Product } from '@/types/product'
import { Category } from '@/types/category'
import { Brand } from '@/types/brand'
import { useToast } from '@/hooks/use-toast'

export function useShopView() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 })
  const [sortBy, setSortBy] = useState('featured')

  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const query: any = {
        limit: 50,
        isActive: true
      }
      if (searchTerm) query.search = searchTerm
      if (selectedCategory) query.categoryId = selectedCategory
      if (selectedBrand) query.brandId = selectedBrand
      if (priceRange.min > 0) query.minPrice = priceRange.min
      if (priceRange.max < 1000000) query.maxPrice = priceRange.max

      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        productsControllerFindAll({ query }),
        categoriesControllerFindAll({ query: { isActive: true } }),
        brandsControllerFindAll({ query: { isActive: true } })
      ])

      if (productsRes.data) {
        const responseData = productsRes.data as any
        const rawProducts = (responseData?.data.data || []) as any[]

        const mappedProducts: Product[] = rawProducts.map(p => {
          const variants = p.variants || []
          let displayPrice = p.price

          if (variants.length > 0) {
            const variantWithPrice = variants.find((v: any) => v.bestPrice) || variants[0]
            if (variantWithPrice) {
              displayPrice = variantWithPrice.bestPrice
            }
          }

          return {
            ...p,
            price: displayPrice
          }
        })

        setProducts(mappedProducts)
      }
      if (categoriesRes.data) {
        const responseData = categoriesRes.data as any
        setCategories(responseData?.data || [])
      }
      if (brandsRes.data) {
        const responseData = brandsRes.data as any
        setCategories(prev => prev)
        // Fix categories extraction properly
        const catResponse = categoriesRes.data.data as any
        setCategories(catResponse?.data || [])

        const brandResponse = brandsRes.data.data as any
        setBrands(brandResponse?.data || [])
      }
    } catch (error) {
      toast({
        title: 'Error fetching shop data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, selectedCategory, selectedBrand, priceRange, toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
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
    setSortBy,
    refresh: fetchData
  }
}
