import { PriceType, CustomerType } from './enums';

export interface Price {
  id: string;
  variantId: string;
  priceType: PriceType;
  customerType: CustomerType;
  amount: number;
  currency: string;
  validFrom: string;
  validTo?: string | null;
  minQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
