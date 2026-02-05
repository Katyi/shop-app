import { useTranslation } from 'react-i18next';

export const useColorOptions = () => {
  const { t } = useTranslation();

  return [
    { code: 'all', value: t('colorOptions.all') },
    { code: 'white', value: t('colorOptions.white') },
    { code: 'black', value: t('colorOptions.black') },
    { code: 'red', value: t('colorOptions.red') },
    { code: 'blue', value: t('colorOptions.blue') },
    { code: 'yellow', value: t('colorOptions.yellow') },
    { code: 'green', value: t('colorOptions.green') },
    { code: 'olive', value: t('colorOptions.olive') },
    { code: 'pink', value: t('colorOptions.pink') },
    { code: 'beige', value: t('colorOptions.beige') },
    { code: 'brown', value: t('colorOptions.brown') },
    { code: 'navy', value: t('colorOptions.navy') },
    { code: 'orange', value: t('colorOptions.orange') },
    { code: 'gray', value: t('colorOptions.gray') },
    { code: 'gold', value: t('colorOptions.gold') },
    { code: 'silver', value: t('colorOptions.silver') },
    { code: 'khaki', value: t('colorOptions.khaki') },
    { code: 'indigo', value: t('colorOptions.indigo') },
  ];
};
