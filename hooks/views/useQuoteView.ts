"use client"

import { useState, useCallback, useEffect } from "react"
import {
  quotesControllerCreate,
  quotesControllerFindOne,
  quotesControllerAccept,
  quotesControllerReject,
} from "@/lib/api"
import { Quote, Order } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"

export function useQuoteView() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const { toast } = useToast()
  const t = useTranslations("Quotes")

  const fetchQuotes = useCallback(async () => {
    try {
      setIsLoading(true)

      const { client } = await import("@/lib/api/client.gen")
      const response = await client.get<any>({ url: '/quotes' })

      if (response.data) {
        const responseData = response.data as any
        setQuotes(responseData?.data?.data || [])
      }

      // Fetch orders for referencing
      const ordersRes = await client.get<any>({ url: '/orders' })
      if (ordersRes.data) {
        const responseData = ordersRes.data as any
        setOrders(responseData?.data?.data || [])
      }

    } catch (error) {
      toast({
        title: "Error fetching quotes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchQuotes()
  }, [fetchQuotes])

  const handleCreateQuote = async (data: any) => {
    try {
      await quotesControllerCreate({
        body: data
      })
      toast({ title: t("saveSuccess") })
      setIsSheetOpen(false)
      fetchQuotes()
    } catch (error) {
      toast({
        title: t("errorSaving"),
        variant: "destructive",
      })
    }
  }

  const handleAccept = async (id: string) => {
    try {
      await quotesControllerAccept({
        path: { id },
        body: {} // Accepted body if needed
      })
      toast({ title: "Quote accepted" })
      fetchQuotes()
    } catch (error) {
      toast({
        title: "Error accepting quote",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (id: string) => {
    try {
      await quotesControllerReject({
        path: { id }
      })
      toast({ title: "Quote rejected" })
      fetchQuotes()
    } catch (error) {
      toast({
        title: "Error rejecting quote",
        variant: "destructive",
      })
    }
  }

  return {
    quotes,
    orders,
    isLoading,
    searchTerm,
    setSearchTerm,
    isSheetOpen,
    setIsSheetOpen,
    handleCreateQuote,
    handleAccept,
    handleReject,
    refresh: fetchQuotes
  }
}
