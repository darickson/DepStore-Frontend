import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('depCurrentUser');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error leyendo usuario desde localStorage', err);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('depCurrentUser', JSON.stringify(userData));
      // Duplicate small compatibility keys used across the app
      if (userData.nombre) localStorage.setItem('userNombre', userData.nombre);
      if (userData.email) localStorage.setItem('userEmail', userData.email);
      if (userData.telefono) localStorage.setItem('userPhone', userData.telefono || userData.phone || '');
      if (userData.address) localStorage.setItem('userAddress', userData.address || '');
      if (userData.id) localStorage.setItem('userId', userData.id);
      if (userData.rol) localStorage.setItem('userRol', userData.rol);
      localStorage.setItem('isLoggedIn', 'true');
    } catch (err) {
      console.error('Error guardando usuario en localStorage', err);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('depCurrentUser');
      localStorage.removeItem('userNombre');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPhone');
      localStorage.removeItem('userAddress');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRol');
      localStorage.removeItem('isLoggedIn');
    } catch (err) {
      console.error('Error removiendo usuario de localStorage', err);
    }
  };

  const isAdmin = !!(user && (user.rol === 'admin' || user.role === 'admin'));

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
