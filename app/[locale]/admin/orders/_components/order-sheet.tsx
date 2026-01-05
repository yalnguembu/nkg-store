import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Order } from "@/types" // Ensure Order type is available
import { Separator } from "@/components/ui/separator"
import { useTranslations } from "next-intl"

interface OrderSheetProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
  customerName?: string
}

export function OrderSheet({
  isOpen,
  onClose,
  order,
  customerName,
}: OrderSheetProps) {
  const t = useTranslations("Orders")

  if (!order) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("detailsTitle", { defaultMessage: "Order Details" })}</SheetTitle>
          <SheetDescription>
            {order.orderNumber || order.id}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Status & Info */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{t("fields.status", { defaultMessage: "Status" })}</span>
            <Badge>{order.status}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{t("fields.date", { defaultMessage: "Date" })}</span>
            <span>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{t("fields.customer", { defaultMessage: "Customer" })}</span>
            <span className="font-medium">{customerName || "Unknown"}</span>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">{t("items", { defaultMessage: "Items" })}</h4>
            <div className="space-y-4">
              {(order as any).items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(item.totalPrice)}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Financials */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("fields.subtotal", { defaultMessage: "Subtotal" })}</span>
              <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(Number(order.subtotal))}</span>
            </div>
            {Number(order.deliveryCost) > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("fields.delivery", { defaultMessage: "Delivery" })}</span>
                <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(Number(order.deliveryCost))}</span>
              </div>
            )}
            {Number(order.installationCost) > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("fields.installation", { defaultMessage: "Installation" })}</span>
                <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(Number(order.installationCost))}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>{t("fields.total", { defaultMessage: "Total" })}</span>
              <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(Number(order.totalAmount))}</span>
            </div>
          </div>

          {/* WhatsApp Link */}
          {(order as any).whatsappUrl && (
            <div className="pt-4">
              <Button variant="outline" className="w-full" onClick={() => window.open((order as any).whatsappUrl, '_blank')}>
                {t("whatsappLink", { defaultMessage: "Open in WhatsApp" })}
              </Button>
            </div>
          )}
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={onClose}>{t("close", { defaultMessage: "Close" })}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
