"use client";

import { useState, useCallback, useEffect } from "react";
import { ProductDocument, Product } from "@/types";
import {
  productsControllerFindAll,
  documentsControllerFindAll,
  documentsControllerRemove,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

export function useDocumentView() {
  const [documents, setDocuments] = useState<ProductDocument[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { toast } = useToast();
  const t = useTranslations("Documents");

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [prodRes, docRes] = await Promise.all([
        productsControllerFindAll(),
        documentsControllerFindAll(),
      ]);

      if (prodRes.data) {
        const prodData = prodRes.data as any;
        setProducts(prodData?.data?.data || []);
      }

      if (docRes.data) {
        const data = docRes.data as any;
        setDocuments(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error) {
      console.error("Error fetching documents data:", error);
      toast({
        title: "Error fetching documents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateDocument = async (data: any) => {
    try {
      // Mock creation for now as we don't have a create endpoint in the spec/module yet
      // In a real app, you'd add documentsControllerCreate to the spec
      const newDoc: ProductDocument = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
      };
      setDocuments((prev) =>
        Array.isArray(prev) ? [newDoc, ...prev] : [newDoc],
      );
      setIsSheetOpen(false);
      toast({ title: t("saveSuccess") });
    } catch (error) {
      toast({
        title: t("errorSaving"),
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await documentsControllerRemove({
        path: { id },
      });
      setDocuments((prev) =>
        Array.isArray(prev) ? prev.filter((d) => d.id !== id) : [],
      );
      toast({ title: "Document deleted" });
    } catch (error) {
      toast({
        title: "Error deleting document",
        variant: "destructive",
      });
    }
  };

  const filteredDocuments = (Array.isArray(documents) ? documents : []).filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      products
        .find((p) => p.id === doc.productId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return {
    documents: filteredDocuments,
    products,
    isLoading,
    searchTerm,
    setSearchTerm,
    isSheetOpen,
    setIsSheetOpen,
    handleCreateDocument,
    handleDeleteDocument,
    refresh: fetchData,
  };
}
