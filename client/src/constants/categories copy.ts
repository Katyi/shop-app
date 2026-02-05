import category_photo_1 from '../assets/categories/accessories.jpeg';
import category_photo_2 from '../assets/categories/women.jpeg';
import category_photo_3 from '../assets/categories/men.jpeg';
import { useTranslation } from 'react-i18next';

// Export a function that returns the categories array using the hook inside
export const useCategories = () => {
  const { t } = useTranslation();

  return [
    {
      id: 1,
      img: category_photo_1,
      title: t('categories.categoryTitle1'),
      cat: 'accessories',
    },
    {
      id: 2,
      img: category_photo_2,
      title: t('categories.categoryTitle2'),
      cat: 'women',
    },
    {
      id: 3,
      img: category_photo_3,
      title: t('categories.categoryTitle3'),
      cat: 'men',
    },
    {
      id: 4,
      img: '',
      title: t('categories.categoryTitle4'),
      cat: 'sale',
    },
  ];
};
