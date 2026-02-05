/**
 * Хелпер для получения перевода продукта на конкретном языке.
 * Если перевод на нужном языке не найден, возвращает первый доступный.
 */
export const getProductTranslation = (
  product: IProduct,
  lang: string = 'en'
): IProductTranslation | undefined => {
  if (
    !product.productTranslations ||
    product.productTranslations.length === 0
  ) {
    return undefined;
  }

  const translation = product.productTranslations.find(
    (t) => t.language === lang
  );

  // Возвращаем найденный перевод или самый первый из списка (fallback)
  return translation || product.productTranslations[0];
};
