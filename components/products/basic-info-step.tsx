"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Category } from "@/types/category"
import { Brand } from "@/types/brand"
import { Model } from "@/hooks/views/useModelView"
import { useTranslations } from "next-intl"

interface BasicInfoStepProps {
  formData: {
    name: string
    slug: string
    description?: string
    sku: string
    barcode?: string
    categoryId: string
    brandId?: string
    modelId?: string
    isActive: boolean
    isFeatured: boolean
    isAvailable: boolean
  }
  categories: Category[]
  brands: Brand[]
  models: Model[]
  onUpdate: (field: string, value: any) => void
}

export function BasicInfoStep({
  formData,
  categories,
  brands,
  models,
  onUpdate
}: BasicInfoStepProps) {
  const t = useTranslations("Products")

  const filteredModels = models.filter(m => m.brandId === formData.brandId)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onUpdate('name', e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => onUpdate('slug', e.target.value)}
              placeholder="product-slug"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => onUpdate('description', e.target.value)}
            placeholder="Product description..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => onUpdate('sku', e.target.value)}
              placeholder="PROD-001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <Input
              id="barcode"
              value={formData.barcode || ''}
              onChange={(e) => onUpdate('barcode', e.target.value)}
              placeholder="1234567890123"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(val) => onUpdate('categoryId', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Select
              value={formData.brandId || ''}
              onValueChange={(val) => {
                onUpdate('brandId', val)
                onUpdate('modelId', '') // Reset model when brand changes
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map(brand => (
                  <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {formData.brandId && (
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select
              value={formData.modelId || ''}
              onValueChange={(val) => onUpdate('modelId', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {filteredModels.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name} {model.year ? `(${model.year})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => onUpdate('isActive', checked)}
            />
            <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => onUpdate('isFeatured', checked)}
            />
            <Label htmlFor="isFeatured" className="cursor-pointer">Featured</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAvailable"
              checked={formData.isAvailable}
              onCheckedChange={(checked) => onUpdate('isAvailable', checked)}
            />
            <Label htmlFor="isAvailable" className="cursor-pointer">Available for Purchase</Label>
          </div>
        </div>
      </div>
    </div>
  )
}
