import { OrderItem } from './order-item';

export type OrderStatus = 'DRAFT' | 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type OrderType = 'STANDARD' | 'WITH_INSTALLATION' | 'DROPSHIPPING';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  orderType: OrderType;
  billingAddressId?: string | null;
  shippingAddressId?: string | null;
  subtotal: number;
  installationCost: number;
  deliveryCost: number;
  discount: number;
  totalAmount: number;
  notes?: string | null;
  customerNotes?: string | null;
  whatsappUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string | null;
  completedAt?: string | null;
  items?: OrderItem[];
}
