export interface Supplier {
  id: string;
  name: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  deliveryDelayDays?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
