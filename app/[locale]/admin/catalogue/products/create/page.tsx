"use client"

import { useRouter } from "next/navigation"
import { ProductFormWizard } from "@/components/products/product-form-wizard"
import { useCategoryView } from "@/hooks/views/useCategoryView"
import { useBrandView } from "@/hooks/views/useBrandView"
import { useModelView } from "@/hooks/views/useModelView"
import { useSupplierView } from "@/hooks/views/useSupplierView"
import { productsControllerCreateFull } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useTranslations } from "next-intl"

export default function CreateProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations("Products")

  const { categories } = useCategoryView()
  const { brands } = useBrandView()
  const { models } = useModelView()
  const { suppliers } = useSupplierView()

  const handleSubmit = async (data: any) => {
    try {
      await productsControllerCreateFull({
        body: data
      })
      toast({
        title: "Success",
        description: "Product created successfully"
      })
      router.push("/admin/catalogue/products")
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive"
      })
    }
  }

  const handleCancel = () => {
    router.push("/admin/catalogue/products")
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("createTitle", { defaultValue: "Create Product" })}
          </h2>
          <p className="text-muted-foreground">
            {t("createDescription", { defaultValue: "Add a new product with variants, images, and details" })}
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <ProductFormWizard
          categories={categories}
          brands={brands}
          models={models}
          suppliers={suppliers}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
