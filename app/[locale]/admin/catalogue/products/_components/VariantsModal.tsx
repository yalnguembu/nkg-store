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
import { VariantsStep } from "@/components/products/variants-step";
import { ProductVariant as FormVariant } from "@/hooks/forms/useProductForm";
import { ProductVariant } from "@/types/variant";
import { useTranslations } from "next-intl";

interface VariantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productVariants: ProductVariant[];
  onSave: (variants: any[]) => Promise<void>;
}

const generateRandomSku = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

export function VariantsModal({
  isOpen,
  onClose,
  productVariants,
  onSave,
}: VariantsModalProps) {
  const t = useTranslations("Products");
  const [isSaving, setIsSaving] = useState(false);
  const [variants, setVariants] = useState<FormVariant[]>([]);

  useEffect(() => {
    if (isOpen && productVariants) {
      setVariants(
        productVariants.map((v) => {
          const attributes = v.attributes
            ? Object.entries(v.attributes).map(([name, value]) => ({
                name,
                value: String(value),
              }))
            : [];

          return {
            name: v.name || "",
            sku: v.sku || "",
            price: v.bestPrice?.unitPrice || 0,
            compareAtPrice: undefined, // Type doesn't easily match without more mapping
            cost: undefined,
            stock: v.stock?.quantity || 0,
            minStock: v.stock?.alertThreshold || undefined,
            maxStock: undefined,
            attributes,
            images: [], // Images are handled in a separate section or per variant
          };
        }),
      );
    }
  }, [isOpen, productVariants]);

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        name: "",
        sku: generateRandomSku(),
        price: 0,
        stock: 0,
        attributes: [],
        images: [],
      },
    ]);
  };

  const handleUpdateVariant = (
    index: number,
    variant: Partial<FormVariant>,
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, ...variant } : v)),
    );
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAttribute = (variantIndex: number) => {
    handleUpdateVariant(variantIndex, {
      attributes: [
        ...variants[variantIndex].attributes,
        { name: "", value: "" },
      ],
    });
  };

  const handleUpdateAttribute = (
    vIdx: number,
    aIdx: number,
    field: "name" | "value",
    value: string,
  ) => {
    const updatedAttrs = variants[vIdx].attributes.map((a, i) =>
      i === aIdx ? { ...a, [field]: value } : a,
    );
    handleUpdateVariant(vIdx, { attributes: updatedAttrs });
  };

  const handleRemoveAttribute = (vIdx: number, aIdx: number) => {
    const updatedAttrs = variants[vIdx].attributes.filter((_, i) => i !== aIdx);
    handleUpdateVariant(vIdx, { attributes: updatedAttrs });
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const formattedVariants = variants.map((v) => ({
        ...v,
        attributes: v.attributes.reduce(
          (acc, attr) => ({ ...acc, [attr.name]: attr.value }),
          {},
        ),
      }));
      await onSave(formattedVariants);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Variants, Pricing & Attributes</DialogTitle>
          <DialogDescription>
            Manage product variants, their attributes, pricing, and stock
            levels.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <VariantsStep
            variants={variants}
            onAddVariant={handleAddVariant}
            onUpdateVariant={handleUpdateVariant}
            onRemoveVariant={handleRemoveVariant}
            onAddAttribute={handleAddAttribute}
            onUpdateAttribute={handleUpdateAttribute}
            onRemoveAttribute={handleRemoveAttribute}
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
