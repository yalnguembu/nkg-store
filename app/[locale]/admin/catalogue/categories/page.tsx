"use client"

import { useCategoryView } from "@/hooks/views/useCategoryView"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2, FolderTree, ChevronRight, ChevronDown, Eye } from "lucide-react"
import { useTranslations } from "next-intl"
import React from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { type CategoryDto as Category } from "@/lib/api"
import { ImageUpload } from "@/components/ui/image-upload"

interface CategoryRowsProps {
  items: Category[]
  level: number
  searchTerm: string
  onEdit: (cat: Category) => void
  onDelete: (id: string) => void
  onView: (cat: Category) => void
  categories: Category[]
}

function CategoryTreeItem({ item, level }: { item: Category; level: number }) {
  return (
    <div className="space-y-1">
      <div
        className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-accent/50 transition-colors"
        style={{ marginLeft: `${level * 1.5}rem` }}
      >
        <FolderTree className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{item.name}</span>
        {item._count && (
          <Badge variant="outline" className="ml-auto text-[10px] h-4">
            {item._count.products || 0} products
          </Badge>
        )}
      </div>
      {item.children?.map((child) => (
        <CategoryTreeItem key={child.id} item={child} level={level + 1} />
      ))}
    </div>
  )
}

function CategoryRows({ items, level, searchTerm, onEdit, onDelete, onView, categories }: CategoryRowsProps) {
  const t = useTranslations("Categories")

  // Filter items based on search term (including children)
  const matchesSearch = (cat: Category): boolean => {
    if ((cat.name || "").toLowerCase().includes(searchTerm.toLowerCase())) return true
    if (cat.children?.some(child => matchesSearch(child))) return true
    return false
  }

  const filteredItems = searchTerm ? items.filter(matchesSearch) : items

  return (
    <>
      {filteredItems.map((category) => (
        <React.Fragment key={category.id}>
          <TableRow>
            <TableCell>
              <div className="flex items-center justify-center h-10 w-10 rounded bg-muted overflow-hidden">
                {category.imageUrl ? (
                  <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover" />
                ) : (
                  <FolderTree className="h-5 w-5 text-muted-foreground/50" />
                )}
              </div>
            </TableCell>
            <TableCell
              className="font-medium flex items-center gap-2"
              style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
            >
              <FolderTree className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{category.name}</span>
            </TableCell>
            <TableCell>
              {categories.find(c => c.id === category.parentId)?.name || "-"}
            </TableCell>
            <TableCell className="max-w-[200px] truncate">{category.description}</TableCell>
            <TableCell className="text-center">
              {category.isActive ? (
                <Badge variant="default" className="bg-green-600 hover:bg-green-700">{t("active", { defaultMessage: "Active" })}</Badge>
              ) : (
                <Badge variant="secondary">{t("inactive", { defaultMessage: "Inactive" })}</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => onView(category)}>
                  <Eye className="h-4 w-4 text-blue-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => category.id && onDelete(category.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
          {category.children && category.children.length > 0 && (
            <CategoryRows
              items={category.children}
              level={level + 1}
              searchTerm={searchTerm}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              categories={categories}
            />
          )}
        </React.Fragment>
      ))}
    </>
  )
}

export default function CategoriesPage() {
  const {
    categories,
    isLoading,
    isSheetOpen,
    editingCategory,
    openCreate,
    openEdit,
    closeSheet,
    viewingCategory,
    isDetailsOpen,
    openDetails,
    closeDetails,
    saveCategory,
    deleteCategory,
    categoryTree
  } = useCategoryView()

  const t = useTranslations("Categories")
  const [searchTerm, setSearchTerm] = useState("")
  const [isTreeOpen, setIsTreeOpen] = useState(false)

  // Simple form state for the dialog
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    parentId: null as string | null,
    isActive: true
  })

  useEffect(() => {
    if (isSheetOpen) {
      if (editingCategory) {
        setFormData({
          name: editingCategory.name || "",
          description: editingCategory.description || "",
          imageUrl: editingCategory.imageUrl || "",
          isActive: editingCategory.isActive ?? true,
          parentId: editingCategory.parentId || ""
        })
      } else {
        setFormData({ name: "", description: "", imageUrl: "", isActive: true, parentId: "" })
      }
    }
  }, [isSheetOpen, editingCategory])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Convert empty string or "none" back to undefined for parentId
    const dataToSave = {
      ...formData,
      parentId: (formData.parentId === "" || formData.parentId === "none") ? undefined : formData.parentId
    }
    saveCategory(dataToSave)
  }

  const filteredCategories = categories.filter(c =>
    (c.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t("title", { defaultMessage: "Categories" })}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsTreeOpen(true)}>
            <FolderTree className="mr-2 h-4 w-4" />
            {t("viewTree", { defaultMessage: "View Hierarchy" })}
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            {t("add", { defaultMessage: "Add Category" })}
          </Button>
        </div>
      </div>

      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder", { defaultMessage: "Search categories..." })}
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
              <TableHead className="w-[80px]">{t("fields.image", { defaultMessage: "Image" })}</TableHead>
              <TableHead>{t("fields.name", { defaultMessage: "Name" })}</TableHead>
              <TableHead>{t("fields.parent", { defaultMessage: "Parent" })}</TableHead>
              <TableHead>{t("fields.description", { defaultMessage: "Description" })}</TableHead>
              <TableHead className="text-center">{t("fields.status", { defaultMessage: "Status" })}</TableHead>
              <TableHead className="text-right">{t("actions", { defaultMessage: "Actions" })}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t("loading", { defaultMessage: "Loading..." })}
                </TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t("noResults", { defaultMessage: "No categories found." })}
                </TableCell>
              </TableRow>
            ) : (
              <CategoryRows
                items={categoryTree}
                level={0}
                searchTerm={searchTerm}
                onEdit={openEdit}
                onDelete={deleteCategory}
                onView={openDetails}
                categories={categories}
              />
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isSheetOpen} onOpenChange={closeSheet}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? t("editTitle", { defaultMessage: "Edit Category" }) : t("createTitle", { defaultMessage: "Create Category" })}</DialogTitle>
            <DialogDescription>
              {t("dialogDesc", { defaultMessage: "Manage your product category details." })}
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
                <Label htmlFor="description" className="text-right">
                  {t("fields.description", { defaultMessage: "Desc" })}
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parentId" className="text-right">
                  {t("fields.parent", { defaultMessage: "Parent" })}
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.parentId}
                    onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                  >
                    <SelectTrigger id="parentId">
                      <SelectValue placeholder={t("selectParent", { defaultMessage: "None" })} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t("selectParent", { defaultMessage: "None" })}</SelectItem>
                      {categories
                        .filter(c => c.id !== editingCategory?.id)
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id || ""}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Checkbox for Active status could be added here */}
            </div>
            <DialogFooter>
              <Button type="submit">{t("save", { defaultMessage: "Save" })}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isTreeOpen} onOpenChange={setIsTreeOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{t("treeTitle", { defaultMessage: "Category Hierarchy" })}</DialogTitle>
            <DialogDescription>
              {t("listTitle", { defaultMessage: "Visual representation of your categories structure." })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4 space-y-2 pr-2">
            {categoryTree.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t("noResults", { defaultMessage: "No categories to display." })}
              </p>
            ) : (
              categoryTree.map((cat) => (
                <CategoryTreeItem key={cat.id} item={cat} level={0} />
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTreeOpen(false)}>
              {t("common.close", { defaultMessage: "Close" })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDetailsOpen} onOpenChange={closeDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("detailsTitle", { defaultMessage: "Category Details" })}</DialogTitle>
            <DialogDescription>
              {viewingCategory?.name}
            </DialogDescription>
          </DialogHeader>
          {viewingCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <Label className="text-muted-foreground text-xs uppercase">{t("fields.id")}</Label>
                  <p className="text-sm font-mono break-all">{viewingCategory.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs uppercase">{t("fields.status")}</Label>
                  <div>
                    {viewingCategory.isActive ? (
                      <Badge className="bg-green-600 hover:bg-green-700">{t("active")}</Badge>
                    ) : (
                      <Badge variant="secondary">{t("inactive")}</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs uppercase">{t("fields.name")}</Label>
                  <p className="text-sm font-semibold">{viewingCategory.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs uppercase">{t("fields.slug")}</Label>
                  <p className="text-sm">{viewingCategory.slug}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs uppercase">{t("fields.description")}</Label>
                <p className="text-sm">{viewingCategory.description || "-"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs uppercase">{t("fields.parent")}</Label>
                  <p className="text-sm">
                    {categories.find(c => c.id === viewingCategory.parentId)?.name || "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs uppercase">{t("fields.orderIndex")}</Label>
                  <p className="text-sm">{viewingCategory.orderIndex}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs uppercase">{t("fields.imageUrl")}</Label>
                <p className="text-sm break-all">{viewingCategory.imageUrl || "-"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <Label className="text-muted-foreground text-xs uppercase">{t("fields.createdAt")}</Label>
                  <p className="text-sm">
                    {viewingCategory.createdAt ? new Date(viewingCategory.createdAt).toLocaleString() : "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs uppercase">{t("fields.updatedAt")}</Label>
                  <p className="text-sm">
                    {viewingCategory.updatedAt ? new Date(viewingCategory.updatedAt).toLocaleString() : "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <Label className="text-muted-foreground text-xs uppercase">{t("fields.productsCount")}</Label>
                  <p className="text-sm font-bold">{viewingCategory._count?.products ?? 0}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs uppercase">{t("fields.childrenCount")}</Label>
                  <p className="text-sm font-bold">{viewingCategory._count?.children ?? 0}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeDetails}>
              {t("common.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
