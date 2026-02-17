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
import { ImagesStep } from "@/components/products/images-step";
import { ProductImage } from "@/hooks/forms/useProductForm";
import { useTranslations } from "next-intl";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  productImages: { imageUrl: string; isPrimary: boolean }[];
  onSave: (images: any[]) => Promise<void>;
}

export function MediaModal({
  isOpen,
  onClose,
  productImages,
  onSave,
}: MediaModalProps) {
  const t = useTranslations("Products");
  const [isSaving, setIsSaving] = useState(false);
  const [images, setImages] = useState<ProductImage[]>([]);

  useEffect(() => {
    if (isOpen && productImages) {
      setImages(
        productImages.map((img, i) => ({
          url: img.imageUrl,
          alt: "",
          isPrimary: img.isPrimary,
          orderIndex: i,
        })),
      );
    }
  }, [isOpen, productImages]);

  const handleAddImage = (image: ProductImage) => {
    setImages((prev) => [...prev, image]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    );
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      // Map back to the format expected by the update API
      const formattedImages = images.map((img) => ({
        imageUrl: img.url,
        isPrimary: img.isPrimary,
      }));
      await onSave(formattedImages);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Media</DialogTitle>
          <DialogDescription>
            Add or remove product images and select the primary one.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ImagesStep
            images={images}
            onAddImage={handleAddImage}
            onRemoveImage={handleRemoveImage}
            onSetPrimary={handleSetPrimary}
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
