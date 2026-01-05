export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  productName: string;
  variantName?: string | null;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isDropshipping: boolean;
  createdAt: string;
}
