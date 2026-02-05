import { useEffect, useRef } from 'react';
import downArrow from '../../../assets/down-arrow.svg';

type Option = {
  value: string;
  code: string;
};

interface CustomSelectProps {
  options: Option[];
  selected: string;
  onChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  selected,
  onChange,
  open,
  setOpen,
}) => {
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

  return (
    /* Контейнер теперь использует grid для наложения */
    <div
      className="relative inline-grid items-center min-w-[120px] md:min-w-[150px]"
      ref={selectRef}
    >
      {/* 1. GHOST ELEMENT: Определяет физический размер (ширину и высоту) */}
      <div className="invisible flex items-center px-3 pr-10 whitespace-nowrap text-sm font-normal border-2 border-transparent h-[33px] md:h-[34px]">
        {/* Находим самую длинную строку среди опций и текущего значения */}
        {[selected, ...options.map((o) => o.value)].reduce((a, b) => {
          const strA = String(a || '');
          const strB = String(b || '');
          return strA.length > strB.length ? strA : strB;
        })}
      </div>

      {/* 2. REAL BUTTON: Накладывается сверху через absolute */}
      <div
        onClick={() => setOpen(!open)}
        className={`
          absolute inset-0 cursor-pointer flex items-center justify-between
          border border-teal-600 px-3 h-[33px] md:h-[34px] transition-all bg-white
          ${open ? 'border-teal-400' : 'hover:border-teal-700'}
        `}
      >
        <div className="text-sm font-normal text-black whitespace-nowrap">
          {selected}
        </div>
        <img
          src={downArrow}
          alt="arrow"
          className={`w-5 h-5 transition-transform duration-300 ml-2 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* 3. DROPDOWN */}
      <div
        className={`
          absolute left-0 top-full w-full bg-white border border-gray-300 shadow-xl 
          z-[100] transition-all duration-200
          ${
            open
              ? 'visible opacity-100 translate-y-0'
              : 'invisible opacity-0 -translate-y-2'
          }
        `}
      >
        <div className="py-1 max-h-60 overflow-y-auto">
          {options?.map((opt) => (
            <div
              className="px-4 py-1 hover:bg-teal-50 cursor-pointer text-sm text-gray-800 transition-colors"
              key={opt.code}
              onClick={() => onChange(opt.value)}
            >
              {opt.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomSelect;
