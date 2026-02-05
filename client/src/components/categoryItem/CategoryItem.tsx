// import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// Типизация пропсов
interface CategoryItemProps {
  item: {
    id: string;
    img?: string;
    title: string;
    cat?: string; // категория для ссылки
  };
}

const CategoryItem = ({ item }: CategoryItemProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigate = () => {
    // Формируем правильный URL с query-параметром
    navigate(`/products?category=${item.cat || 'all'}`);
  };

  return (
    <div className="flex-1 h-[70vh] relative">
      {/* <Link to={`/products/${item.cat || ''}`}> */}
      {/* Изображение: занимает весь контейнер */}
      <img
        src={item.img}
        alt={item.title}
        className="w-full h-full object-cover"
      />

      {/* Инфо-блок: центрирован поверх картинки */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-white mb-5 text-lg sm:text-2xl md:text-lg lg:text-2xl font-bold">
          {item.title}
        </h1>
        <button
          // onClick={() => navigate(`/products/${item.cat || ''}`)}
          onClick={handleNavigate}
          // className="border-none p-2.5 bg-white text-gray-500 cursor-pointer font-semibold hover:bg-gray-100 transition-colors"
          className="px-5 py-2 text-xs md:text-sm bg-white text-black border-none cursor-pointer hover:bg-black hover:text-white transition-all duration-300 uppercase font-bold tracking-widest"
        >
          {/* SHOP NOW */}
          {t('categoryItem.shopNowButton')}
        </button>
      </div>
      {/* </Link> */}
    </div>
  );
};

export default CategoryItem;
