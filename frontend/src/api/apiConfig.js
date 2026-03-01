
const getApiUrl = () => {
  const productionUrl = "https://event-flow-app.onrender.com/api";


  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  }

  if (typeof process !== 'undefined' && process.env) {
    if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
    if (process.env.API_URL) return process.env.API_URL;
  }

  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return productionUrl;
  }

  // Локальный URL по умолчанию
  return "http://localhost:5000/api";
};

export const API_URL = getApiUrl();