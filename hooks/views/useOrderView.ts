"use client"

import { useState, useCallback, useEffect } from "react"
import {
  ordersControllerCreate,
  ordersControllerFindOne,
  ordersControllerUpdateStatus,
  ordersControllerScheduleInstallation,
  ordersControllerFindAll,
  customersControllerFindAll,
} from "@/lib/api"
import { Order, Customer, OrderStatus } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"

export function useOrderView() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const { toast } = useToast()
  const t = useTranslations("Orders")

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [orderRes, custRes] = await Promise.all([
        ordersControllerFindAll({
          query: {
            search: searchTerm,
            limit: 50
          }
        }),
        customersControllerFindAll()
      ])

      if (orderRes.data) {
        const responseData = orderRes.data as any
        setOrders(responseData?.data?.data || [])
      }
      if (custRes.data) {
        const responseData = custRes.data as any
        setCustomers(responseData?.data?.data || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error fetching data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, toast])


  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreateOrder = async (data: any) => {
    try {
      await ordersControllerCreate({
        body: data
      })
      toast({ title: t("saveSuccess") })
      setIsSheetOpen(false)
      fetchData()
    } catch (error) {
      toast({
        title: t("errorSaving"),
        variant: "destructive",
      })
    }
  }

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    try {
      await ordersControllerUpdateStatus({
        path: { id },
        body: { status }
      })
      toast({ title: t("updateStatusSuccess") })
      fetchData()
    } catch (error) {
      toast({
        title: "Error updating status",
        variant: "destructive",
      })
    }
  }

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    return customer?.companyName || customer ? `${customer.firstName} ${customer.lastName}` : "Particulier"
  }

  return {
    orders,
    customers,
    isLoading,
    searchTerm,
    setSearchTerm,
    isSheetOpen,
    setIsSheetOpen,
    selectedOrder,
    setSelectedOrder,
    handleCreateOrder,
    handleUpdateStatus,
    getCustomerName,
    refresh: fetchData
  }
}
