"use client"

import { useState, useCallback, useEffect } from "react"
import {
  customersControllerFindAll,
  customersControllerCreate,
  customersControllerUpdate,
  customersControllerFindOne
} from "@/lib/api"
import { Customer, Address } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"

export function useCustomerView() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [customerAddresses, setCustomerAddresses] = useState<Record<string, Address[]>>({})

  const { toast } = useToast()
  const t = useTranslations("Customers")

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await customersControllerFindAll()
      if (response.data) {
        const responseData = response.data as any
        const customerList = responseData?.data?.data || []
        setCustomers(customerList)

        // Optionally fetch more details or addresses if the API doesn't include them
      }
    } catch (error) {
      toast({
        title: "Error fetching customers",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const handleOpenAdd = () => {
    setEditingCustomer(null)
    setIsSheetOpen(true)
  }

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setIsSheetOpen(true)
  }

  const handleCloseSheet = () => {
    setIsSheetOpen(false)
    setEditingCustomer(null)
  }

  const handleSave = async (data: any) => {
    try {
      if (editingCustomer) {
        await customersControllerUpdate({
          path: { id: editingCustomer.id },
          body: data
        })
        toast({ title: t("saveSuccess") })
      } else {
        await customersControllerCreate({
          body: data
        })
        toast({ title: t("saveSuccess") })
      }
      handleCloseSheet()
      fetchCustomers()
    } catch (error) {
      toast({
        title: "Error saving customer",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    // customersControllerRemove is not available in API
    toast({
      title: "Delete not implemented",
      description: "Please contact support to delete customers.",
      variant: "destructive"
    })
  }

  const handleToggleStatus = async (customer: Customer) => {
    try {
      await customersControllerUpdate({
        path: { id: customer.id },
        body: { isActive: !customer.isActive } as any
      })
      fetchCustomers()
    } catch (error) {
      toast({
        title: "Error toggling status",
        variant: "destructive",
      })
    }
  }

  return {
    customers,
    isLoading,
    searchTerm,
    setSearchTerm,
    isSheetOpen,
    editingCustomer,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseSheet,
    handleSave,
    handleDelete,
    handleToggleStatus,
    refresh: fetchCustomers
  }
}
