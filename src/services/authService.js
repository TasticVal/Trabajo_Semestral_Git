// src/services/authService.js
import { apiFetch } from './api';

export const loginUser = (credentials) => {
  // credentials es un objeto: { usuario: 'admin', password: '123' }
  return apiFetch('/usuarios/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const registerUser = (userData) => {
  return apiFetch('/usuarios/registro', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};