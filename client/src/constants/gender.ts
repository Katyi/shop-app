import { useTranslation } from 'react-i18next';

export const useGenderOptions = () => {
  const { t } = useTranslation();

  return [
    { code: 'male', value: t('genderOptions.male') },
    { code: 'female', value: t('genderOptions.female') },
  ];
};
