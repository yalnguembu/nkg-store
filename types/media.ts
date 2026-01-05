export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string | null;
  orderIndex: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface ProductDocument {
  id: string;
  productId: string;
  documentUrl: string;
  documentType: "MANUAL" | "CERTIFICATE" | "DATASHEET" | "INSTALLATION_GUIDE";
  name: string;
  createdAt: string;
}
