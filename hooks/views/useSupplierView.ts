"use client"

import { useState, useCallback, useEffect } from "react"
import {
  suppliersControllerFindAll,
  suppliersControllerCreate,
  suppliersControllerUpdate,
  suppliersControllerRemove
} from "@/lib/api"
import { Supplier } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"

export function useSupplierView() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  const { toast } = useToast()
  const t = useTranslations("Suppliers")

  const fetchSuppliers = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await suppliersControllerFindAll({
        query: {
          search: searchTerm || undefined,
          limit: 100
        }
      })
      if (response.data) {
        const responseData = response.data as any
        setSuppliers(responseData?.data?.data || [])
      }
    } catch (error) {
      toast({
        title: t("errorFetching"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, toast, t])

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  const handleOpenAdd = () => {
    setEditingSupplier(null)
    setIsSheetOpen(true)
  }

  const handleOpenEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setIsSheetOpen(true)
  }

  const handleCloseSheet = () => {
    setIsSheetOpen(false)
    setEditingSupplier(null)
  }

  const handleSave = async (data: any) => {
    try {
      if (editingSupplier) {
        await suppliersControllerUpdate({
          path: { id: editingSupplier.id },
          body: data
        })
        toast({ title: t("updateSuccess") })
      } else {
        await suppliersControllerCreate({
          body: data
        })
        toast({ title: t("createSuccess") })
      }
      handleCloseSheet()
      fetchSuppliers()
    } catch (error) {
      toast({
        title: "Error saving supplier",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return
    try {
      await suppliersControllerRemove({
        path: { id }
      })
      toast({ title: t("deleteSuccess") })
      fetchSuppliers()
    } catch (error) {
      toast({
        title: "Error deleting supplier",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (supplier: Supplier) => {
    try {
      await suppliersControllerUpdate({
        path: { id: supplier.id },
        body: { isActive: !supplier.isActive }
      })
      fetchSuppliers()
    } catch (error) {
      toast({
        title: "Error toggling status",
        variant: "destructive",
      })
    }
  }

  return {
    suppliers,
    isLoading,
    searchTerm,
    setSearchTerm,
    isSheetOpen,
    editingSupplier,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseSheet,
    handleSave,
    handleDelete,
    handleToggleStatus,
    refresh: fetchSuppliers
  }
}
