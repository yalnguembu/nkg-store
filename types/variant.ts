import { Price } from './price';
import { Stock } from './stock';

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
  stock?: Stock;
  bestPrice?: {
    unitPrice: number;
    bulkPrice: number | null;
    bulkMinQuantity: number | null;
    currency: string;
    priceType: string;
  } | null;
}
