import { useTranslation } from 'react-i18next';

const Announcement = () => {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-50 h-7 bg-teal-700 text-white flex items-center justify-center text-sm font-medium">
      {/* Super Deal! Free Shipping on Orders Over $50 */}
      {t('announcement.message')}
    </div>
  );
};

export default Announcement;
