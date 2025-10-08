import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar si hay un token guardado al cargar la aplicación
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('AuthContext - Token from localStorage:', token);
      console.log('AuthContext - UserData from localStorage:', userData);
      
      if (token && userData) {
        try {
          const parsedData = JSON.parse(userData);
          console.log('AuthContext - Parsed data:', parsedData);
          
          // Si es una respuesta del backend con estructura {success, data, message}
          const user = parsedData.data || parsedData;
          console.log('AuthContext - Extracted user:', user);
          console.log('AuthContext - User role:', user.role);
          
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, token }
          });
        } catch (error) {
          console.error('AuthContext - Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({
            type: 'AUTH_FAILURE',
            payload: null
          });
        }
      } else {
        console.log('AuthContext - No token or user data found');
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authService.login(username, password);
      const { user, token } = response;
      
      // console.log('AuthContext - Login response:', response);
      // console.log('AuthContext - User from login:', user);
      // console.log('AuthContext - User role from login:', user.role);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });
      
      return { success: true };
    } catch (error) {
      console.error('AuthContext - Login error:', error);
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.message || 'Error al iniciar sesión'
      });
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authService.register(userData);
      const { user, token } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });
      
      return { success: true };
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.message || 'Error al registrar usuario'
      });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      if (state.token) {
        await authService.logout(state.token);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const hasRole = (requiredRole) => {
    if (!state.user) return false;
    const userRole = state.user.role?.toLowerCase();
    const checkRole = requiredRole.toLowerCase();
    // console.log('hasRole check:', { userRole, checkRole, match: userRole === checkRole });
    return userRole === checkRole;
  };

  const hasAnyRole = (roles) => {
    if (!state.user) return false;
    const userRole = state.user.role?.toLowerCase();
    const checkRoles = roles.map(role => role.toLowerCase());
    // console.log('hasAnyRole check:', { userRole, checkRoles, match: checkRoles.includes(userRole) });
    return checkRoles.includes(userRole);
  };

  const getRoles = async () => {
    try {
      if (!state.token) throw new Error('No token available');
      return await authService.getRoles(state.token);
    } catch (error) {
      throw new Error('Error al obtener roles');
    }
  };

  const updateProfile = async (userData) => {
    try {
      if (!state.token) throw new Error('No token available');
      const updateResponse = await authService.updateProfile(state.token, userData);
      
      // Extraer solo los datos del usuario de la respuesta
      const updatedUser = updateResponse.data || updateResponse;
      
      // Actualizar el usuario en el estado
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: updatedUser, token: state.token }
      });
      
      // Actualizar localStorage con solo los datos del usuario
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    hasRole,
    hasAnyRole,
    getRoles,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

