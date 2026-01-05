import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

export function QuoteSheet({
  isOpen,
  onClose,
  orders
}: {
  isOpen: boolean
  onClose: () => void
  orders: any[]
}) {
  const t = useTranslations("Quotes")

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{t("createTitle", { defaultMessage: "Create Quote" })}</SheetTitle>
          <SheetDescription>
            {t("createDesc", { defaultMessage: "Select an order to generate a quote from." })}
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <p className="text-sm text-muted-foreground">Functionality to select Order/Cart and generate Quote goes here.</p>
          {/* Placeholder for form */}
        </div>
      </SheetContent>
    </Sheet>
  )
}
