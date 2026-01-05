"use client"

import { useState, useCallback, useEffect } from 'react'
import {
  productsControllerFindBySlug,
  productsControllerFindAll
} from '@/lib/api'
import { Product } from '@/types/product'
import { useToast } from '@/hooks/use-toast'

export function useProductDetailView(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { toast } = useToast()

  const fetchProduct = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await productsControllerFindBySlug({ path: { slug } })
      if (data) {
        const productData = data as any
        setProduct(productData)

        // Fetch related products (same category)
        if (productData.categoryId) {
          const relatedRes = await productsControllerFindAll({
            query: {
              categoryId: productData.categoryId,
              limit: 4,
              isActive: true
            }
          })
          if (relatedRes.data) {
            const responseData = relatedRes.data as any
            const list = responseData?.data?.data || []
            setRelatedProducts(list.filter((p: any) => p.id !== productData.id))
          }
        }
      }
    } catch (error) {
      toast({
        title: 'Error fetching product details',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [slug, toast])

  useEffect(() => {
    if (slug) fetchProduct()
  }, [slug, fetchProduct])

  return {
    product,
    relatedProducts,
    isLoading,
    refresh: fetchProduct
  }
}
