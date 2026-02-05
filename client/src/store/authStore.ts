import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { $api } from '../api/interceptors';
import { useUserStore } from './userStore'; // Импортируем второй стор

interface AuthState {
  // user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, pass: string) => Promise<void>;
  register: (username: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  // fetchMe: () => Promise<void>;
  resetError: () => void;
  // updateUser: (
  //   data: Partial<User>,
  //   // data: FormData,
  // ) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      resetError: () => set({ error: null }),

      // fetchMe: async () => {
      //   try {
      //     const response = await $api.get('/users/me');
      //     set({ user: response.data });
      //   } catch {
      //     console.error('Ошибка получения профиля');
      //     get().logout();
      //   }
      // },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await $api.post('/auth/login', { email, password });
          const { accessToken, refreshToken } = response.data;

          set({
            token: accessToken,
            refreshToken: refreshToken,
          });

          // await get().fetchMe();
          await useUserStore.getState().fetchMe();
          set({ isLoading: false });
        } catch (err) {
          let errorMessage = 'Something went wrong';
          if (axios.isAxiosError(err) && err.response?.data?.message) {
            errorMessage = err.response.data.message;
          }
          const finalMessage = Array.isArray(errorMessage)
            ? errorMessage[0]
            : errorMessage;
          console.log(finalMessage);
          set({
            error: finalMessage,
            isLoading: false,
          });
        }
      },

      register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await $api.post('/auth/register', {
            username,
            email,
            password,
          });

          const { user, accessToken, refreshToken } = response.data;

          set({
            // user: user,
            token: accessToken,
            refreshToken: refreshToken,
            // isLoading: false,
          });
          useUserStore.getState().setUser(user); // Сохраняем юзера сразу
          set({ isLoading: false });
        } catch (err) {
          set({
            error:
              (axios.isAxiosError(err) && err.response?.data?.message) ||
              'Something went wrong',
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({ token: null, refreshToken: null, error: null });
        useUserStore.getState().setUser(null); // Очищаем данные юзера
        localStorage.removeItem('auth-storage');
        window.location.href = '/';
      },

      // updateUser: async (data: Partial<User>) => {
      //   set({ isLoading: true });
      //   try {
      //     const formData = new FormData();

      //     // Добавляем все текстовые поля и файл в FormData
      //     Object.keys(data).forEach((key) => {
      //       const typedKey = key as keyof User;
      //       const value = data[typedKey];

      //       if (value !== undefined && value !== null) {
      //         formData.append(key, value);
      //       }
      //     });

      //     const response = await $api.patch('/users/update', formData, {
      //       headers: { 'Content-Type': 'multipart/form-data' },
      //     });

      //     set({ user: response.data, isLoading: false });
      //     return { success: true };
      //   } catch (err) {
      //     let errorMessage = 'Failed to update profile';
      //     if (axios.isAxiosError(err) && err.response?.data?.message) {
      //       errorMessage = err.response.data.message;
      //     }
      //     set({
      //       error: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
      //       isLoading: false,
      //     });
      //     return { success: false, error: errorMessage };
      //   }
      // },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
