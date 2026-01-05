export * from './enums';
export * from './category';
export * from './brand';
export * from './product';
export * from './variant';
export * from './price';
export * from './supplier';
export * from './auth';
export * from './stock';
export * from './stock-movement';
export * from './customer';
export * from './order';
export * from './order-item';
export * from './address';
export * from './media';
export * from './quote';

export interface InstallationPricing {
  id: string
  serviceType: string
  pricingRules: Record<string, any>
  hourlyRate: number
  travelCostPerKm: number
  isActive: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Warranty {
  id: string
  productId: string
  warrantyType: "MANUFACTURER" | "EXTENDED" | "PARTS"
  durationMonths: number
  description?: string
  price?: number
  isIncluded: boolean
  isActive: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Service {
  id: string
  serviceType: "INSTALLATION" | "MAINTENANCE" | "REPAIR" | "CONSULTATION"
  name: string
  description?: string
  basePrice: number
  isQuoteRequired: boolean
  estimatedDurationHours?: number
  isActive: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export interface ProductService {
  id: string
  productId: string
  serviceId: string
  isOptional: boolean
  recommendedPrice?: number
  createdAt: string | Date
}
