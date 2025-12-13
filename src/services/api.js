// src/services/api.js

// Cambia esto si tu backend corre en otro puerto
const API_URL = "http://localhost:3000"; 

export const apiFetch = async (endpoint, options = {}) => {
  // Configuración por defecto (headers, etc)
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // Si ya estamos logueados, enviamos el token automáticamente
    ...(localStorage.getItem('token') && { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  // Si el backend da error, lanzamos una alerta
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Error en la petición al servidor');
  }

  return response.json();
};