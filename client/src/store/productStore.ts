import { create } from 'zustand';
import { $api } from '../api/interceptors';

interface FilterParams {
  category?: string;
  color?: string;
  size?: string;
  sort?: string;
  limit?: number;
  page?: number;
  search?: string;
}

interface ProductState {
  products: IProduct[];
  totalCount: number;
  isLoading: boolean;
  fetchAllProducts: (filters?: FilterParams, append?: boolean) => Promise<void>;
  clearProducts: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  totalCount: 0,
  isLoading: false,

  clearProducts: () => set({ products: [], totalCount: 0, isLoading: false }),

  fetchAllProducts: async (filters = {}, append = false) => {
    set({ isLoading: true });
    try {
      const res = await $api.get('/products', {
        params: filters,
      });
      set((state) => {
        // Проверка на дубликаты по ID (на всякий случай)
        const newProducts = res.data.products;
        const updatedProducts = append
          ? [
              ...state.products,
              ...newProducts.filter(
                (np: IProduct) => !state.products.some((sp) => sp.id === np.id)
              ),
            ]
          : newProducts;

        return {
          products: updatedProducts,
          totalCount: res.data.totalCount,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error('Fetch products error:', error);
      // set({ isLoading: false });
      set({ products: [], isLoading: false });
    }
  },
}));
