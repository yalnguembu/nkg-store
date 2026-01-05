"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useTranslations } from "next-intl"
import { Product } from "@/types/product"
import { Category } from "@/types/category"
import { Brand } from "@/types/brand"
import { Supplier } from "@/types/supplier"
import { Model } from "@/hooks/views/useModelView"
import { ProductFormWizard } from "@/components/products/product-form-wizard"

interface ProductSheetProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  product?: Product | undefined
  categories: Category[]
  brands: Brand[]
  models: Model[]
  suppliers: Supplier[]
}

export function ProductSheet({
  isOpen,
  onClose,
  onSave,
  product,
  categories,
  brands,
  models,
  suppliers
}: ProductSheetProps) {
  const t = useTranslations("Products")

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {product ? t("editTitle", { defaultMessage: "Edit Product" }) : t("createTitle", { defaultMessage: "Create Product" })}
          </SheetTitle>
          <SheetDescription>
            {t("sheetDesc", { defaultMessage: "Fill in the details for the product." })}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <ProductFormWizard
            categories={categories}
            brands={brands}
            models={models}
            suppliers={suppliers}
            onSubmit={onSave}
            onCancel={onClose}
            initialData={product}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
