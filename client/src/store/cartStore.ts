import { create } from 'zustand';
import { $api } from '../api/interceptors';
import { useAuthStore } from './authStore';
import { toast } from 'sonner';
import i18next from 'i18next';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  getTotal: () => number;
  addToCart: (
    productId: string,
    quantity?: number,
    color?: string,
    size?: string,
  ) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: (silent: boolean) => Promise<void>;
  updateCartItem: (
    itemId: string,
    updateData: { color?: string; size?: string; quantity?: number },
  ) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    if (!useAuthStore.getState().token) return;

    set({ isLoading: true });
    try {
      const response = await $api.get('/cart');
      set({ items: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error loading cart', error);
    }
  },

  updateQuantity: async (cartItemId: string, quantity: number) => {
    try {
      if (quantity < 1) {
        await get().removeItem(cartItemId);
        return;
      }
      // await $api.patch(`/cart/${cartItemId}`, { quantity });
      await get().updateCartItem(cartItemId, { quantity });
      set((state) => ({
        items: state.items.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item,
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  getTotal: () => {
    const totalInUsd = get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
    return totalInUsd; // Возвращаем число для расчетов
  },

  addToCart: async (productId, quantity = 1, color, size) => {
    if (!useAuthStore.getState().token) {
      toast.error(i18next.t('cartStore.loginRequired'));
      return;
    }

    try {
      await $api.post('/cart', {
        productId,
        quantity,
        color,
        size,
      });
      // После добавления обновляем список товаров в корзине
      await get().fetchCart();
      toast.success(i18next.t('cartStore.productAdded'));
    } catch (error) {
      console.error('Error adding to cart', error);
      toast.error(i18next.t('cartStore.failedToAdd'));
    }
  },

  removeItem: async (cartItemId) => {
    try {
      await $api.delete(`/cart/${cartItemId}`);
      set((state) => ({
        items: state.items.filter((item) => item.id !== cartItemId),
      }));
      toast.success(i18next.t('cartStore.itemRemoved'));
    } catch (error) {
      console.error('Error deleting from cart', error);
      toast.error(i18next.t('cartStore.failedToDelete'));
    }
  },

  clearCart: async (silent = false) => {
    if (!useAuthStore.getState().token) return;
    try {
      await $api.delete('/cart/clear'); // Эндпоинт для полной очистки
      set({ items: [] });
      if (!silent) toast.success(i18next.t('cartStore.cartCleared'));
    } catch (error) {
      console.error('Error to clear the cart', error);
      toast.error(i18next.t('cartStore.failedToClearCart'));
    }
  },

  updateCartItem: async (
    itemId: string,
    updateData: { color?: string; size?: string; quantity?: number },
  ) => {
    try {
      await $api.patch(`/cart/${itemId}`, updateData);
      await get().fetchCart();
      toast.success(i18next.t('cartStore.CartUpdated'));
    } catch (error) {
      console.error('Error to clear the cart', error);
      toast.error(i18next.t('cartStore.failedToUpdateCart'));
    }
  },
}));
