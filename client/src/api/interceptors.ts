import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// const API_URL = 'http://localhost:3000/api';

const BASE_URL =
  import.meta.env.VITE_BASE_URL + '/api' || 'http://localhost:3000';

// Экземпляр для защищенных запросов
export const $api = axios.create({
  baseURL: BASE_URL,
});

// 1. Добавляем токен в каждый запрос
$api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Обрабатываем ответы и 401 ошибку
$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRequest =
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/register') ||
      originalRequest.url.includes('/auth/refresh');

    // Проверяем: ошибка 401 и мы еще не пробовали повторить запрос
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error();

        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefresh } = response.data;

        // Сохраняем новые данные в стор
        useAuthStore.setState({
          token: accessToken,
          refreshToken: newRefresh,
        });

        // Повторяем изначальный запрос
        return $api(originalRequest);
      } catch (refreshError) {
        // Если рефреш не удался (например, он тоже протух)
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
