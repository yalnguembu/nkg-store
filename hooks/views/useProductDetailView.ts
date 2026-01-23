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
        const rawProduct = data.data as any

        let displayPrice = 0
        let displayBulkPrice: number | null = null
        let displayBulkMinQuantity: number | null = null

        const variants = rawProduct.variants || []
        if (variants.length > 0) {
          const variantWithPrice = variants.find((v: any) => v.bestPrice?.unitPrice) || variants[0]
          if (variantWithPrice?.bestPrice) {
            displayPrice = variantWithPrice.bestPrice.unitPrice
            displayBulkPrice = variantWithPrice.bestPrice.bulkPrice
            displayBulkMinQuantity = variantWithPrice.bestPrice.bulkMinQuantity
          }
        }

        const enrichedProduct: Product = {
          ...rawProduct,
          price: displayPrice,
          bulkPrice: displayBulkPrice,
          bulkMinQuantity: displayBulkMinQuantity
        }

        setProduct(enrichedProduct)

        // Fetch related products (same category)
        if (enrichedProduct.categoryId) {
          const relatedRes = await productsControllerFindAll({
            query: {
              categoryId: enrichedProduct.categoryId,
              limit: 4,
              isActive: true
            }
          })
          if (relatedRes.data) {
            const responseData = relatedRes.data as any
            const list = (responseData?.data || []) as any[]

            const relatedWithPrice = list
              .filter((p: any) => p.id !== enrichedProduct.id)
              .map(p => {
                let pPrice = 0
                let pBulkPrice: number | null = null
                let pBulkMinQuantity: number | null = null
                const pVariants = p.variants || []
                if (pVariants.length > 0) {
                  const vPrice = pVariants.find((v: any) => v.bestPrice?.unitPrice) || pVariants[0]
                  if (vPrice?.bestPrice) {
                    pPrice = vPrice.bestPrice.unitPrice
                    pBulkPrice = vPrice.bestPrice.bulkPrice
                    pBulkMinQuantity = vPrice.bestPrice.bulkMinQuantity
                  }
                }
                return { 
                  ...p, 
                  price: pPrice,
                  bulkPrice: pBulkPrice,
                  bulkMinQuantity: pBulkMinQuantity
                }
              })

            setRelatedProducts(relatedWithPrice)
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
