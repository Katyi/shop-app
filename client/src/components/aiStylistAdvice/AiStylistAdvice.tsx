import { useEffect, useState, useCallback } from 'react';
import { $api } from '../../api/interceptors';
import {
  AutoAwesome,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Refresh,
} from '@mui/icons-material';

interface Props {
  productId: string;
  lang: string;
}

const AiStylistAdvice = ({ productId, lang }: Props) => {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Функция запроса вынесена отдельно, чтобы вызывать её при разных условиях
  const fetchAdvice = useCallback(async () => {
    setLoading(true);
    try {
      const res = await $api.get(`/ai/stylist`, {
        params: { id: productId, lang },
      });
      setAdvice(res.data.text);
    } catch (err) {
      console.error('AI Error:', err);
      setAdvice(
        lang === 'ru' ? 'Ошибка загрузки совета.' : 'Failed to load advice.',
      );
    } finally {
      setLoading(false);
    }
  }, [productId, lang]);

  // Эффект 1: Если язык изменился, и блок открыт — обновляем текст автоматически
  useEffect(() => {
    if (isOpen) {
      fetchAdvice();
    }
  }, [lang, fetchAdvice]); // Следим за сменой языка

  const handleToggle = () => {
    // if (!isOpen) {
    //   // При каждом открытии запрашиваем новый совет
    //   fetchAdvice();
    // }
    setIsOpen(!isOpen);
  };

  return (
    <div className="my-4 border border-teal-100 rounded-lg overflow-hidden transition-all duration-300 shadow-sm">
      {/* Кнопка-триггер */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-teal-50/50 transition-colors disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2 text-teal-700">
          <AutoAwesome
            className={loading ? 'animate-spin' : ''}
            fontSize="small"
          />
          <span className="font-medium text-sm md:text-base uppercase tracking-wider">
            {loading
              ? lang === 'ru'
                ? 'Стилист думает...'
                : 'Stylist is thinking...'
              : lang === 'ru'
                ? 'Спросить стилиста'
                : 'Ask AI Stylist'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Если открыто, показываем иконку обновления */}
          {isOpen && !loading && (
            <Refresh
              fontSize="small"
              className="text-gray-400 hover:rotate-180 transition-transform duration-500"
              onClick={(e) => {
                e.stopPropagation();
                fetchAdvice();
              }}
            />
          )}
          {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </div>
      </button>

      {/* Разворачивающаяся область с анимацией */}
      {isOpen && (
        <div className="px-4 pb-4 bg-white animate-fadeIn">
          {loading ? (
            <div className="flex flex-col gap-2 pt-2">
              <div className="h-3 bg-teal-50 rounded w-full animate-pulse"></div>
              <div className="h-3 bg-teal-50 rounded w-5/6 animate-pulse"></div>
            </div>
          ) : (
            <div className="border-t border-teal-50 pt-3">
              <p className="text-gray-600 italic text-sm md:text-base leading-relaxed">
                «{advice}»
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiStylistAdvice;
