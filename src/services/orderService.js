// src/services/orderService.js
import { apiFetch } from './api';

// Obtener métodos de envío para el select
export const getShippingMethods = () => {
  return apiFetch('/envios');
};

// Crear la orden (Carrito)
export const createOrder = (orderData) => {
  return apiFetch('/pedidos/crear', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
};

// Obtener listado (Para el Admin)
export const getOrders = () => {
  return apiFetch('/pedidos');
};

// Actualizar estado (Para despachar)
export const updateOrderStatus = (id, nuevoEstado) => {
  return apiFetch(`/pedidos/actualizar-estado/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ estado: nuevoEstado })
  });
};