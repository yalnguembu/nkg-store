"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Supplier } from "@/types/supplier"

interface SuppliersStepProps {
  supplierIds: string[]
  suppliers: Supplier[]
  onUpdate: (supplierIds: string[]) => void
}

export function SuppliersStep({
  supplierIds,
  suppliers,
  onUpdate
}: SuppliersStepProps) {
  const toggleSupplier = (supplierId: string) => {
    if (supplierIds.includes(supplierId)) {
      onUpdate(supplierIds.filter(id => id !== supplierId))
    } else {
      onUpdate([...supplierIds, supplierId])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Suppliers</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select suppliers who can provide this product
        </p>
      </div>

      {suppliers.length > 0 ? (
        <div className="space-y-2">
          {suppliers.map((supplier) => (
            <Card key={supplier.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <Checkbox
                  id={supplier.id}
                  checked={supplierIds.includes(supplier.id)}
                  onCheckedChange={() => toggleSupplier(supplier.id)}
                />
                <Label htmlFor={supplier.id} className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">{supplier.name}</p>
                    {supplier.email && (
                      <p className="text-sm text-muted-foreground">{supplier.email}</p>
                    )}
                  </div>
                </Label>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No suppliers available</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add suppliers in the Suppliers section first
          </p>
        </div>
      )}

      {supplierIds.length > 0 && (
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {supplierIds.length} supplier{supplierIds.length > 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  )
}
