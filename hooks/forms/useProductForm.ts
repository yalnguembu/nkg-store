import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { CreateProductFullDto } from "@/lib/api/types.gen";

export interface ProductVariant {
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  stock: number;
  minStock?: number;
  maxStock?: number;
  weight?: number;
  attributes: Array<{ name: string; value: string }>;
  images: Array<{
    url: string;
    alt?: string;
    isPrimary: boolean;
    orderIndex: number;
  }>;
}

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
  orderIndex: number;
}

export interface ProductDocument {
  title: string;
  url: string;
  type: "MANUAL" | "SPEC" | "WARRANTY" | "OTHER";
}

export interface ProductFormData {
  // Basic Info
  name: string;
  slug: string;
  description?: string;
  sku: string;
  barcode?: string;
  categoryId: string;
  brandId?: string;
  modelId?: string;
  isActive: boolean;
  isFeatured: boolean;
  isAvailable: boolean;

  // Variants
  variants: ProductVariant[];

  // Images
  images: ProductImage[];

  // Documents
  documents: ProductDocument[];

  // Suppliers
  supplierIds: string[];
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
};

const generateRandomSku = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

const initialVariant: ProductVariant = {
  name: "",
  sku: "",
  price: 0,
  stock: 0,
  attributes: [],
  images: [],
};

const getInitialFormData = (): ProductFormData => ({
  name: "",
  slug: "",
  description: "",
  sku: generateRandomSku(),
  categoryId: "",
  isActive: true,
  isFeatured: false,
  isAvailable: true,
  variants: [{ ...initialVariant }],
  images: [],
  documents: [],
  supplierIds: [],
});

export function useProductForm(initialData?: Partial<ProductFormData>) {
  const [formData, setFormData] = useState<ProductFormData>(() => {
    const data = {
      ...getInitialFormData(),
      ...initialData,
    };
    // Ensure the first variant has the product's SKU if it was empty
    if (data.variants.length > 0 && !data.variants[0].sku) {
      data.variants[0].sku = data.sku;
    }
    return data;
  });
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const updateField = <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K],
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Auto-generate slug when name changes
      if (field === "name" && typeof value === "string") {
        newData.slug = slugify(value);
      }

      // Sync name and SKU to the first variant if it's the default one
      if (newData.variants.length === 1) {
        const variant = newData.variants[0];
        if (field === "name") {
          variant.name = value as string;
        }
        if (field === "sku") {
          variant.sku = value as string;
        }
      }

      return newData;
    });
  };

  // Variant Management
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { ...initialVariant, sku: generateRandomSku() },
      ],
    }));
  };

  const updateVariant = (index: number, variant: Partial<ProductVariant>) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === index ? { ...v, ...variant } : v,
      ),
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length === 1) {
      toast({
        title: "Error",
        description: "Product must have at least one variant",
        variant: "destructive",
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // Variant Attributes
  const addVariantAttribute = (variantIndex: number) => {
    updateVariant(variantIndex, {
      attributes: [
        ...formData.variants[variantIndex].attributes,
        { name: "", value: "" },
      ],
    });
  };

  const updateVariantAttribute = (
    variantIndex: number,
    attrIndex: number,
    field: "name" | "value",
    value: string,
  ) => {
    const variant = formData.variants[variantIndex];
    const updatedAttributes = variant.attributes.map((attr, i) =>
      i === attrIndex ? { ...attr, [field]: value } : attr,
    );
    updateVariant(variantIndex, { attributes: updatedAttributes });
  };

  const removeVariantAttribute = (variantIndex: number, attrIndex: number) => {
    const variant = formData.variants[variantIndex];
    updateVariant(variantIndex, {
      attributes: variant.attributes.filter((_, i) => i !== attrIndex),
    });
  };

  // Image Management
  const addImage = (image: ProductImage) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, image],
    }));
  };

  const updateImage = (index: number, image: Partial<ProductImage>) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, ...image } : img,
      ),
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const setPrimaryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    }));
  };

  // Document Management
  const addDocument = (doc: ProductDocument) => {
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, doc],
    }));
  };

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  // Validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Basic Info
        if (
          !formData.name ||
          !formData.slug ||
          !formData.sku ||
          !formData.categoryId
        ) {
          toast({
            title: "Validation Error",
            description: "Please fill in all required fields",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 1: // Variants
        for (const variant of formData.variants) {
          if (!variant.sku || variant.price <= 0) {
            toast({
              title: "Validation Error",
              description: "All variants must have SKU and valid price",
              variant: "destructive",
            });
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (step: number) => {
    if (step < currentStep || validateStep(currentStep)) {
      setCurrentStep(step);
    }
  };

  const reset = () => {
    setFormData(getInitialFormData());
    setCurrentStep(0);
  };

  // Convert to API format
  const toCreateProductFullDto = (): CreateProductFullDto => {
    return {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      sku: formData.sku,
      categoryId: formData.categoryId,
      brandId: formData.brandId,
      modelId: formData.modelId,
      isActive: formData.isActive,
      variants: formData.variants.map((v) => ({
        name: v.name,
        sku: v.sku,
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        cost: v.cost,
        stock: v.stock,
        minStock: v.minStock,
        maxStock: v.maxStock,
        weight: v.weight,
        // Convert attributes array to object
        attributes: v.attributes.reduce(
          (acc, attr) => ({
            ...acc,
            [attr.name]: attr.value,
          }),
          {} as { [key: string]: unknown },
        ),
        // Convert images to URL strings for API
        images: v.images.map((img) => img.url),
      })),
      images: formData.images.map((img) => img.url),
    } as CreateProductFullDto;
  };

  return {
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
    reset,
    toCreateProductFullDto,
    validateStep,
  };
}
