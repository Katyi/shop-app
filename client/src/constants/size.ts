import { useTranslation } from 'react-i18next';

export const useSizeOptions = () => {
  const { t } = useTranslation();

  return [
    { code: 'all', value: t('sizeOptions.all') },
    { code: 'one size', value: t('sizeOptions.oneSize') },
    { code: 'xs', value: 'XS' },
    { code: 's', value: 'S' },
    { code: 'm', value: 'M' },
    { code: 'l', value: 'L' },
    { code: 'xl', value: 'XL' },
    { code: '23', value: '23' },
    { code: '24', value: '24' },
    { code: '25', value: '25' },
    { code: '26', value: '26' },
    { code: '27', value: '27' },
    { code: '28', value: '28' },
    { code: '29', value: '29' },
    { code: '30', value: '30' },
    { code: '31', value: '31' },
    { code: '32', value: '32' },
    { code: '36', value: '36' },
    { code: '37', value: '37' },
    { code: '38', value: '38' },
    { code: '39', value: '39' },
    { code: '40', value: '40' },
    { code: '41', value: '41' },
    { code: '42', value: '42' },
    { code: '43', value: '43' },
    { code: '44', value: '44' },
    { code: '45', value: '45' },
  ];
};
