import { create } from 'zustand';
import { $api } from '../api/interceptors';
import axios from 'axios';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  fetchMe: () => Promise<void>;
  updateUser: (
    data: Partial<User>,
  ) => Promise<{ success: boolean; error?: string }>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  fetchMe: async () => {
    try {
      const response = await $api.get('/users/me');
      set({ user: response.data });
    } catch {
      console.error('Failed to fetch user');
    }
  },

  updateUser: async (data: Partial<User>) => {
    set({ isLoading: true });
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        const typedKey = key as keyof User;

        if (data[typedKey] !== undefined && data[typedKey] !== null) {
          formData.append(key, data[typedKey]);
        }
      });

      const response = await $api.patch('/users/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      set({ user: response.data, isLoading: false });
      return { success: true };
    } catch (err) {
      let errorMessage = 'Failed to update profile';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      set({
        error: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
        isLoading: false,
      });
      return { success: false, error: errorMessage };
    }
  },
}));
