import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    setUser({
      id: 'user-1',
      name: 'Umair Qadeer',
      email,
      avatar: null,
      homeCountry: 'Pakistan',
      passportCountry: 'Pakistan',
      defaultCurrency: 'PKR',
      travelStyle: 'adventure',
    });
    setIsLoading(false);
    return true;
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setUser({
      id: 'user-1',
      name,
      email,
      avatar: null,
      homeCountry: 'Pakistan',
      passportCountry: 'Pakistan',
      defaultCurrency: 'PKR',
      travelStyle: 'cultural',
    });
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
