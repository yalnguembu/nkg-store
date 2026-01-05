export interface StockMovement {
  id: string;
  variantId: string;
  movementType: "IN" | "OUT" | "ADJUSTMENT" | "RETURN";
  quantity: number;
  reason?: string | null;
  referenceType?: "ORDER" | "RETURN" | "ADJUSTMENT" | null;
  referenceId?: string | null;
  performedBy?: string | null;
  createdAt: string;
}
