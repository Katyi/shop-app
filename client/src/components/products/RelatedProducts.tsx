import { useEffect, useState } from 'react';
import { $api } from '../../api/interceptors';
import { useTranslation } from 'react-i18next';
import Product from '../product/Product';

const RelatedProducts = ({
  currentProductId,
}: {
  currentProductId: string;
}) => {
  const [related, setRelated] = useState<IProduct[]>([]);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        // Вызываем созданный нами эндпоинт на бэкенде
        const res = await $api.get(`/products/${currentProductId}/related`);
        setRelated(res.data);
      } catch (err) {
        console.error('Failed to fetch related products', err);
      }
    };

    if (currentProductId) fetchRelated();
  }, [currentProductId]);

  if (related.length === 0) return null;

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-light uppercase tracking-widest my-4">
        {i18n.language === 'ru'
          ? 'Вам также может понравиться'
          : 'You might also like'}
      </h2>

      <div className="w-full pb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {related.map((item) => {
          return <Product item={item} key={item.id} />;
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
