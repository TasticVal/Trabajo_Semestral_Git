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
  // CORRECCIÓN: El backend espera un String simple en el body, no un objeto JSON
  // Además, quitamos 'Content-Type: application/json' si enviamos texto plano,
  // pero apiFetch lo pone por defecto. Lo mejor es enviar el string tal cual
  // y dejar que el backend lo maneje (ya limpiamos comillas en el controller).
  return apiFetch(`/pedidos/actualizar-estado/${id}`, {
    method: 'PUT',
    body: nuevoEstado // Enviamos el string directo: "DESPACHADO"
  });
};