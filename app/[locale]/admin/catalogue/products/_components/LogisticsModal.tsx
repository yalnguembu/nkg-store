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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types/product";
import { useTranslations } from "next-intl";

interface LogisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSave: (data: any) => Promise<void>;
}

export function LogisticsModal({
  isOpen,
  onClose,
  product,
  onSave,
}: LogisticsModalProps) {
  const t = useTranslations("Products");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    requiresInstallation: false,
    isDropshipping: false,
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        requiresInstallation: product.requiresInstallation ?? false,
        isDropshipping: product.isDropshipping ?? false,
        metaTitle: product.metaTitle || "",
        metaDescription: product.metaDescription || "",
      });
    }
  }, [isOpen, product]);

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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Logistics & SEO</DialogTitle>
          <DialogDescription>
            Update installation requirements, dropshipping status, and search
            engine optimization details.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="requiresInstallation"
              checked={formData.requiresInstallation}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  requiresInstallation: !!checked,
                }))
              }
            />
            <Label htmlFor="requiresInstallation" className="cursor-pointer">
              Requires Installation
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDropshipping"
              checked={formData.isDropshipping}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isDropshipping: !!checked }))
              }
            />
            <Label htmlFor="isDropshipping" className="cursor-pointer">
              Is Dropshipping
            </Label>
          </div>

          <div className="grid gap-2 pt-2">
            <Label htmlFor="metaTitle">SEO Meta Title</Label>
            <Input
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))
              }
              placeholder="Browser tab title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="metaDescription">SEO Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  metaDescription: e.target.value,
                }))
              }
              placeholder="Search engine description..."
              rows={3}
            />
          </div>
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
