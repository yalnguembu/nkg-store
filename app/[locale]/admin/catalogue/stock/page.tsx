"use client";

import { useStockView } from "@/hooks/views/useStockView";
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
import {
  Search,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  History,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StockPage() {
  const {
    stocks,
    movements,
    products, // used to get product names for variants
    isLoading,
    searchTerm,
    setSearchTerm,
    handleAdjustStock,
  } = useStockView();

  const t = useTranslations("Stock");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [adjustment, setAdjustment] = useState({
    quantity: 0,
    reason: "",
    type: "increase",
  });

  const openAdjust = (variantId: string) => {
    setSelectedVariantId(variantId);
    setAdjustment({ quantity: 0, reason: "", type: "increase" });
    setIsAdjustOpen(true);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId) return;

    const qty =
      adjustment.type === "decrease"
        ? -Math.abs(adjustment.quantity)
        : Math.abs(adjustment.quantity);
    const success = await handleAdjustStock(
      selectedVariantId,
      qty,
      adjustment.reason,
    );
    if (success) {
      setIsAdjustOpen(false);
    }
  };

  // Helper to find product name for a stock item (which is linked to variantId)
  const getProductInfo = (variantId: string) => {
    for (const p of products) {
      const v = p.variants?.find((v) => v.id === variantId);
      if (v)
        return {
          productName: p.name,
          variantSku: v.sku,
          variantName: v.attributes ? JSON.stringify(v.attributes) : "Default",
        };
    }
    return { productName: "Unknown", variantSku: "N/A", variantName: "-" };
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {t("title", { defaultMessage: "Stock Management" })}
        </h2>
      </div>

      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder", {
              defaultMessage: "Search stock...",
            })}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>
              {t("stockLevels", { defaultMessage: "Stock Levels" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {t("fields.product", { defaultMessage: "Product" })}
                  </TableHead>
                  <TableHead>
                    {t("fields.sku", { defaultMessage: "SKU" })}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("fields.quantity", { defaultMessage: "Quantity" })}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("actions", { defaultMessage: "Actions" })}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      {t("loading", { defaultMessage: "Loading..." })}
                    </TableCell>
                  </TableRow>
                ) : stocks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      {t("noResults", {
                        defaultMessage: "No stock items found.",
                      })}
                    </TableCell>
                  </TableRow>
                ) : (
                  stocks.map((stock) => {
                    const info = getProductInfo(stock.variantId);
                    return (
                      <TableRow key={stock.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{info.productName}</span>
                            <span className="text-xs text-muted-foreground">
                              {info.variantName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{info.variantSku}</TableCell>
                        <TableCell className="text-right font-bold text-lg">
                          {stock.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openAdjust(stock.variantId)}
                          >
                            {t("adjust", { defaultMessage: "Adjust" })}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>
              {t("movements", { defaultMessage: "Recent Movements" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Note: useStockView currently doesn't fetch global movements, so this might be empty unless we fix the hook to fetch some global history */}
            <div className="space-y-4">
              {movements.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {t("noMovements", { defaultMessage: "No recent movements." })}
                </p>
              )}
              {movements.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div className="flex items-center">
                    {m.quantity > 0 ? (
                      <ArrowUpRight className="text-green-500 mr-2 h-4 w-4" />
                    ) : (
                      <ArrowDownLeft className="text-red-500 mr-2 h-4 w-4" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {m.variant?.product?.name || "Produit"} -{" "}
                        {m.variant?.sku}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {m.reason} •{" "}
                        {new Date(m.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-bold ${m.quantity > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {m.quantity > 0 ? "+" : ""}
                    {m.quantity}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {t("adjustTitle", { defaultMessage: "Adjust Stock" })}
            </DialogTitle>
            <DialogDescription>
              {t("adjustDesc", {
                defaultMessage: "Manually adjust stock quantity.",
              })}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdjustSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  {t("fields.type", { defaultMessage: "Type" })}
                </Label>
                <Select
                  value={adjustment.type}
                  onValueChange={(val) =>
                    setAdjustment({ ...adjustment, type: val })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase">Increase (+)</SelectItem>
                    <SelectItem value="decrease">Decrease (-)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  {t("fields.quantity", { defaultMessage: "Qty" })}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={adjustment.quantity}
                  onChange={(e) =>
                    setAdjustment({
                      ...adjustment,
                      quantity: parseInt(e.target.value),
                    })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  {t("fields.reason", { defaultMessage: "Reason" })}
                </Label>
                <Input
                  id="reason"
                  value={adjustment.reason}
                  onChange={(e) =>
                    setAdjustment({ ...adjustment, reason: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {t("save", { defaultMessage: "Save" })}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
