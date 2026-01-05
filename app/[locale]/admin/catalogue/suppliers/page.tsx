"use client"

import { useSupplierView } from "@/hooks/views/useSupplierView"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2, Truck, CheckCircle, Ban } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
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

export default function SuppliersPage() {
  const {
    suppliers,
    isLoading,
    searchTerm,
    setSearchTerm,
    isSheetOpen,
    editingSupplier,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseSheet,
    handleSave,
    handleDelete,
    handleToggleStatus
  } = useSupplierView()

  const t = useTranslations("Suppliers")
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    phone: "",
    contactName: "",
    isActive: true
  })

  useEffect(() => {
    if (isSheetOpen) {
      if (editingSupplier) {
        setFormData({
          name: editingSupplier.name,
          code: editingSupplier.code,
          email: editingSupplier.email || "",
          phone: editingSupplier.phone || "",
          contactName: editingSupplier.contactName || "",
          isActive: editingSupplier.isActive
        })
      } else {
        setFormData({ name: "", code: "", email: "", phone: "", contactName: "", isActive: true })
      }
    }
  }, [isSheetOpen, editingSupplier])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave(formData)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t("title", { defaultMessage: "Suppliers" })}</h2>
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" />
          {t("add", { defaultMessage: "Add Supplier" })}
        </Button>
      </div>

      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder", { defaultMessage: "Search suppliers..." })}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fields.name", { defaultMessage: "Name" })}</TableHead>
              <TableHead>{t("fields.code", { defaultMessage: "Code" })}</TableHead>
              <TableHead>{t("fields.contact", { defaultMessage: "Contact" })}</TableHead>
              <TableHead className="text-center">{t("fields.status", { defaultMessage: "Status" })}</TableHead>
              <TableHead className="text-right">{t("actions", { defaultMessage: "Actions" })}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("loading", { defaultMessage: "Loading..." })}
                </TableCell>
              </TableRow>
            ) : suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("noResults", { defaultMessage: "No suppliers found." })}
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    {supplier.name}
                  </TableCell>
                  <TableCell>{supplier.code}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs">{supplier.contactName}</span>
                      <span className="text-xs text-muted-foreground">{supplier.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {supplier.isActive ? (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">{t("active", { defaultMessage: "Active" })}</Badge>
                    ) : (
                      <Badge variant="secondary">{t("inactive", { defaultMessage: "Inactive" })}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(supplier)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(supplier)}>
                        {supplier.isActive ? <Ban className="h-4 w-4 text-orange-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(supplier.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isSheetOpen} onOpenChange={handleCloseSheet}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? t("editTitle", { defaultMessage: "Edit Supplier" }) : t("createTitle", { defaultMessage: "Create Supplier" })}</DialogTitle>
            <DialogDescription>
              {t("dialogDesc", { defaultMessage: "Manage supplier details." })}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  {t("fields.name", { defaultMessage: "Name" })}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  {t("fields.code", { defaultMessage: "Code" })}
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  {t("fields.email", { defaultMessage: "Email" })}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  {t("fields.phone", { defaultMessage: "Phone" })}
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contactName" className="text-right">
                  {t("fields.contactName", { defaultMessage: "Contact" })}
                </Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  {t("fields.active", { defaultMessage: "Active" })}
                </Label>
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(c) => setFormData({ ...formData, isActive: c as boolean })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{t("save", { defaultMessage: "Save" })}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
