"use client"

import { useModelView, Model } from "@/hooks/views/useModelView"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2, Box, Eye, Calendar, Image as ImageIcon } from "lucide-react"
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
// We might need to fetch brands to select a brand for the model
import { useBrandView } from "@/hooks/views/useBrandView"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"

export default function ModelsPage() {
  const {
    models,
    isLoading,
    isSheetOpen,
    editingModel,
    viewingModel,
    isDetailsOpen,
    openCreate,
    openEdit,
    closeSheet,
    openDetails,
    closeDetails,
    saveModel,
    deleteModel
  } = useModelView()

  const { brands } = useBrandView() // Fetch brands for selection

  const t = useTranslations("Models")
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({ name: "", reference: "", year: "", imageUrl: "", brandId: "", isActive: true })

  useEffect(() => {
    if (isSheetOpen) {
      if (editingModel) {
        setFormData({
          name: editingModel.name,
          reference: editingModel.reference || "",
          year: editingModel.year?.toString() || "",
          imageUrl: editingModel.imageUrl || "",
          brandId: editingModel.brandId,
          isActive: editingModel.isActive
        })
      } else {
        setFormData({ name: "", reference: "", year: "", imageUrl: "", brandId: "", isActive: true })
      }
    }
  }, [isSheetOpen, editingModel])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveModel({
      ...formData,
      year: formData.year ? parseInt(formData.year) : undefined
    })
  }

  const filteredModels = models.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.reference.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t("title", { defaultMessage: "Models" })}</h2>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t("add", { defaultMessage: "Add Model" })}
        </Button>
      </div>

      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder", { defaultMessage: "Search models..." })}
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
              <TableHead>{t("fields.reference", { defaultMessage: "Reference" })}</TableHead>
              <TableHead>{t("fields.brand", { defaultMessage: "Brand" })}</TableHead>
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
            ) : filteredModels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("noResults", { defaultMessage: "No models found." })}
                </TableCell>
              </TableRow>
            ) : (
              filteredModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Box className="h-4 w-4 text-muted-foreground" />
                    {model.name}
                  </TableCell>
                  <TableCell>{model.reference}</TableCell>
                  <TableCell>
                    {brands.find(b => b.id === model.brandId)?.name || model.brandId}
                  </TableCell>
                  <TableCell className="text-center">
                    {model.isActive ? (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">{t("active", { defaultMessage: "Active" })}</Badge>
                    ) : (
                      <Badge variant="secondary">{t("inactive", { defaultMessage: "Inactive" })}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openDetails(model)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(model)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteModel(model.id)}>
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
            <DialogTitle>{editingModel ? t("editTitle", { defaultMessage: "Edit Model" }) : t("createTitle", { defaultMessage: "Create Model" })}</DialogTitle>
            <DialogDescription>
              {t("dialogDesc", { defaultMessage: "Manage product models." })}
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
                <Label htmlFor="reference" className="text-right">
                  {t("fields.reference", { defaultMessage: "Reference" })}
                </Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">
                  {t("fields.year", { defaultMessage: "Year" })}
                </Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">
                  {t("fields.image", { defaultMessage: "Image URL" })}
                </Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="col-span-3"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="brand" className="text-right">
                  {t("fields.brand", { defaultMessage: "Brand" })}
                </Label>
                <Select
                  value={formData.brandId}
                  onValueChange={(val) => setFormData({ ...formData, brandId: val })}
                  required
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ImageUpload
                label={t("fields.image", { defaultMessage: "Image" })}
                currentImageUrl={formData.imageUrl}
                onImageChange={(url) => setFormData({ ...formData, imageUrl: url })}
                entityType="models"
              />
            </div>
            <DialogFooter>
              <Button type="submit">{t("save", { defaultMessage: "Save" })}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ModelDetailsDialog
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        model={viewingModel}
        brandName={brands.find(b => b.id === viewingModel?.brandId)?.name}
      />
    </div>
  )
}

function ModelDetailsDialog({ isOpen, onClose, model, brandName }: { isOpen: boolean; onClose: () => void; model: Model | null; brandName?: string }) {
  const t = useTranslations("Models")
  if (!model) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("details.title", { defaultMessage: "Model Details" })}</DialogTitle>
          <DialogDescription>{model.name}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-start gap-4">
            <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
              {model.imageUrl ? (
                <img src={model.imageUrl} alt={model.name} className="h-full w-full object-cover" />
              ) : (
                <Box className="h-10 w-10 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-lg font-semibold">{model.name}</h3>
              <p className="text-sm text-muted-foreground">{brandName || model.brandId}</p>
              <div className="flex items-center gap-2 mt-2">
                {model.isActive ? (
                  <Badge variant="default" className="bg-green-600">
                    {t("active", { defaultMessage: "Active" })}
                  </Badge>
                ) : (
                  <Badge variant="secondary">{t("inactive", { defaultMessage: "Inactive" })}</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-4">
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                  {t("details.basicInfo", { defaultMessage: "Basic Information" })}
                </Label>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-medium">{t("details.id", { defaultMessage: "ID" })}</span>
                    <span className="text-muted-foreground font-mono text-[10px]">{model.id}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-medium">{t("details.slug", { defaultMessage: "Slug" })}</span>
                    <span className="text-muted-foreground">{model.slug}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-medium">{t("fields.reference", { defaultMessage: "Reference" })}</span>
                    <span className="text-muted-foreground">{model.reference || "-"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-medium">{t("fields.year", { defaultMessage: "Year" })}</span>
                    <span className="text-muted-foreground">{model.year || "-"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                  {t("details.statistics", { defaultMessage: "Statistics" })}
                </Label>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between border-b pb-1">
                    <div className="flex items-center gap-2">
                      <Box className="h-3 w-3" />
                      <span className="font-medium">{t("details.productsCount", { defaultMessage: "Products" })}</span>
                    </div>
                    <span className="font-bold">{model._count?.products || 0}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                  {t("details.metadata", { defaultMessage: "Metadata" })}
                </Label>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-medium">{t("details.createdAt", { defaultMessage: "Created At" })}</span>
                    <span className="text-muted-foreground">
                      {model.createdAt ? new Date(model.createdAt).toLocaleString() : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-medium">{t("details.updatedAt", { defaultMessage: "Updated At" })}</span>
                    <span className="text-muted-foreground">
                      {model.updatedAt ? new Date(model.updatedAt).toLocaleString() : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>{t("common.close", { defaultMessage: "Close" })}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
