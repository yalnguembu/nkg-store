"use client"

import { useOrderView } from "@/hooks/views/useOrderView"
import { OrderSheet } from "./_components/order-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Eye, Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function OrdersPage() {
  const {
    orders,
    isLoading,
    searchTerm,
    setSearchTerm,
    handleUpdateStatus,
    getCustomerName,
    selectedOrder,
    setSelectedOrder,
    isSheetOpen,
    setIsSheetOpen
  } = useOrderView()

  const t = useTranslations("Orders")

  // Helper for status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500 hover:bg-yellow-600'
      case 'CONFIRMED': return 'bg-blue-500 hover:bg-blue-600'
      case 'SHIPPED': return 'bg-purple-500 hover:bg-purple-600'
      case 'DELIVERED': return 'bg-green-500 hover:bg-green-600'
      case 'CANCELLED': return 'bg-red-500 hover:bg-red-600'
      default: return 'bg-gray-500'
    }
  }

  const handleOpenDetails = (order: any) => {
    setSelectedOrder(order)
    setIsSheetOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t("title", { defaultMessage: "Orders" })}</h2>
        {/* Create Order functionality could be added here later */}
      </div>

      <div className="flex items-center py-4 justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder", { defaultMessage: "Search orders..." })}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          {t("filter", { defaultMessage: "Filter" })}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fields.reference", { defaultMessage: "Reference" })}</TableHead>
              <TableHead>{t("fields.customer", { defaultMessage: "Customer" })}</TableHead>
              <TableHead>{t("fields.date", { defaultMessage: "Date" })}</TableHead>
              <TableHead className="text-right">{t("fields.total", { defaultMessage: "Total" })}</TableHead>
              <TableHead className="text-center">{t("fields.status", { defaultMessage: "Status" })}</TableHead>
              <TableHead className="text-right">{t("actions", { defaultMessage: "Actions" })}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t("loading", { defaultMessage: "Loading..." })}
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t("noResults", { defaultMessage: "No orders found." })}
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber || order.id.substring(0, 8)}</TableCell>
                  <TableCell>{getCustomerName(order.customerId)}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(order.totalAmount || 0)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Select
                      defaultValue={order.status}
                      onValueChange={(val) => handleUpdateStatus(order.id, val as any)}
                    >
                      <SelectTrigger className={`w-[130px] h-8 text-white ${getStatusColor(order.status)} border-none`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDetails(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <OrderSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        order={selectedOrder}
        customerName={selectedOrder ? getCustomerName(selectedOrder.customerId) : undefined}
      />
    </div>
  )
}
