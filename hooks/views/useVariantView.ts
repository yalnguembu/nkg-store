"use client"

import { useState, useEffect, useCallback } from 'react'
import {
  productsControllerFindAll,
  productsControllerFindOne,
  variantsControllerCreate,
  variantsControllerUpdate,
  variantsControllerRemove,
  pricesControllerCreate,
  pricesControllerFindByVariant,
  pricesControllerUpdate,
  pricesControllerRemove,
  type CreateVariantDto,
  type UpdateVariantDto,
  type CreatePriceDto,
  type UpdatePriceDto
} from '@/lib/api'
import { Product, ProductVariant, Price as ApiPrice } from '@/types'
import { useToast } from '@/hooks/use-toast'

export function useVariantView() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null)
  const [productDetails, setProductDetails] = useState<Record<string, Product>>({})
  const [isVariantSheetOpen, setIsVariantSheetOpen] = useState(false)
  const [isPriceSheetOpen, setIsPriceSheetOpen] = useState(false)
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null)
  const [editingPrice, setEditingPrice] = useState<ApiPrice | null>(null)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)

  const { toast } = useToast()

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await productsControllerFindAll({
        query: {
          search: searchTerm,
          limit: 100 // Get a good number for variants management
        }
      })
      if (response.data) {
        setProducts((response.data as any).data as Product[])
      }
    } catch (error) {
      toast({
        title: 'Error fetching products',
        description: 'Please try again later',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, toast])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const fetchProductDetails = async (productId: string) => {
    try {
      const response = await productsControllerFindOne({
        path: { id: productId }
      })
      if (response.data) {
        setProductDetails(prev => ({
          ...prev,
          [productId]: response.data as Product
        }))
      }
    } catch (error) {
      toast({
        title: 'Error fetching product variants',
        variant: 'destructive',
      })
    }
  }

  const toggleExpand = (productId: string) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null)
    } else {
      setExpandedProductId(productId)
      if (!productDetails[productId]) {
        fetchProductDetails(productId)
      }
    }
  }

  // Variant Operations
  const openCreateVariant = (productId: string) => {
    setEditingVariant(null)
    setExpandedProductId(productId)
    setIsVariantSheetOpen(true)
  }

  const openEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant)
    setIsVariantSheetOpen(true)
  }

  const saveVariant = async (data: CreateVariantDto | UpdateVariantDto) => {
    try {
      if (editingVariant) {
        await variantsControllerUpdate({
          path: { id: editingVariant.id },
          body: data as UpdateVariantDto
        })
        toast({ title: 'Variant updated successfully' })
      } else if (expandedProductId) {
        await variantsControllerCreate({
          path: { productId: expandedProductId },
          body: data as CreateVariantDto
        })
        toast({ title: 'Variant created successfully' })
      }
      setIsVariantSheetOpen(false)
      if (expandedProductId) fetchProductDetails(expandedProductId)
    } catch (error) {
      toast({
        title: editingVariant ? 'Error updating variant' : 'Error creating variant',
        variant: 'destructive',
      })
    }
  }

  const deleteVariant = async (id: string) => {
    try {
      await variantsControllerRemove({ path: { id } })
      toast({ title: 'Variant deleted successfully' })
      if (expandedProductId) fetchProductDetails(expandedProductId)
    } catch (error) {
      toast({
        title: 'Error deleting variant',
        variant: 'destructive',
      })
    }
  }

  // Price Operations
  const openCreatePrice = (variantId: string) => {
    setEditingPrice(null)
    setSelectedVariantId(variantId)
    setIsPriceSheetOpen(true)
  }

  const openEditPrice = (price: ApiPrice) => {
    setEditingPrice(price)
    setIsPriceSheetOpen(true)
  }

  const savePrice = async (data: any) => {
    try {
      if (editingPrice) {
        await pricesControllerUpdate({
          path: { id: editingPrice.id },
          body: data as UpdatePriceDto
        })
        toast({ title: 'Price updated successfully' })
      } else if (selectedVariantId) {
        await pricesControllerCreate({
          body: {
            ...data,
            variantId: selectedVariantId
          } as CreatePriceDto
        })
        toast({ title: 'Price added successfully' })
      }
      setIsPriceSheetOpen(false)
      if (expandedProductId) fetchProductDetails(expandedProductId)
    } catch (error) {
      toast({
        title: editingPrice ? 'Error updating price' : 'Error adding price',
        variant: 'destructive',
      })
    }
  }

  const deletePrice = async (id: string) => {
    try {
      await pricesControllerRemove({ path: { id } })
      toast({ title: 'Price deleted successfully' })
      if (expandedProductId) fetchProductDetails(expandedProductId)
    } catch (error) {
      toast({
        title: 'Error deleting price',
        variant: 'destructive',
      })
    }
  }

  return {
    products,
    isLoading,
    searchTerm,
    setSearchTerm,
    expandedProductId,
    toggleExpand,
    productDetails,
    isVariantSheetOpen,
    setIsVariantSheetOpen,
    isPriceSheetOpen,
    setIsPriceSheetOpen,
    editingVariant,
    editingPrice,
    openCreateVariant,
    openEditVariant,
    saveVariant,
    deleteVariant,
    openCreatePrice,
    openEditPrice,
    savePrice,
    deletePrice,
  }
}
