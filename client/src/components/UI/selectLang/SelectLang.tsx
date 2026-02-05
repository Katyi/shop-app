import { useEffect, useMemo, useRef } from 'react';
import downArrow from '../../../assets/down-arrow.svg';
import { useTranslation } from 'react-i18next';

interface Option {
  code: string;
  label: string;
  [key: string]: string;
}

interface SelectLangProps {
  options: Option[];
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
}

const SelectLang: React.FC<SelectLangProps> = ({
  options,
  open,
  setOpen,
  className = '',
}) => {
  const { i18n } = useTranslation();
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mouseup', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mouseup', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setOpen]);

  // Find the longest string to fix the width
  const longestLabel = useMemo(
    () =>
      options.reduce(
        (a, b) => (a.label.length > b.label.length ? a : b),
        options[0]
      ).label,
    [options]
  );

  const currentLang =
    options.find((opt) => opt.code === i18n.language) || options[0];

  return (
    <div className={`relative inline-block ${className}`} ref={selectRef}>
      {/* Fixed-width container */}
      <div
        onClick={() => setOpen(!open)}
        className={`
          relative cursor-pointer flex items-center justify-between
          border border-[#e5e5e5] px-4 h-[30px] transition-all bg-white
          ${open ? 'border-black' : 'hover:border-gray-400'}
        `}
        /* style sets minimum width based on longest word + arrow padding */
        style={{ minWidth: `${longestLabel.length + 10}ch` }}
      >
        <div className="text-[12px] font-medium text-black uppercase tracking-widest whitespace-nowrap mr-4">
          {currentLang.label}
        </div>

        <img
          src={downArrow}
          alt="arrow"
          className={`h-3 w-3 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Dropdown */}
      <div
        className={`absolute left-0 right-0 top-full border border-[#e5e5e5] bg-white py-2 shadow-sm transition-all z-50 ${
          open
            ? 'visible opacity-100 translate-y-0'
            : 'invisible opacity-0 -translate-y-1'
        }`}
      >
        {options?.map((opt) => (
          <div
            className="flex px-4 py-2 cursor-pointer items-center hover:bg-gray-50 transition-colors"
            key={opt.code}
            onClick={() => {
              i18n.changeLanguage(opt.code);
              setOpen(false);
            }}
          >
            <div className="text-[12px] font-medium text-black uppercase tracking-widest">
              {opt.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectLang;
