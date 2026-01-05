export type QuoteStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface Quote {
  id: string;
  quoteNumber: string;
  orderId: string;
  installationConfig?: Record<string, any> | null;
  calculatedInstallationCost: number;
  validUntil: string;
  status: QuoteStatus;
  acceptedAt?: string | null;
  pdfUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}
