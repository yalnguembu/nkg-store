"use client";

import { useState } from "react";
import { useAdminProductDetailView } from "@/hooks/views/useAdminProductDetailView";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Pencil,
  Settings2,
  Package,
  Tag,
  Layers,
  Truck,
  Image as ImageIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// Modals
import { GeneralInfoModal } from "../_components/GeneralInfoModal";
import { MediaModal } from "../_components/MediaModal";
import { VariantsModal } from "../_components/VariantsModal";
import { LogisticsModal } from "../_components/LogisticsModal";

export default function ProductDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const {
    product,
    categories,
    brands,
    models,
    isLoading,
    error,
    updateProduct,
  } = useAdminProductDetailView(id);
  const t = useTranslations("Products");

  // Modal states
  const [isGeneralModalOpen, setIsGeneralModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isVariantsModalOpen, setIsVariantsModalOpen] = useState(false);
  const [isLogisticsModalOpen, setIsLogisticsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-64" />
          <Skeleton className="col-span-3 h-64" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            Product Not Found
          </h2>
        </div>
        <Card>
          <CardContent className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">
              The requested product could not be found or an error occurred.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h2>
            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {product.isActive ? (
            <Badge variant="default" className="bg-green-600">
              Active
            </Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsGeneralModalOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* General Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-lg font-medium">
                General Information
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsGeneralModalOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Category
                </dt>
                <dd className="text-sm">
                  {product.category?.name || "Uncategorized"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Brand
                </dt>
                <dd className="text-sm">{product.brand?.name || "No Brand"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Slug
                </dt>
                <dd className="text-sm">{product.slug}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Created At
                </dt>
                <dd className="text-sm">
                  {new Date(product.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
            <div className="mt-4">
              <dt className="text-sm font-medium text-muted-foreground">
                Description
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground line-clamp-3">
                {product.description || "No description provided."}
              </dd>
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-lg font-medium">Media</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMediaModalOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-4 gap-2">
              {product.images && product.images.length > 0 ? (
                product.images.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-md border bg-muted flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={img.imageUrl}
                      alt={`Product ${i}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-4 h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-8 w-8 mb-1" />
                  <span className="text-xs">No images</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Variants, Pricing & Attributes */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-lg font-medium">
                Variants, Pricing & Attributes
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVariantsModalOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU / Name</TableHead>
                  <TableHead>Attributes</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Inventory</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.variants && product.variants.length > 0 ? (
                  product.variants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell>
                        <div className="font-medium">{variant.sku}</div>
                        <div className="text-xs text-muted-foreground">
                          {variant.name || "Default Variant"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {variant.attributes &&
                            Object.entries(variant.attributes).map(
                              ([key, value]) => (
                                <Badge
                                  key={key}
                                  variant="outline"
                                  className="text-[10px] h-4"
                                >
                                  {key}: {String(value)}
                                </Badge>
                              ),
                            )}
                          {!variant.attributes && (
                            <span className="text-xs text-muted-foreground">
                              -
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {variant.bestPrice ? (
                          <div className="space-y-1">
                            <div className="font-bold">
                              {formatCurrency(variant.bestPrice.unitPrice)}
                            </div>
                            {variant.bestPrice.bulkPrice && (
                              <div className="text-[10px] text-muted-foreground">
                                Bulk:{" "}
                                {formatCurrency(variant.bestPrice.bulkPrice)}{" "}
                                (min {variant.bestPrice.bulkMinQuantity})
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No price
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-sm">
                          {variant.stock?.quantity ?? 0}
                          <span className="text-xs text-muted-foreground ml-1">
                            available
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {variant.isActive ? (
                          <Badge
                            variant="default"
                            className="text-[10px] h-4 bg-green-600"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="text-[10px] h-4"
                          >
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No variants defined for this product.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Logistics & Other */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-lg font-medium">
                Logistics & Installation
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLogisticsModalOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1 border rounded-md p-3">
                <dt className="text-sm font-semibold flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  Installation
                </dt>
                <dd className="text-sm">
                  {product.requiresInstallation ? (
                    <Badge className="bg-blue-600">Required</Badge>
                  ) : (
                    <span className="text-muted-foreground italic">
                      Not required
                    </span>
                  )}
                </dd>
              </div>
              <div className="space-y-1 border rounded-md p-3">
                <dt className="text-sm font-semibold flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Dropshipping
                </dt>
                <dd className="text-sm">
                  {product.isDropshipping ? (
                    <div className="space-y-1">
                      <Badge className="bg-purple-600">Enabled</Badge>
                      {product.supplier && (
                        <div className="text-xs">
                          Supplier: {product.supplier.name}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">
                      Disabled
                    </span>
                  )}
                </dd>
              </div>
              <div className="space-y-1 border rounded-md p-3">
                <dt className="text-sm font-semibold flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  SEO Meta
                </dt>
                <dd className="text-sm">
                  <div className="text-xs font-medium">
                    Title: {product.metaTitle || "-"}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    Desc: {product.metaDescription || "-"}
                  </div>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <GeneralInfoModal
        isOpen={isGeneralModalOpen}
        onClose={() => setIsGeneralModalOpen(false)}
        product={product}
        categories={categories}
        brands={brands}
        models={models}
        onSave={(data) => updateProduct(data)}
      />

      <MediaModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        productImages={product.images || []}
        onSave={(images) => updateProduct({ images })}
      />

      <VariantsModal
        isOpen={isVariantsModalOpen}
        onClose={() => setIsVariantsModalOpen(false)}
        productVariants={product.variants || []}
        onSave={(variants) => updateProduct({ variants })}
      />

      <LogisticsModal
        isOpen={isLogisticsModalOpen}
        onClose={() => setIsLogisticsModalOpen(false)}
        product={product}
        onSave={(data) => updateProduct(data)}
      />
    </div>
  );
}
