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

const UnderlineSelect: React.FC<CustomSelectProps> = ({
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
    <div className="relative w-full" ref={selectRef}>
      {/* Кнопка в стиле input профиля */}
      <div
        onClick={() => setOpen(!open)}
        className={`
          flex items-center justify-between cursor-pointer
          border-b border-gray-200 py-1 transition-all
          ${open ? 'border-black' : 'hover:border-gray-400'}
        `}
      >
        <span className="text-sm text-black">{selected}</span>
        <img
          src={downArrow}
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          alt="arrow"
        />
      </div>

      {/* Выпадашка */}
      {open && (
        <div className="absolute left-0 top-full w-full bg-white border border-gray-100 shadow-lg z-[110] py-2 mt-1">
          {options.map((opt) => (
            <div
              key={opt.code}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnderlineSelect;
