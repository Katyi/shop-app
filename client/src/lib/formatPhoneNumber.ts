export const formatPhoneNumber = (value: string) => {
  // Убираем всё, кроме цифр
  const digits = value.replace(/\D/g, '');

  // Ограничиваем длину 11 цифрами
  const trimmed = digits.slice(0, 11);

  if (trimmed.length === 0) return '';

  let formatted = `+${trimmed[0]}`; // Код страны (+X)

  if (trimmed.length > 1) {
    formatted += ` ${trimmed.slice(1, 4)}`; // Код города ( XXX)
  }
  if (trimmed.length > 4) {
    formatted += ` ${trimmed.slice(4, 7)}`; // Первая часть ( XXX)
  }
  if (trimmed.length > 7) {
    formatted += `-${trimmed.slice(7, 9)}`; // Хвост 1 (-XX)
  }
  if (trimmed.length > 9) {
    formatted += `-${trimmed.slice(9, 11)}`; // Хвост 2 (-XX)
  }

  return formatted;
};
