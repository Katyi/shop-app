import { useEffect, useState, useCallback } from 'react';
import Product from '../product/Product';
import { useProductStore } from '../../store/productStore';
import ProductSkeleton from '../UI/skeleton/ProductSkeleton';
import { useTranslation } from 'react-i18next';

interface Filters {
  color?: string;
  size?: string;
}

interface ProductsProps {
  cat?: string;
  filters?: Filters;
  sort?: string;
  search?: string;
}

const Products = ({ cat, filters, sort, search }: ProductsProps) => {
  const { t } = useTranslation();
  const { products, fetchAllProducts, isLoading, totalCount, clearProducts } =
    useProductStore();
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const loadProducts = useCallback(
    async (pageNum: number, shouldAppend: boolean) => {
      await fetchAllProducts(
        {
          category: cat,
          color: filters?.color,
          size: filters?.size,
          sort: sort || undefined,
          limit: ITEMS_PER_PAGE,
          page: pageNum,
          search: search,
        },
        shouldAppend,
      );
    },
    [cat, filters, sort, search, fetchAllProducts],
  );

  const handleLoadMore = () => {
    if (!isLoading && products.length < totalCount) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage, true);
    }
  };

  useEffect(() => {
    // setTimeout исправляет ошибку "Cannot update a component while rendering"
    const timer = setTimeout(() => {
      setPage(1);
      clearProducts();
      loadProducts(1, false);
    }, 0);

    return () => clearTimeout(timer);
  }, [loadProducts, clearProducts]);

  const progressPercentage = Math.min(
    (products.length / totalCount) * 100,
    100,
  );

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full pb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {/* Products */}
        {products?.map((item) => (
          <Product item={item} key={item.id} />
        ))}

        {/* Show skeletons  */}
        {isLoading &&
          Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <ProductSkeleton key={`skeleton-${index}`} />
          ))}
      </div>

      {/* If nothing is found and it doesn't load */}
      {!isLoading && products.length === 0 && (
        <div className="w-full text-center py-20 text-gray-500">
          {/* No products found. */}
          {t('products.noProductsFound')}
        </div>
      )}

      {/* Progress bar button */}
      {products.length > 0 && products.length < totalCount && (
        <button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="relative w-full max-w-[500px]  h-[55px] border border-[#e5e5e5] bg-white overflow-hidden transition-all duration-300 cursor-pointer group disabled:cursor-not-allowed mt-12 mb-20 hover:border-gray-400"
        >
          {/* Progress bar */}
          <div
            className="absolute left-0 top-0 h-full bg-black transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />

          {/* Text with inversion effect (mix-blend-difference) 
          This layer turns white when there is a black stripe underneath it */}
          <div className="absolute inset-0 z-10 flex items-center justify-center mix-blend-difference">
            <span className="text-white text-[11px] font-bold uppercase tracking-[0.2em]">
              {isLoading
                ? t('products.loading')
                : `${t('products.loadMoreButton')} (${
                    products.length
                  }/${totalCount})`}
            </span>
          </div>
        </button>
      )}
    </div>
  );
};

export default Products;
