import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface BreadcrumbsProps {
  cat: string;
}

const Breadcrumbs = ({ cat }: BreadcrumbsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isAll = !cat || cat === 'all';
  const parts = isAll ? [] : cat.split(',');

  return (
    <nav className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.15em] text-gray-400 mb-4 px-5 py-2.5">
      <span
        className={`transition-colors ${
          isAll ? 'text-black font-medium' : 'hover:text-black cursor-pointer'
        }`}
        onClick={() => navigate('/products?category=all')}
      >
        {t('categories.all', 'All Products')}
      </span>

      {!isAll &&
        parts.map((part, index) => {
          const isLast = index === parts.length - 1;
          const linkCat = parts.slice(0, index + 1).join(',');

          return (
            <React.Fragment key={linkCat}>
              <span className="text-gray-300">/</span>
              <span
                className={`transition-colors ${
                  !isLast
                    ? 'cursor-pointer hover:text-black'
                    : 'text-black font-medium'
                }`}
                onClick={() =>
                  !isLast && navigate(`/products?category=${linkCat}`)
                }
              >
                {t(`categories.${part}`, { defaultValue: part })}
              </span>
            </React.Fragment>
          );
        })}
    </nav>
  );
};

export default Breadcrumbs;
