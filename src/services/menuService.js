// src/services/menuService.js
import { apiFetch } from './api';

export const getMenu = () => {
  return apiFetch('/'); // Llama al endpoint raíz del MenuController
};