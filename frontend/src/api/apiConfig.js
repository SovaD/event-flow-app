/**
 * Универсальный определитель URL бэкенда.
 * Проверяет все возможные переменные окружения и Vite, и CRA.
 */
const getApiUrl = () => {
  // 1. Принудительный URL для продакшена (самый надежный способ)
  const productionUrl = "https://event-flow-app.onrender.com/api";

  // 2. Пытаемся достать из Vite (import.meta.env)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  }

  // 3. Пытаемся достать из Process (CRA или Node)
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
    if (process.env.API_URL) return process.env.API_URL;
  }

  // 4. Если мы на Vercel (production), возвращаем Render URL напрямую
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return productionUrl;
  }

  // 5. Локальный URL по умолчанию
  return "http://localhost:5000/api";
};

export const API_URL = getApiUrl();