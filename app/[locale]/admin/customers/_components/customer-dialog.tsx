
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslations } from "next-intl"
import { Customer } from "@/types"

interface CustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: Customer | null
  onSave: (data: any) => Promise<void>
}

export function CustomerDialog({ open, onOpenChange, initialData, onSave }: CustomerDialogProps) {
  const t = useTranslations("Customers")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    taxId: "",
    isActive: true
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          firstName: initialData.firstName || "",
          lastName: initialData.lastName || "",
          email: initialData.email || "",
          phone: initialData.phone || "",
          companyName: initialData.companyName || "",
          taxId: initialData.taxId || "",
          isActive: initialData.isActive
        })
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          companyName: "",
          taxId: "",
          isActive: true
        })
      }
    }
  }, [open, initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{initialData ? t("editTitle", { defaultMessage: "Edit Customer" }) : t("add", { defaultMessage: "Add Customer" })}</DialogTitle>
          <DialogDescription>
            {t("dialogDesc", { defaultMessage: "Manage customer details." })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">{t("fields.firstName", { defaultMessage: "First Name" })}</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">{t("fields.lastName", { defaultMessage: "Last Name" })}</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">{t("fields.email", { defaultMessage: "Email" })}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">{t("fields.phone", { defaultMessage: "Phone" })}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyName">{t("fields.companyName", { defaultMessage: "Company" })}</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="taxId">{t("fields.taxId", { defaultMessage: "Tax ID" })}</Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(c) => setFormData({ ...formData, isActive: c as boolean })}
              />
              <Label htmlFor="isActive">{t("fields.active", { defaultMessage: "Active" })}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{t("save", { defaultMessage: "Save" })}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
