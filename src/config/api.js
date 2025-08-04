// src/config/api.js

/**
 * ARCHIVO PREPARADO PARA INTEGRACIÓN BACKEND
 * 
 * Este archivo está listo para cuando se implemente el backend.
 * Todos los componentes ya están configurados para usar este archivo.
 * 
 * TODO PARA EL DESARROLLADOR BACKEND:
 * - Configurar API_BASE_URL
 * - Implementar funciones de autenticación
 * - Agregar endpoints específicos
 */
// src/config/api.js

/**
 * Configuración base para las llamadas a la API
 */

// URL base del backend - CAMBIAR SEGÚN TU SERVIDOR
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Headers por defecto
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Función helper para hacer fetch con configuración base
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: getAuthHeaders(),
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Endpoints específicos para el admin
export const ADMIN_ENDPOINTS = {
  PROFILE: '/admin/profile',
  DASHBOARD_STATS: '/admin/dashboard/stats',
  NOTIFICATIONS: '/admin/notifications',
  STUDENTS: '/admin/students',
  PAYMENTS: '/admin/payments'
};
