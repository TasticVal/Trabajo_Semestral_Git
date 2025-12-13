// src/services/productService.js
import { apiFetch } from './api';

export const getProducts = () => {
  return apiFetch('/productos'); // GET por defecto
};

export const getProductById = (id) => {
  return apiFetch(`/productos/${id}`);
};