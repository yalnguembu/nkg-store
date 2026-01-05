"use client"

import { useState, useCallback, useEffect } from 'react'
import {
  productsControllerFindAll,
  productsControllerRemove,
  productsControllerDuplicate,
  categoriesControllerFindAll,
  brandsControllerFindAll,
  suppliersControllerFindAll,
  modelControllerFindAll
} from '@/lib/api'
import { Product } from '@/types/product'
import { Category } from '@/types/category'
import { Brand } from '@/types/brand'
import { Supplier } from '@/types/supplier'
import { Model } from '@/hooks/views/useModelView'
import { useToast } from '@/hooks/use-toast'

export function useProductView() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [productsRes, categoriesRes, brandsRes, suppliersRes, modelsRes] = await Promise.all([
        productsControllerFindAll({ query: searchTerm ? { search: searchTerm } : undefined }),
        categoriesControllerFindAll({}),
        brandsControllerFindAll({}),
        suppliersControllerFindAll({}),
        modelControllerFindAll({})
      ])

      if (productsRes.data) {
        const responseData = productsRes.data as any
        const productList = responseData?.data?.data || []
        setProducts(productList)
      }
      if (categoriesRes.data) {
        const responseData = categoriesRes.data as any
        setCategories(responseData?.data?.data || [])
      }
      if (brandsRes.data) {
        const responseData = brandsRes.data as any
        setBrands(responseData?.data?.data || [])
      }
      if (suppliersRes.data) {
        const responseData = suppliersRes.data as any
        setSuppliers(responseData?.data?.data || [])
      }
      if (modelsRes.data) {
        const responseData = modelsRes.data as any
        setModels(responseData?.data || [])
      }
    } catch (error) {
      toast({
        title: 'Error fetching products',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const deleteProduct = async (id: string) => {
    try {
      await productsControllerRemove({ path: { id } })
      toast({ title: 'Product deleted successfully' })
      fetchData()
    } catch (error) {
      toast({
        title: 'Error deleting product',
        variant: 'destructive',
      })
    }
  }

  const duplicateProduct = async (id: string) => {
    try {
      await productsControllerDuplicate({ path: { id } })
      toast({ title: 'Product duplicated successfully' })
      fetchData()
    } catch (error) {
      toast({
        title: 'Error duplicating product',
        variant: 'destructive',
      })
    }
  }

  return {
    products,
    categories,
    brands,
    models,
    suppliers,
    isLoading,
    searchTerm,
    setSearchTerm,
    deleteProduct,
    duplicateProduct,
    refresh: fetchData
  }
}
