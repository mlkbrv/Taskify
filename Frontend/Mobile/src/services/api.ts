import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Создаем экземпляр axios с базовым URL
export const api = axios.create({
  baseURL: 'http://192.168.1.70:8000', // Ваш Django бэкенд
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Константы для API эндпоинтов
export const API_ENDPOINTS = {
  // Users
  REGISTER: '/users/register/',
  LOGIN: '/users/token/',
  REFRESH_TOKEN: '/users/token/refresh/',
  
  // Tasks
  ALL_TASKS: '/tasks/tasks/',
  MY_TASKS: '/tasks/tasks/my/',
  CREATED_TASKS: '/tasks/tasks/created/',
  COMPLETED_TASKS: '/tasks/tasks/completed/',
  TASK_DETAIL: (id: number) => `/tasks/tasks/${id}/`,
  TASK_COMPLETE: (id: number) => `/tasks/tasks/${id}/complete/`,
};

// Интерцептор для добавления токена к каждому запросу
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок и обновления токена
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (refreshToken) {
                  const response = await axios.post(`${api.defaults.baseURL}${API_ENDPOINTS.REFRESH_TOKEN}`, {
          refresh: refreshToken,
        });

          const { access } = response.data;
          await AsyncStorage.setItem('access_token', access);
          
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Здесь можно добавить логику для выхода пользователя
      }
    }

    return Promise.reject(error);
  }
);

export default api;
