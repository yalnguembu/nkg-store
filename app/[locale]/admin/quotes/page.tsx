"use client"

import { useQuoteView } from "@/hooks/views/useQuoteView"
import { QuoteSheet } from "./_components/quote-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Eye } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function QuotesPage() {
  const {
    quotes,
    orders,
    isLoading,
    searchTerm,
    setSearchTerm,
    isSheetOpen,
    setIsSheetOpen,
    handleAccept,
    handleReject
  } = useQuoteView()

  const t = useTranslations("Quotes")

  // Helper for status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500'
      case 'ACCEPTED': return 'bg-green-500'
      case 'REJECTED': return 'bg-red-500'
      case 'EXPIRED': return 'bg-gray-500'
      case 'SENT': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  // Need selected quote for View? useQuoteView might need update or use local state
  // useQuoteView doesn't seem to have selectedQuote logic exposed yet.
  // I will check useQuoteView content if needed, but for now assuming list view first.

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t("title", { defaultMessage: "Quotes" })}</h2>
        <Button onClick={() => setIsSheetOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("create", { defaultMessage: "Create Quote" })}
        </Button>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder={t("searchPlaceholder", { defaultMessage: "Search quotes..." })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fields.number", { defaultMessage: "Quote #" })}</TableHead>
              <TableHead>{t("fields.order", { defaultMessage: "Order #" })}</TableHead>
              <TableHead>{t("fields.customer", { defaultMessage: "Customer" })}</TableHead>
              <TableHead className="text-right">{t("fields.total", { defaultMessage: "Total" })}</TableHead>
              <TableHead className="text-center">{t("fields.status", { defaultMessage: "Status" })}</TableHead>
              <TableHead className="text-right">{t("fields.validUntil", { defaultMessage: "Valid Until" })}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t("loading", { defaultMessage: "Loading..." })}
                </TableCell>
              </TableRow>
            ) : quotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t("noResults", { defaultMessage: "No quotes found." })}
                </TableCell>
              </TableRow>
            ) : (
              quotes.map((quote: any) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.quoteNumber}</TableCell>
                  <TableCell>{quote.order?.orderNumber}</TableCell>
                  <TableCell>
                    {quote.order?.customer?.firstName} {quote.order?.customer?.lastName}
                    {quote.order?.customer?.companyName ? ` (${quote.order.customer.companyName})` : ''}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(quote.order?.totalAmount || 0)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDate(quote.validUntil)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Sheet for Create only for now as useQuoteView doesn't support View details fully yet */}
      <QuoteSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        orders={orders}
      />
    </div>
  )
}
