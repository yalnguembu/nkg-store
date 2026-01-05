export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt?: string; // Optional as might be missing in some DTOs
  updatedAt?: string;
}
