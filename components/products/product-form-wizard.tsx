"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProductForm } from "@/hooks/forms/useProductForm"
import { BasicInfoStep } from "./basic-info-step"
import { VariantsStep } from "./variants-step"
import { ImagesStep } from "./images-step"
import { DocumentsStep } from "./documents-step"
import { SuppliersStep } from "./suppliers-step"
import { Category } from "@/types/category"
import { Brand } from "@/types/brand"
import { Model } from "@/hooks/views/useModelView"
import { Supplier } from "@/types/supplier"

interface ProductFormWizardProps {
  categories: Category[]
  brands: Brand[]
  models: Model[]
  suppliers: Supplier[]
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: any
}

const steps = [
  { id: 0, name: 'Basic Info', description: 'Product details' },
  { id: 1, name: 'Variants', description: 'Pricing & stock' },
  { id: 2, name: 'Images', description: 'Product photos' },
  { id: 3, name: 'Documents', description: 'Manuals & specs' },
  { id: 4, name: 'Suppliers', description: 'Supplier selection' }
]

export function ProductFormWizard({
  categories,
  brands,
  models,
  suppliers,
  onSubmit,
  onCancel,
  initialData
}: ProductFormWizardProps) {
  const {
    formData,
    currentStep,
    updateField,
    addVariant,
    updateVariant,
    removeVariant,
    addVariantAttribute,
    updateVariantAttribute,
    removeVariantAttribute,
    addImage,
    updateImage,
    removeImage,
    setPrimaryImage,
    addDocument,
    removeDocument,
    nextStep,
    prevStep,
    goToStep,
    toCreateProductFullDto,
    validateStep
  } = useProductForm(initialData)

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      const payload = toCreateProductFullDto()
      onSubmit(payload)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            onClick={() => goToStep(index)}
            className={cn(
              "flex flex-col items-center gap-2 flex-1 relative",
              index < currentStep && "cursor-pointer",
              index === currentStep && "cursor-default",
              index > currentStep && "cursor-not-allowed opacity-50"
            )}
            disabled={index > currentStep}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                index < currentStep && "bg-primary border-primary text-primary-foreground",
                index === currentStep && "border-primary text-primary",
                index > currentStep && "border-muted-foreground/30 text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="text-center">
              <p className={cn(
                "text-sm font-medium",
                index === currentStep && "text-foreground",
                index !== currentStep && "text-muted-foreground"
              )}>
                {step.name}
              </p>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {step.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px] py-6">
        {currentStep === 0 && (
          <BasicInfoStep
            formData={formData}
            categories={categories}
            brands={brands}
            models={models}
            onUpdate={(field, value) => updateField(field as any, value)}
          />
        )}

        {currentStep === 1 && (
          <VariantsStep
            variants={formData.variants}
            onAddVariant={addVariant}
            onUpdateVariant={updateVariant}
            onRemoveVariant={removeVariant}
            onAddAttribute={addVariantAttribute}
            onUpdateAttribute={updateVariantAttribute}
            onRemoveAttribute={removeVariantAttribute}
          />
        )}

        {currentStep === 2 && (
          <ImagesStep
            images={formData.images}
            onAddImage={addImage}
            onRemoveImage={removeImage}
            onSetPrimary={setPrimaryImage}
          />
        )}

        {currentStep === 3 && (
          <DocumentsStep
            documents={formData.documents}
            onAddDocument={addDocument}
            onRemoveDocument={removeDocument}
          />
        )}

        {currentStep === 4 && (
          <SuppliersStep
            supplierIds={formData.supplierIds}
            suppliers={suppliers}
            onUpdate={(ids) => updateField('supplierIds', ids)}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={currentStep === 0 ? onCancel : prevStep}
        >
          {currentStep === 0 ? 'Cancel' : 'Previous'}
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit}>
            Create Product
          </Button>
        )}
      </div>
    </div>
  )
}
