import { useState, useEffect } from 'react';

/**
 * Кастомный хук для получения значения с задержкой (debounce).
 * @param value Значение для отслеживания.
 * @param delay Задержка в миллисекундах.
 * @returns Значение после задержки.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Устанавливаем таймер, который обновит значение
    // после указанной задержки
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер при каждом изменении 'value' или 'delay',
    // или при размонтировании компонента.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}