"use client";

import { useState, useCallback, useEffect } from "react";
import {
  productsControllerFindOne,
  productsControllerUpdate,
  categoriesControllerFindAll,
  brandsControllerFindAll,
  modelControllerFindAll,
} from "@/lib/api";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Brand } from "@/types/brand";
import { Model } from "@/hooks/views/useModelView";
import { useToast } from "@/hooks/use-toast";

export function useAdminProductDetailView(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [productRes, categoriesRes, brandsRes, modelsRes] =
        await Promise.all([
          productsControllerFindOne({ path: { id } }),
          categoriesControllerFindAll({}),
          brandsControllerFindAll({}),
          modelControllerFindAll({}),
        ]);

      if (productRes.data) {
        const responseData = productRes.data as any;
        setProduct(responseData?.data || null);
      }
      if (categoriesRes.data) {
        const responseData = categoriesRes.data as any;
        setCategories(responseData?.data?.data || []);
      }
      if (brandsRes.data) {
        const responseData = brandsRes.data as any;
        setBrands(responseData?.data?.data || []);
      }
      if (modelsRes.data) {
        const responseData = modelsRes.data as any;
        setModels(responseData?.data || []);
      }
    } catch (err: any) {
      const errorObj =
        err instanceof Error
          ? err
          : new Error(err?.message || "Error fetching data");
      setError(errorObj);
      toast({
        title: "Error fetching details",
        description: errorObj.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  const updateProduct = async (data: any) => {
    try {
      await productsControllerUpdate({ path: { id }, body: data });
      toast({ title: "Product updated successfully" });
      fetchData();
    } catch (err: any) {
      toast({
        title: "Error updating product",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    product,
    categories,
    brands,
    models,
    isLoading,
    error,
    updateProduct,
    refresh: fetchData,
  };
}
