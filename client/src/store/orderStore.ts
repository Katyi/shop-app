import { create } from 'zustand';
import { $api } from '../api/interceptors';

interface OrderState {
  orders: IOrder[];
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  createOrder: (address: string, phone?: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      // Согласно OrdersController: @Get() -> '/orders'
      const { data } = await $api.get<IOrder[]>('/orders');
      set({ orders: data, isLoading: false });
    } catch (error) {
      console.error('Fetch orders error:', error);
      set({ isLoading: false });
    }
  },

  createOrder: async (address: string, phone?: string) => {
    try {
      // Согласно OrdersController: @Post() ожидает address в body
      await $api.post('/orders', { address, phone });
      await get().fetchOrders(); // Обновляем список заказов
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },
}));
