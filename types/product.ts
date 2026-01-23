import { Category } from './category';
import { Brand } from './brand';
import { Supplier } from './supplier';
import { ProductVariant } from './variant';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string | null;
  technicalSpecs?: Record<string, any> | null;
  categoryId: string;
  brandId?: string | null;
  modelId?: string | null;
  isActive: boolean;
  requiresInstallation: boolean;
  isDropshipping: boolean;
  dropshipSupplierId?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt: string;
  updatedAt: string;
  category?: Partial<Category> & { imageUrl?: string | null };
  brand?: Partial<Brand> & { logoUrl?: string | null };
  supplier?: Partial<Supplier>;
  variants?: ProductVariant[];
  images?: { imageUrl: string; isPrimary: boolean }[];
  price?: number;
  bulkPrice?: number | null;
  bulkMinQuantity?: number | null;
}
