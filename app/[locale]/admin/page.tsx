"use client"

import { useDashboardView } from "@/hooks/views/useDashboardView"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, Users, ShoppingCart, DollarSign, Activity } from "lucide-react"
import { useTranslations } from "next-intl"

export default function AdminDashboardPage() {
  const { stats, isLoading } = useDashboardView()
  const t = useTranslations("Dashboard")

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-[100px]" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t("title", { defaultMessage: "Dashboard" })}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalRevenue", { defaultMessage: "Total Revenue" })}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(stats?.totalRevenue || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("products", { defaultMessage: "Products" })}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.productsCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.variantsCount || 0} {t("variants", { defaultMessage: "variants" })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("orders", { defaultMessage: "Orders" })}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.ordersCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("customers", { defaultMessage: "Customers" })}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.customersCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("overview", { defaultMessage: "Overview" })}</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              {t("chartPlaceholder", { defaultMessage: "Chart placeholder" })}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("recentActivity", { defaultMessage: "Recent Activity" })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats?.recentActivity?.map((activity, index) => (
                <div key={index} className="flex items-center">
                  <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity}</p>
                  </div>
                </div>
              ))}
              {!stats?.recentActivity?.length && (
                <div className="text-sm text-muted-foreground">{t("noActivity", { defaultMessage: "No recent activity" })}</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
