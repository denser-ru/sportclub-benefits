// src/__mocks__/axios.ts
import { vi } from 'vitest';

// Создаем мок-объект, который будет имитировать инстанс, возвращаемый axios.create()
const mockedApiInstance = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

// Экспортируем мок, который имитирует сам модуль 'axios'
export default {
  // Самое главное: метод create() теперь всегда возвращает наш контролируемый мок-объект
  create: vi.fn(() => mockedApiInstance),
};