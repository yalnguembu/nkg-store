export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "MANAGER";

export interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminUserDto {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: AdminRole;
  isActive?: boolean;
}

export interface UpdateAdminUserDto extends Partial<CreateAdminUserDto> {}
