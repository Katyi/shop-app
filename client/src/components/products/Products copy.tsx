import { useEffect, useState, useCallback } from 'react';
import Product from '../product/Product';
import { useProductStore } from '../../store/productStore';
import ProductSkeleton from '../UI/skeleton/ProductSkeleton';

interface Filters {
  color?: string;
  size?: string;
}

interface ProductsProps {
  cat?: string;
  filters?: Filters;
  sort?: string;
}

const Products = ({ cat, filters, sort }: ProductsProps) => {
  const { products, fetchAllProducts, isLoading, totalCount, clearProducts } =
    useProductStore();
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // 1. Стабильная функция загрузки
  const loadProducts = useCallback(
    async (pageNum: number, shouldAppend: boolean) => {
      const sortMapping: Record<string, string> = {
        Newest: 'newest',
        Oldest: 'oldest',
        'Price (asc)': 'price_asc',
        'Price (desc)': 'price_desc',
      };

      await fetchAllProducts(
        {
          category: cat,
          color: filters?.color,
          size: filters?.size,
          sort: sort ? sortMapping[sort] : undefined,
          limit: ITEMS_PER_PAGE,
          page: pageNum,
        },
        shouldAppend
      );
    },
    [cat, filters, sort, fetchAllProducts]
  );

  // 2. Функция для кнопки "Show More"
  const handleLoadMore = () => {
    if (!isLoading && products.length < totalCount) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage, true);
    }
  };

  // 3. Эффект для первичной загрузки и сброса фильтров
  useEffect(() => {
    // setTimeout исправляет ошибку "Cannot update a component while rendering"
    const timer = setTimeout(() => {
      setPage(1);
      clearProducts();
      loadProducts(1, false);
    }, 0);

    return () => clearTimeout(timer);
  }, [loadProducts, clearProducts]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full pb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {/* 1. ПОКАЗЫВАЕМ ТОВАРЫ */}
        {products?.map((item) => (
          <Product item={item} key={item.id} />
        ))}

        {/* 2. ПОКАЗЫВАЕМ СКЕЛЕТОНЫ ПРИ ЗАГРУЗКЕ */}
        {isLoading &&
          Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <ProductSkeleton key={`skeleton-${index}`} />
          ))}
      </div>

      {/* 3. ЕСЛИ НИЧЕГО НЕ НАЙДЕНО (и не грузится) */}
      {!isLoading && products.length === 0 && (
        <div className="w-full text-center py-20 text-gray-500">
          No products found.
        </div>
      )}

      {/* Единая кнопка Show More для всех страниц */}
      {products.length < totalCount && !isLoading && (
        <button
          onClick={handleLoadMore}
          className="my-8 px-8 py-2 border border-black hover:bg-black hover:text-white transition-all cursor-pointer font-medium"
        >
          Show More
        </button>
      )}

      {/* Индикатор загрузки под кнопкой (если нужно) */}
      {isLoading && products.length > 0 && (
        <div className="my-4 animate-pulse text-gray-400">Loading more...</div>
      )}

      {/* Сообщение, когда всё загружено */}
      {!isLoading && products.length >= totalCount && products.length > 0 && (
        <p className="text-gray-400 text-sm italic my-8">
          You have seen all items
        </p>
      )}
    </div>
  );
};

export default Products;
