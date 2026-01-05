import { useState, useEffect } from 'react';
import { brandsControllerFindAll, brandsControllerCreate, brandsControllerUpdate, brandsControllerRemove } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Brand } from '@/types/brand';

export function useBrandView() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const { toast } = useToast();

  const loadBrands = async () => {
    setIsLoading(true);
    try {
      const response = await brandsControllerFindAll();
      // Assuming response.data is the array or response itself is the array if using client-fetch defaults?
      // With @hey-api/client-fetch, response.data holds the body.
      // Based on specs, it returns '200'. 
      if (response.data) {
        const responseData = response.data as any
        setBrands(responseData?.data?.data || []);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load brands",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const openCreate = () => {
    setEditingBrand(null);
    setIsSheetOpen(true);
  };

  const openEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setEditingBrand(null);
  };

  const saveBrand = async (data: Partial<Brand>) => {
    try {
      if (editingBrand) {
        await brandsControllerUpdate({
          path: { id: editingBrand.id },
          body: data
        });
        toast({ title: "Success", description: "Brand updated successfully" });
      } else {
        await brandsControllerCreate({
          body: data as any
        });
        toast({ title: "Success", description: "Brand created successfully" });
      }
      loadBrands();
      closeSheet();
      return true;
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to save brand", variant: "destructive" });
      return false;
    }
  };

  const deleteBrand = async (id: string) => {
    try {
      await brandsControllerRemove({ path: { id } });
      toast({ title: "Success", description: "Brand deleted successfully" });
      loadBrands();
      return true;
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to delete brand", variant: "destructive" });
      return false;
    }
  };

  return {
    brands,
    isLoading,
    isSheetOpen,
    editingBrand,
    openCreate,
    openEdit,
    closeSheet,
    saveBrand,
    deleteBrand,
    refresh: loadBrands
  };
}
