"use client"

import { useState, useCallback, useEffect } from 'react'
import {
  categoriesControllerFindAll,
  categoriesControllerCreate,
  categoriesControllerUpdate,
  categoriesControllerRemove,
  categoriesControllerGetTree,
  type CategoryDto as Category
} from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'

export function useCategoryView() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryTree, setCategoryTree] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined)
  const [viewingCategory, setViewingCategory] = useState<Category | undefined>(undefined)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const { toast } = useToast()
  const t = useTranslations('Categories')

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await categoriesControllerFindAll({})
      if (data && data.data) {
        setCategories(data.data.data || [])
      }

      const { data: treeData } = await categoriesControllerGetTree()
      if (treeData && treeData.data) {
        setCategoryTree(treeData.data || [])
      }
    } catch (error) {
      toast({
        title: 'Error fetching categories',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const openCreate = () => {
    setEditingCategory(undefined)
    setIsSheetOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditingCategory(category)
    setIsSheetOpen(true)
  }

  const closeSheet = () => {
    setIsSheetOpen(false)
    setEditingCategory(undefined)
  }

  const openDetails = (category: Category) => {
    setViewingCategory(category)
    setIsDetailsOpen(true)
  }

  const closeDetails = () => {
    setIsDetailsOpen(false)
    setViewingCategory(undefined)
  }

  const saveCategory = async (categoryData: Partial<Category>) => {
    try {
      if (editingCategory && editingCategory.id) {
        await categoriesControllerUpdate({
          path: { id: editingCategory.id },
          body: categoryData as any
        })
        toast({ title: 'Category updated successfully' })
      } else {
        await categoriesControllerCreate({
          body: categoryData as any
        })
        toast({ title: 'Category created successfully' })
      }
      fetchCategories()
      closeSheet()
    } catch (error) {
      toast({
        title: 'Error saving category',
        variant: 'destructive',
      })
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      await categoriesControllerRemove({ path: { id } })
      toast({ title: 'Category deleted successfully' })
      fetchCategories()
    } catch (error) {
      toast({
        title: 'Error deleting category',
        variant: 'destructive',
      })
    }
  }

  return {
    categories,
    categoryTree,
    isLoading,
    isSheetOpen,
    editingCategory,
    openCreate,
    openEdit,
    closeSheet,
    viewingCategory,
    isDetailsOpen,
    openDetails,
    closeDetails,
    saveCategory,
    deleteCategory,
    refresh: fetchCategories
  }
}
