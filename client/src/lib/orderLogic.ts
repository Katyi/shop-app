import i18next from 'i18next';

export const SHIPPING_COST = 5.9;
const USD_TO_RUB_RATE = 90;

// Пороги для USD (English)
const THRESHOLD_FREE_USD = 100;
const THRESHOLD_HALF_USD = 50;

// Пороги для RUB (Russian)
const THRESHOLD_FREE_RUB = 10000;
const THRESHOLD_HALF_RUB = 5000;

/**
 * Получаем порог бесплатной доставки (всегда возвращаем в USD для расчетов)
 */
export const getFreeShippingThreshold = (): number => {
  const isRu = i18next.language === 'ru';
  return isRu ? THRESHOLD_FREE_RUB / USD_TO_RUB_RATE : THRESHOLD_FREE_USD;
};

/**
 * Получаем порог 50% скидки (всегда возвращаем в USD для расчетов)
 */
export const getHalfShippingThreshold = (): number => {
  const isRu = i18next.language === 'ru';
  return isRu ? THRESHOLD_HALF_RUB / USD_TO_RUB_RATE : THRESHOLD_HALF_USD;
};

/**
 * Расчет скидки
 */
export const getShippingDiscount = (subtotalInUsd: number): number => {
  if (subtotalInUsd >= getFreeShippingThreshold()) {
    return SHIPPING_COST;
  } else if (subtotalInUsd >= getHalfShippingThreshold()) {
    return SHIPPING_COST / 2;
  }
  return 0;
};

/**
 * Итоговая сумма
 */
export const calculateFinalTotal = (subtotalInUsd: number): number => {
  if (subtotalInUsd <= 0) {
    return 0;
  }

  const discount = getShippingDiscount(subtotalInUsd);
  return subtotalInUsd + SHIPPING_COST - discount;
};
