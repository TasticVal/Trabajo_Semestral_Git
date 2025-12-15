import { apiFetch } from './api';

// Obtener todos los productos
export const getProducts = () => {
  return apiFetch('/productos'); 
};

// Obtener un producto por ID
export const getProductById = (id) => {
  return apiFetch(`/productos/obetener/${id}`); 
};

// --- NUEVAS FUNCIONES CRUD ---

// Crear producto
export const createProduct = (productData) => {
  return apiFetch('/productos/crear', {
    method: 'POST',
    body: JSON.stringify(productData)
  });
};

// Actualizar producto
export const updateProduct = (id, productData) => {
  return apiFetch(`/productos/actualizar/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  });
};

// Eliminar producto
export const deleteProduct = (id) => {
  return apiFetch(`/productos/eliminar/${id}`, {
    method: 'DELETE'
  });
};