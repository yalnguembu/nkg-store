"use client"

import { useState, useCallback, useEffect } from "react"
import { ProductImage, Product } from "@/types"
import { productsControllerFindAll, productsControllerFindOne } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"

export function useMediaView() {
  const [images, setImages] = useState<ProductImage[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const { toast } = useToast()
  const t = useTranslations("Media")

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await productsControllerFindAll()
      const responseData = response.data as any
      setProducts(responseData?.data?.data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error fetching products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const fetchProductImages = useCallback(async (productId: string) => {
    if (!productId) {
      setImages([])
      return
    }

    try {
      setIsLoading(true)
      // Attempt to fetch product details which might include images
      const response = await productsControllerFindOne({ path: { id: productId } })
      const product = response.data as any

      if (product && product.images && product.images.length > 0) {
        // Map to ProductImage type
        setImages(product.images.map((img: any, index: number) => ({
          id: img.id || `${productId}-${index}`,
          productId,
          imageUrl: img.imageUrl,
          orderIndex: img.orderIndex || index,
          isPrimary: img.isPrimary,
          createdAt: img.createdAt || new Date().toISOString()
        })))
      } else {
        setImages([])
      }
    } catch (error) {
      console.error("Error fetching images:", error)
      setImages([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    fetchProductImages(selectedProductId)
  }, [selectedProductId, fetchProductImages])

  const handleUpdateMedia = async (data: any) => {
    try {
      // Mock update
      toast({ title: t("saveSuccess") })
      setIsSheetOpen(false)
      fetchProductImages(selectedProductId)
    } catch (error) {
      toast({ title: t("errorSaving"), variant: "destructive" })
    }
  }

  const handleDeleteMedia = async (id: string) => {
    try {
      setImages(prev => prev.filter(img => img.id !== id))
      toast({ title: "Media deleted" })
    } catch (error) {
      toast({ title: "Error deleting media", variant: "destructive" })
    }
  }

  const handleSetPrimary = (id: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isPrimary: img.id === id
    })))
    toast({ title: "Primary image updated" })
  }

  return {
    images,
    products,
    selectedProductId,
    setSelectedProductId,
    isLoading,
    isSheetOpen,
    setIsSheetOpen,
    handleUpdateMedia,
    handleDeleteMedia,
    handleSetPrimary,
    refresh: () => fetchProductImages(selectedProductId)
  }
}
