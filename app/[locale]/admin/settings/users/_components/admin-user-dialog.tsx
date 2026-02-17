"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import { AdminUser, AdminRole } from "@/types/admin-user";

interface AdminUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: AdminUser | null;
  onSave: (data: any) => Promise<void>;
}

export function AdminUserDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: AdminUserDialogProps) {
  const t = useTranslations("AdminUsers");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "ADMIN" as AdminRole,
    isActive: true,
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          email: initialData.email || "",
          password: "", // Don't pre-fill password
          firstName: initialData.firstName || "",
          lastName: initialData.lastName || "",
          role: initialData.role || "ADMIN",
          isActive: initialData.isActive,
        });
      } else {
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          role: "ADMIN",
          isActive: true,
        });
      }
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For update, exclude empty password
    const dataToSend = { ...formData };
    if (initialData && !dataToSend.password) {
      delete (dataToSend as any).password;
    }
    onSave(dataToSend);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("editTitle") : t("createTitle")}
          </DialogTitle>
          <DialogDescription>{t("dialogDesc")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("fields.email")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">
                {initialData ? t("fields.newPassword") : t("fields.password")}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!initialData}
                placeholder={initialData ? t("fields.leavePlain") : ""}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">{t("fields.firstName")}</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">{t("fields.lastName")}</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">{t("fields.role")}</Label>
              <Select
                value={formData.role}
                onValueChange={(v) =>
                  setFormData({ ...formData, role: v as AdminRole })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder={t("fields.selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">
                    {t("roles.SUPER_ADMIN")}
                  </SelectItem>
                  <SelectItem value="ADMIN">{t("roles.ADMIN")}</SelectItem>
                  <SelectItem value="MANAGER">{t("roles.MANAGER")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(c) =>
                  setFormData({ ...formData, isActive: c as boolean })
                }
              />
              <Label htmlFor="isActive">{t("fields.active")}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{t("save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
