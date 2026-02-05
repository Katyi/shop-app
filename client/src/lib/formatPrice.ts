import i18next from 'i18next';

/**
 * Константа курса валют (в реальном проекте можно получать с API)
 */
const USD_TO_RUB_RATE = 90;

/**
 * Форматирует цену в зависимости от текущего языка
 * @param priceInUsd - цена в базовой валюте (доллары)
 */
export const formatPrice = (priceInUsd: number) => {
  const currentLang = i18next.language; // Получаем текущий язык напрямую из i18next

  if (currentLang === 'ru') {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceInUsd * USD_TO_RUB_RATE);
  }

  // По умолчанию английский/доллары
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceInUsd);
};
