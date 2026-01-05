import { CustomerType } from './enums';

export interface Customer {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  contactName?: string | null; // Keeping as it might be used elsewhere or legacy
  phone?: string | null;
  customerType: CustomerType;
  taxId?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
