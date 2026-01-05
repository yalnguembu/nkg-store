export interface Address {
  id: string;
  customerId: string;
  addressType: "BILLING" | "SHIPPING";
  fullName: string;
  phone?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  region?: string | null;
  postalCode?: string | null;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
