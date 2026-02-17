export interface StockMovement {
  id: string;
  variantId: string;
  movementType: string; // Keep string to be flexible with backend enums
  quantity: number;
  reason?: string | null;
  referenceType?: string | null;
  referenceId?: string | null;
  performedBy?: string | null;
  createdAt: string;
  variant?: {
    id: string;
    sku: string;
    product?: {
      id: string;
      name: string;
    };
  };
}
