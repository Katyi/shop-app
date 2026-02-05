import { create } from 'zustand';
import { $api } from '../api/interceptors';
import { useAuthStore } from './authStore';
import { toast } from 'sonner';
import i18next from 'i18next';

interface WishlistState {
  items: IProduct[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    if (!useAuthStore.getState().token) return;

    set({ isLoading: true });
    try {
      const response = await $api.get('/wishlist');
      set({ items: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Ошибка загрузки wishlist', error);
    }
  },

  toggleWishlist: async (productId: string) => {
    if (!useAuthStore.getState().token) {
      toast.warning(i18next.t('wishlistStore.loginRequired'));
      return;
    }

    try {
      // Наш NestJS бэкенд возвращает обновленный объект пользователя с полем wishlist
      const response = await $api.post(`/wishlist/${productId}`);
      set({ items: response.data.wishlist });
    } catch (error) {
      console.error('Ошибка переключения избранного', error);
    }
  },

  clearWishlist: async () => {
    if (!useAuthStore.getState().token) return;

    if (useWishlistStore.getState().items.length === 0) {
      toast.info(i18next.t('wishlistStore.wishlistAlreadyEmpty'));
      return;
    }

    set({ isLoading: true });
    try {
      const response = await $api.delete('/wishlist');
      set({ items: response.data.wishlist, isLoading: false });
      toast.success(i18next.t('wishlistStore.wishlistCleared'));
    } catch (error) {
      set({ isLoading: false });
      console.error('Error clearing wishlist', error);
      toast.error(i18next.t('wishlistStore.failedToClearWishlist'));
    }
  },
}));
