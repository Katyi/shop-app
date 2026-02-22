import { useTranslation } from 'react-i18next';

export const useCategories = () => {
  const { t } = useTranslation();

  return [
    { id: 'all', title: t('categories.all'), cat: 'all' },
    // --- WOMEN ---
    {
      id: 'women',
      title: t('categories.women'),
      cat: 'women',
      img: '/categories/women.jpeg',
    },
    // Используем один ключ "trousers"
    {
      id: 'women-trousers',
      title: t('categories.trousers'),
      cat: 'women,trousers',
    },
    { id: 'women-jeans', title: t('categories.jeans'), cat: 'women,jeans' },
    {
      id: 'women-knitwear',
      title: t('categories.knitwear'),
      cat: 'women,knitwear',
    },
    { id: 'women-coats', title: t('categories.coats'), cat: 'women,coats' },
    {
      id: 'women-blouses',
      title: t('categories.blouses'),
      cat: 'women,blouses',
    },
    {
      id: 'women-dresses',
      title: t('categories.dresses'),
      cat: 'women,dresses',
    },
    {
      id: 'women-t-shirts',
      title: t('categories.t-shirts'),
      cat: 'women,t-shirts',
    },
    { id: 'women-socks', title: t('categories.socks'), cat: 'women,socks' },
    { id: 'women-shoes', title: t('categories.shoes'), cat: 'women,shoes' },
    { id: 'women-bags', title: t('categories.bags'), cat: 'women,bags' },
    {
      id: 'women-jewellery',
      title: t('categories.jewellery'),
      cat: 'women,jewellery',
    },

    // --- MEN ---
    {
      id: 'men',
      title: t('categories.men'),
      cat: 'men',
      img: '/categories/men.jpeg',
    },
    {
      id: 'men-trousers',
      title: t('categories.trousers'),
      cat: 'men,trousers',
    },
    { id: 'men-jeans', title: t('categories.jeans'), cat: 'men,jeans' },
    {
      id: 'men-knitwear',
      title: t('categories.knitwear'),
      cat: 'men,knitwear',
    },
    { id: 'men-coats', title: t('categories.coats'), cat: 'men,coats' },
    { id: 'men-shirts', title: t('categories.shirts'), cat: 'men,shirts' },
    {
      id: 'men-t-shirts',
      title: t('categories.t-shirts'),
      cat: 'men,t-shirts',
    },
    { id: 'men-socks', title: t('categories.socks'), cat: 'men,socks' },
    { id: 'men-shoes', title: t('categories.shoes'), cat: 'men,shoes' },
    { id: 'men-bags', title: t('categories.bags'), cat: 'men,bags' },

    // --- ACCESSORIES ---
    {
      id: 'accessories',
      title: t('categories.accessories'),
      cat: 'accessories',
      img: '/categories/accessories.jpeg',
    },
    { id: 'acc-bags', title: t('categories.bags'), cat: 'accessories,bags' },
    {
      id: 'acc-jewellery',
      title: t('categories.jewellery'),
      cat: 'accessories,jewellery',
    },

    // --- OTHERS ---
    { id: 'new', title: t('categories.new'), cat: 'new' },
    { id: 'sale', title: t('categories.sale'), cat: 'sale' },
  ];
};
