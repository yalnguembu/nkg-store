"use client"

import { useState, useEffect, useCallback } from 'react';
import { modelControllerFindAll, modelControllerCreate, modelControllerUpdate, modelControllerRemove } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

export interface Model {
  id: string;
  name: string;
  reference: string;
  year?: number;
  imageUrl?: string;
  brandId: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products: number;
  };
  // include brand if needed for display? usually backend returns relations if asked
  brand?: {
    id: string;
    name: string;
  };
}

export function useModelView() {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [viewingModel, setViewingModel] = useState<Model | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();
  const t = useTranslations('Models');

  const loadModels = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await modelControllerFindAll({});
      if (response.data) {
        setModels((response.data as any).data || []);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: t("errorLoad"),
        description: "Failed to load models",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  const openCreate = () => {
    setEditingModel(null);
    setIsSheetOpen(true);
  };

  const openEdit = (model: Model) => {
    setEditingModel(model);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setEditingModel(null);
  };
  const openDetails = (model: Model) => {
    setViewingModel(model);
    setIsDetailsOpen(true);
  };
  const closeDetails = () => {
    setIsDetailsOpen(false);
    setViewingModel(null);
  };

  const saveModel = async (data: Partial<Model>) => {
    try {
      if (editingModel) {
        await modelControllerUpdate({
          path: { id: editingModel.id },
          body: data
        });
        toast({ title: t("successUpdate"), description: "Model updated successfully" });
      } else {
        await modelControllerCreate({
          body: data as any
        });
        toast({ title: t("successCreate"), description: "Model created successfully" });
      }
      loadModels();
      closeSheet();
      return true;
    } catch (error) {
      console.error(error);
      toast({ title: t("errorSave"), description: "Failed to save model", variant: "destructive" });
      return false;
    }
  };

  const deleteModel = async (id: string) => {
    try {
      await modelControllerRemove({ path: { id } });
      toast({ title: t("successDelete"), description: "Model deleted successfully" });
      loadModels();
      return true;
    } catch (error) {
      console.error(error);
      toast({ title: t("errorDelete"), description: "Failed to delete model", variant: "destructive" });
      return false;
    }
  };

  return {
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
    deleteModel,
    refresh: loadModels
  };
}
