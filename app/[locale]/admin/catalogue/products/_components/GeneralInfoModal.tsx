"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BasicInfoStep } from "@/components/products/basic-info-step";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Brand } from "@/types/brand";
import { Model } from "@/hooks/views/useModelView";
import { useTranslations } from "next-intl";

interface GeneralInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  categories: Category[];
  brands: Brand[];
  models: Model[];
  onSave: (data: any) => Promise<void>;
}

export function GeneralInfoModal({
  isOpen,
  onClose,
  product,
  categories,
  brands,
  models,
  onSave,
}: GeneralInfoModalProps) {
  const t = useTranslations("Products");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    sku: "",
    barcode: "",
    categoryId: "",
    brandId: "",
    modelId: "",
    isActive: true,
    isFeatured: false,
    isAvailable: true,
  });

  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        description: product.description || "",
        sku: product.sku || "",
        barcode: (product as any).barcode || "",
        categoryId: product.categoryId || "",
        brandId: product.brandId || "",
        modelId: product.modelId || "",
        isActive: product.isActive ?? true,
        isFeatured: (product as any).isFeatured ?? false,
        isAvailable: (product as any).isAvailable ?? true,
      });
    }
  }, [isOpen, product]);

  const handleUpdate = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit General Information</DialogTitle>
          <DialogDescription>
            Update the basic details for this product.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <BasicInfoStep
            formData={formData as any}
            categories={categories}
            brands={brands}
            models={models}
            onUpdate={handleUpdate}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
