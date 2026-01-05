export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  parent?: Category | null;
  children?: Category[];
}
