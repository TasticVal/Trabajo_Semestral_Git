// src/services/authService.js
import { apiFetch } from './api';

export const loginUser = (credentials) => {
  // credentials ahora es: { username: '...', password: '...' }
  return apiFetch('/usuarios/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const registerUser = (userData) => {
  // CAMBIO CRÍTICO: La ruta en Spring Boot es /registrar (verbo), no /registro (sustantivo)
  return apiFetch('/usuarios/registrar', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};