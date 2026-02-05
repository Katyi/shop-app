// Берем BASE_URL из твоих констант или окружения
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
const DEFAULT_IMAGE = '/uploads/default.png';

export const getImageUrl = (path: string | null | undefined): string => {
  // Если пути нет, возвращаем дефолтную картинку
  if (!path) return `${BASE_URL}${DEFAULT_IMAGE}`;

  // Если путь уже полный (начинается с http), возвращаем как есть
  if (path.startsWith('http')) return path;

  // В остальных случаях склеиваем BASE_URL и путь из базы
  return `${BASE_URL}${path}`;
};
