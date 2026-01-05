"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, X } from "lucide-react"
import type { ProductVariant } from "@/hooks/forms/useProductForm"

interface VariantsStepProps {
  variants: ProductVariant[]
  onAddVariant: () => void
  onUpdateVariant: (index: number, variant: Partial<ProductVariant>) => void
  onRemoveVariant: (index: number) => void
  onAddAttribute: (variantIndex: number) => void
  onUpdateAttribute: (variantIndex: number, attrIndex: number, field: 'name' | 'value', value: string) => void
  onRemoveAttribute: (variantIndex: number, attrIndex: number) => void
}

export function VariantsStep({
  variants,
  onAddVariant,
  onUpdateVariant,
  onRemoveVariant,
  onAddAttribute,
  onUpdateAttribute,
  onRemoveAttribute
}: VariantsStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Product Variants</h3>
        <Button type="button" onClick={onAddVariant} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>

      <div className="space-y-4">
        {variants.map((variant, variantIndex) => (
          <Card key={variantIndex}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Variant {variantIndex + 1}</CardTitle>
                {variants.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveVariant(variantIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Variant Name *</Label>
                  <Input
                    value={variant.name}
                    onChange={(e) => onUpdateVariant(variantIndex, { name: e.target.value })}
                    placeholder="e.g., Small, Red, 128GB"
                  />
                </div>
                <div className="space-y-2">
                  <Label>SKU *</Label>
                  <Input
                    value={variant.sku}
                    onChange={(e) => onUpdateVariant(variantIndex, { sku: e.target.value })}
                    placeholder="VARIANT-SKU"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) => onUpdateVariant(variantIndex, { price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Compare At Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={variant.compareAtPrice || ''}
                    onChange={(e) => onUpdateVariant(variantIndex, { compareAtPrice: parseFloat(e.target.value) || undefined })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cost</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={variant.cost || ''}
                    onChange={(e) => onUpdateVariant(variantIndex, { cost: parseFloat(e.target.value) || undefined })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Stock *</Label>
                  <Input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => onUpdateVariant(variantIndex, { stock: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min Stock</Label>
                  <Input
                    type="number"
                    value={variant.minStock || ''}
                    onChange={(e) => onUpdateVariant(variantIndex, { minStock: parseInt(e.target.value) || undefined })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Stock</Label>
                  <Input
                    type="number"
                    value={variant.maxStock || ''}
                    onChange={(e) => onUpdateVariant(variantIndex, { maxStock: parseInt(e.target.value) || undefined })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={variant.weight || ''}
                    onChange={(e) => onUpdateVariant(variantIndex, { weight: parseFloat(e.target.value) || undefined })}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Attributes</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onAddAttribute(variantIndex)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Attribute
                  </Button>
                </div>

                {variant.attributes.map((attr, attrIndex) => (
                  <div key={attrIndex} className="flex gap-2">
                    <Input
                      placeholder="Attribute name (e.g., Color)"
                      value={attr.name}
                      onChange={(e) => onUpdateAttribute(variantIndex, attrIndex, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value (e.g., Red)"
                      value={attr.value}
                      onChange={(e) => onUpdateAttribute(variantIndex, attrIndex, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveAttribute(variantIndex, attrIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {variant.attributes.length === 0 && (
                  <p className="text-sm text-muted-foreground">No attributes added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
