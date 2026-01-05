"use client"

import { useBrandView } from "@/hooks/views/useBrandView"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2, Tag } from "lucide-react"
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
import { ImageUpload } from "@/components/ui/image-upload"

export default function BrandsPage() {
  const {
    brands,
    isLoading,
    isSheetOpen,
    editingBrand,
    openCreate,
    openEdit,
    closeSheet,
    saveBrand,
    deleteBrand
  } = useBrandView()

  const t = useTranslations("Brands")
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({ name: "", logoUrl: "", isActive: true })

  useEffect(() => {
    if (isSheetOpen) {
      if (editingBrand) {
        setFormData({
          name: editingBrand.name,
          logoUrl: editingBrand.logoUrl || "",
          isActive: editingBrand.isActive
        })
      } else {
        setFormData({ name: "", logoUrl: "", isActive: true })
      }
    }
  }, [isSheetOpen, editingBrand])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveBrand(formData)
  }

  const filteredBrands = brands.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t("title", { defaultMessage: "Brands" })}</h2>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t("add", { defaultMessage: "Add Brand" })}
        </Button>
      </div>

      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder", { defaultMessage: "Search brands..." })}
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
              <TableHead className="w-[80px]">{t("fields.image", { defaultMessage: "Logo" })}</TableHead>
              <TableHead>{t("fields.name", { defaultMessage: "Name" })}</TableHead>
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
            ) : filteredBrands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("noResults", { defaultMessage: "No brands found." })}
                </TableCell>
              </TableRow>
            ) : (
              filteredBrands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div className="flex items-center justify-center h-10 w-10 rounded bg-muted overflow-hidden">
                      {brand.logoUrl ? (
                        <img src={brand.logoUrl} alt={brand.name} className="h-full w-full object-cover" />
                      ) : (
                        <Tag className="h-5 w-5 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {brand.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {brand.isActive ? (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">{t("active", { defaultMessage: "Active" })}</Badge>
                    ) : (
                      <Badge variant="secondary">{t("inactive", { defaultMessage: "Inactive" })}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(brand)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteBrand(brand.id)}>
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

      <Dialog open={isSheetOpen} onOpenChange={closeSheet}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingBrand ? t("editTitle", { defaultMessage: "Edit Brand" }) : t("createTitle", { defaultMessage: "Create Brand" })}</DialogTitle>
            <DialogDescription>
              {t("dialogDesc", { defaultMessage: "Manage brand details." })}
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
              <ImageUpload
                label={t("fields.logo", { defaultMessage: "Logo" })}
                currentImageUrl={formData.logoUrl}
                onImageChange={(url) => setFormData({ ...formData, logoUrl: url })}
                entityType="brands"
              />
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
