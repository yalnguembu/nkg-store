"use client";

import { useState, useCallback, useEffect } from "react";
import { AdminUser, CreateAdminUserDto } from "@/types/admin-user";
import {
  adminUsersControllerFindAll,
  adminUsersControllerCreate,
  adminUsersControllerUpdate,
  adminUsersControllerRemove,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

export function useAdminUserView() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const { toast } = useToast();
  const t = useTranslations("AdminUsers");

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await adminUsersControllerFindAll();
      if (response.data) {
        // Handle wrapped response from TransformInterceptor
        const data = response.data as any;
        setUsers(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error) {
      console.error("Error fetching admin users:", error);
      toast({
        title: "Error fetching users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const handleSave = async (data: CreateAdminUserDto) => {
    try {
      if (editingUser) {
        await adminUsersControllerUpdate({
          path: { id: editingUser.id },
          body: data as any,
        });
        toast({ title: t("updateSuccess") });
      } else {
        await adminUsersControllerCreate({
          body: data as any,
        });
        toast({ title: t("createSuccess") });
      }
      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      console.error("Error saving admin user:", error);
      toast({
        title: t("errorSaving"),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      await adminUsersControllerRemove({
        path: { id },
      });
      toast({ title: t("deleteSuccess") });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting admin user:", error);
      toast({
        title: t("errorDeleting"),
        variant: "destructive",
      });
    }
  };

  const filteredUsers = (Array.isArray(users) ? users : []).filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return {
    users: filteredUsers,
    isLoading,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    editingUser,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseDialog,
    handleSave,
    handleDelete,
  };
}
