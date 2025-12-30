import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // En lugar de lanzar error, retornar valores por defecto si el contexto no está disponible
  // Esto permite que componentes se rendericen mientras el contexto se inicializa
  if (!context) {
    console.warn('useAuth: AuthContext no disponible, usando valores por defecto');
    return {
      usuario: null,
      cargando: true,
      error: null,
      estaAutenticado: false,
      esAdmin: false,
      esAutoridad: false,
      esCiudadano: false,
      registrarCiudadano: async () => {},
      registrarAutoridad: async () => {},
      login: async () => {},
      loginConGoogle: async () => {},
      logout: () => {},
      solicitarRecuperacion: async () => {},
      restablecerPassword: async () => {},
      limpiarError: () => {}
    };
  }
  
  return context;
};
