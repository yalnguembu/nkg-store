"use client"

import { useState, useCallback, useEffect } from "react"
import { reportsControllerGetDashboard } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export interface DashboardStats {
  productsCount: number
  categoriesCount: number
  brandsCount: number
  variantsCount: number
  customersCount?: number
  ordersCount?: number
  totalRevenue?: number
  recentActivity?: string[]
}

export function useDashboardView() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await reportsControllerGetDashboard()
      // Casting since response is unknown in types.gen.ts
      setStats(response.data as DashboardStats)
    } catch (error) {
      console.error("Dashboard error:", error)
      toast({
        title: "Error fetching dashboard stats",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    isLoading,
    refresh: fetchStats
  }
}
