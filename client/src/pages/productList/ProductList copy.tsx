import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Products from '../../components/products/Products';
import Newsletter from '../../components/newsletter/Newsletter';
import Select from '../../components/UI/select/Select';
import { useCategories } from '../../constants/categories';
import { useTranslation } from 'react-i18next';
import { useColorOptions } from '../../constants/colors';
import { useSizeOptions } from '../../constants/size';
import { useProductStore } from '../../store/productStore';

interface Filters {
  color?: string;
  size?: string;
}

const SORT_KEYS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
};

const ProductList: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const cat = location.pathname.split('/')[2];
  const categories = useCategories();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search') || undefined;
  const { totalCount } = useProductStore();

  // Локальное состояние для фильтров и сортировки
  const [filters, setFilters] = useState<Filters>({});
  const [sort, setSort] = useState<string>(SORT_KEYS.NEWEST);
  const colorOptions = useColorOptions();
  const sizeOptions = useSizeOptions();

  // Состояния открытия выпадающих списков
  const [colorOpen, setColorOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const sortOptions = [
    { code: SORT_KEYS.NEWEST, value: t('productList.newest') },
    { code: SORT_KEYS.OLDEST, value: t('productList.oldest') },
    { code: SORT_KEYS.PRICE_ASC, value: t('productList.priceAsc') },
    { code: SORT_KEYS.PRICE_DESC, value: t('productList.priceDesc') },
  ];

  const handleColorChange = (selectedText: string) => {
    // Находим код по тексту
    const found = colorOptions.find((o) => o.value === selectedText);
    const code = found?.code;

    setFilters((prev) => ({
      ...prev,
      // Если код 'all', сбрасываем фильтр, иначе записываем технический код (например 'white')
      color: code === 'all' ? undefined : code,
    }));
    setColorOpen(false);
  };

  const handleSizeChange = (selectedText: string) => {
    const found = sizeOptions.find((o) => o.value === selectedText);
    const code = found?.code;

    setFilters((prev) => ({
      ...prev,
      size: code === 'all' ? undefined : code,
    }));
    setSizeOpen(false);
  };

  return (
    <div className="pageContainer flex-col">
      <div className="flex items-center gap-4 my-5 px-5">
        <h1 className="text-2xl md:text-3xl font-bold">
          {cat !== 'all'
            ? `${categories.filter((c) => cat === c.cat)[0].title}`
            : t('productList.allCat')}
        </h1>
        <button
          onClick={() => navigate('/home')}
          className="px-4 py-2 border border-black hover:bg-black hover:text-white uppercase transition-colors duration-300 ease-in-out text-sm font-medium cursor-pointer"
        >
          {/* To Home Page */}
          {t('productList.home')}
        </button>
      </div>

      {/* Контейнер фильтров */}
      <div className="flex flex-col md:flex-row justify-between px-5 gap-4">
        {/* Левый блок: Фильтры */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-semibold">
            {t('productList.filter')}:
          </span>
          <Select
            options={colorOptions}
            // selected={filters.color || t('productList.color')}
            selected={
              colorOptions.find((o) => o.code === filters.color)?.value ||
              t('productList.color')
            }
            onChange={handleColorChange}
            open={colorOpen}
            setOpen={setColorOpen}
          />
          <Select
            options={sizeOptions}
            // selected={filters.size || t('productList.size')}
            selected={
              sizeOptions.find((o) => o.code === filters.size)?.value ||
              t('productList.size')
            }
            onChange={handleSizeChange}
            open={sizeOpen}
            setOpen={setSizeOpen}
          />
        </div>

        {/* Правый блок: Сортировка */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">
            {t('productList.sort')}:
          </span>
          <Select
            options={sortOptions}
            selected={
              sortOptions.find((o) => o.code === sort)?.value ||
              t('productList.newest')
            }
            onChange={(val) => {
              const foundCode = sortOptions.find((o) => o.value === val)?.code;
              if (foundCode) setSort(foundCode);
              setSortOpen(false);
            }}
            open={sortOpen}
            setOpen={setSortOpen}
          />
        </div>
      </div>

      {/* Индикатор активного поиска и кнопка сброса */}
      {searchTerm && (
        <div className="px-5 my-5 flex items-center gap-2">
          <span className="text-gray-600 text-sm uppercase font-bold">
            {t('productList.resultsFor')}:{' '}
            <strong>
              "{searchTerm}" {totalCount} {t('productList.results')}
            </strong>
          </span>
          <button
            onClick={() => navigate(`/products/${cat}`)}
            className="text-xs cursor-pointer border text-white border-teal-700 bg-teal-700 hover:bg-teal-800 transition-all rounded-lg px-2 py-1"
          >
            {t('productList.clearSearch') || 'Сбросить поиск'}
          </button>
        </div>
      )}

      {/* Список товаров */}
      <div className="mt-8">
        <Products cat={cat} filters={filters} sort={sort} search={searchTerm} />
      </div>

      <Newsletter />
    </div>
  );
};

export default ProductList;
