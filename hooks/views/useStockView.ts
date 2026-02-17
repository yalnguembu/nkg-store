"use client";

import { useState, useCallback, useEffect } from "react";
import {
  stockControllerGetLowStockItems,
  stockControllerAdjustStock,
  stockControllerGetMovements,
  productsControllerFindAll,
  variantsControllerUpdate,
  stockControllerGetAllMovements,
} from "@/lib/api/sdk.gen";
import { Stock, StockMovement, Product, ProductVariant } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

export function useStockView() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toast } = useToast();
  const t = useTranslations("Stock");

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // We'll fetch all products to get variants
      // In a real app, we'd have a specific "get inventory" endpoint returning product/variant info with stock
      const productsRes = await productsControllerFindAll({
        query: { limit: 100 },
      });

      if (productsRes.data) {
        const responseData = productsRes.data.data as any;
        const productList = (responseData?.data || []) as Product[];
        console.log(productList);
        setProducts(productList);

        // Extract all stocks from product variants (no need for separate N+1 calls)
        const stockList: Stock[] = productList.flatMap(
          (p) =>
            p.variants?.map((v: ProductVariant) => v.stock).filter(Boolean) ||
            [],
        ) as Stock[];

        setStocks(stockList);
      }

      // Fetch global recent movements
      const movementsResponse = await stockControllerGetAllMovements({
        query: { limit: 10 },
      });

      if (movementsResponse.data) {
        setMovements((movementsResponse.data as any).data || []);
      }
      // In a real production scenario, I'd ask for a global movements endpoint.
    } catch (error) {
      toast({
        title: "Error fetching stock data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdjustStock = async (
    variantId: string,
    quantity: number,
    reason: string,
  ) => {
    try {
      await stockControllerAdjustStock({
        path: { variantId },
        body: { quantity, reason },
      });
      toast({ title: t("saveSuccess") });
      fetchData();
      return true;
    } catch (error) {
      toast({
        title: t("errorSaving"),
        variant: "destructive",
      });
      return false;
    }
  };

  const getVariantDetails = (variantId: string) => {
    for (const p of products) {
      const v = p.variants?.find((v) => v.id === variantId);
      if (v) return { product: p, variant: v };
    }
    return null;
  };

  return {
    stocks,
    movements,
    products,
    isLoading,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    handleAdjustStock,
    getVariantDetails,
    refresh: fetchData,
  };
}
