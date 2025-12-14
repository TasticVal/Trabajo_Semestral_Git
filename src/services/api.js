// src/services/api.js

const API_URL = "http://localhost:8080"; 

export const apiFetch = async (endpoint, options = {}) => {
  // Configuración por defecto (headers, etc)
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // Si ya estamos logueados, enviamos el token automáticamente
    ...(localStorage.getItem('token') && { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    });

    // Si el backend da error (ej: 401, 404, 500)
    if (!response.ok) {
      // Intentamos leer el mensaje de error del JSON si existe
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    // Si la respuesta es vacía (ej: 204 No Content), retornamos null para evitar error de JSON
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error en apiFetch:", error);
    throw error; // Re-lanzamos el error para que lo maneje el componente (LoginPage, etc.)
  }
};