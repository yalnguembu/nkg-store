"use client";

import { useProductView } from "@/hooks/views/useProductView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Search, Copy, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  const {
    products,
    isLoading,
    searchTerm,
    setSearchTerm,
    deleteProduct,
    duplicateProduct,
  } = useProductView();

  const t = useTranslations("Products");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {t("title", { defaultMessage: "Products" })}
        </h2>
        <Button onClick={() => router.push("/admin/catalogue/products/create")}>
          <Plus className="mr-2 h-4 w-4" />
          {t("add", { defaultMessage: "Add Product" })}
        </Button>
      </div>

      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder", {
              defaultMessage: "Search products...",
            })}
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
              <TableHead>
                {t("fields.name", { defaultMessage: "Name" })}
              </TableHead>
              <TableHead>
                {t("fields.sku", { defaultMessage: "SKU" })}
              </TableHead>
              <TableHead>
                {t("fields.category", { defaultMessage: "Category" })}
              </TableHead>
              <TableHead>
                {t("fields.brand", { defaultMessage: "Brand" })}
              </TableHead>
              <TableHead className="text-right">
                {t("fields.price", { defaultMessage: "Price" })}
              </TableHead>
              <TableHead className="text-center">
                {t("fields.status", { defaultMessage: "Status" })}
              </TableHead>
              <TableHead className="text-right">
                {t("actions", { defaultMessage: "Actions" })}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {t("loading", { defaultMessage: "Loading..." })}
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {t("noResults", { defaultMessage: "No products found." })}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell
                    className="font-medium cursor-pointer hover:underline text-primary"
                    onClick={() =>
                      router.push(`/admin/catalogue/products/${product.id}`)
                    }
                  >
                    {product.name}
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category?.name || "-"}</TableCell>
                  <TableCell>{product.brand?.name || "-"}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.isActive ? (
                      <Badge
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {t("active", { defaultMessage: "Active" })}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        {t("inactive", { defaultMessage: "Inactive" })}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          router.push(`/admin/catalogue/products/${product.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => duplicateProduct(product.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteProduct(product.id)}
                      >
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
    </div>
  );
}
