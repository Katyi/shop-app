import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ru, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import './underlineDatePicker.css'; // Файл со стилями ниже

// Регистрируем локали один раз
registerLocale('ru', ru);
registerLocale('en', enUS);

interface Props {
  selected: string | undefined;
  onChange: (date: Date | null) => void;
  error?: boolean;
  placeholder?: string;
}

const UnderlineDatePicker = ({
  selected,
  onChange,
  error,
  placeholder,
}: Props) => {
  const { i18n } = useTranslation();

  return (
    <DatePicker
      selected={selected ? new Date(selected) : null}
      onChange={onChange}
      locale={i18n.language === 'ru' ? 'ru' : 'en'}
      dateFormat="dd.MM.yyyy"
      placeholderText={placeholder}
      // Передаем классы для соответствия твоему дизайну
      className={`w-full border-b outline-none pb-1 text-sm transition-colors bg-transparent ${
        error ? 'border-red-500' : 'border-gray-200 focus:border-black'
      }`}
      autoComplete="off"
    />
  );
};

export default UnderlineDatePicker;
