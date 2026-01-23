"use client"

import { useState, useCallback, useEffect } from 'react'
import {
  servicesControllerFindAll,
  installationPricingControllerFindAll
} from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export function useServicesView() {
  const [services, setServices] = useState<any[]>([])
  const [pricing, setPricing] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [servicesRes, pricingRes] = await Promise.all([
        servicesControllerFindAll(),
        installationPricingControllerFindAll()
      ])

      if (servicesRes.data) {
        setServices(servicesRes.data.data)
      }
      if (pricingRes.data) {
        setPricing((pricingRes.data as any).data)
      }
    } catch (error) {
      toast({
        title: 'Error fetching services data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    services,
    pricing,
    isLoading,
    refresh: fetchData
  }
}
