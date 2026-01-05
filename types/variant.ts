import { Price } from './price';

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name?: string | null;
  attributes?: Record<string, any> | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  prices?: Price[];
}
