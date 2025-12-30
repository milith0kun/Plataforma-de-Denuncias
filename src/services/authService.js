import api from './api.js';

const authService = {
  // Registro de ciudadano
  async registrarCiudadano(datos) {
    const response = await api.post('/auth/register/ciudadano', datos);
    
    if (response.data.success) {
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.data.usuario));
    }
    
    return response.data;
  },

  // Registro de autoridad
  async registrarAutoridad(datos) {
    const response = await api.post('/auth/register/autoridad', datos);
    
    if (response.data.success) {
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.data.usuario));
    }
    
    return response.data;
  },

  // Login
  async login(credenciales) {
    const response = await api.post('/auth/login', credenciales);
    
    if (response.data.success) {
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.data.usuario));
    }
    
    return response.data;
  },

  // Logout
  logout() {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
  },

  // Verificar token
  async verificarToken() {
    const response = await api.get('/auth/verify-token');
    return response.data;
  },

  // Obtener usuario actual del localStorage
  obtenerUsuarioActual() {
    const usuarioStr = localStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  },

  // Verificar si hay sesión activa
  estaAutenticado() {
    return !!localStorage.getItem('token');
  },

  // Solicitar recuperación de contraseña
  async solicitarRecuperacion(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Restablecer contraseña
  async restablecerPassword(token, nuevaPassword) {
    const response = await api.post('/auth/reset-password', { 
      token, 
      nuevaPassword 
    });
    return response.data;
  },

  // Obtener token del localStorage
  obtenerToken() {
    return localStorage.getItem('token');
  }
};

export default authService;
