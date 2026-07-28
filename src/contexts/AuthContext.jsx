import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || '/api';

const DEFAULT_USER = {
  id: 'usr-1',
  name: 'Umair',
  email: 'muhammadumair.coding@gmail.com',
  avatarUrl: null,
  homeCountry: 'Pakistan',
  passportCountry: 'Pakistan',
  defaultCurrency: 'USD',
  travelStyle: 'Luxury',
};

export function AuthProvider({ children }) {
  // Load initial user state from localStorage or default demo user
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved user profile:', e);
    }
    return DEFAULT_USER;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Sync user state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user_profile', JSON.stringify(user));
    }
  }, [user]);

  // Restore session from API if token exists
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(prev => ({
            ...prev,
            id: data._id || prev?.id || 'usr-1',
            name: data.name || prev?.name || 'Umair',
            email: data.email || prev?.email || 'muhammadumair.coding@gmail.com',
            avatarUrl: data.avatarUrl || localStorage.getItem('user_avatar') || prev?.avatarUrl || null,
            homeCountry: data.homeCountry || prev?.homeCountry || 'Pakistan',
            passportCountry: data.passportCountry || prev?.passportCountry || 'Pakistan',
            defaultCurrency: data.defaultCurrency || prev?.defaultCurrency || 'USD',
            travelStyle: data.travelStyle || prev?.travelStyle || 'Luxury',
          }));
        }
      } catch (error) {
        console.error('Failed to restore auth session from server:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      const newUser = {
        id: data._id,
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl || localStorage.getItem('user_avatar') || null,
        homeCountry: data.homeCountry,
        passportCountry: data.passportCountry,
        defaultCurrency: data.defaultCurrency,
        travelStyle: data.travelStyle,
      };
      setUser(newUser);
      localStorage.setItem('user_profile', JSON.stringify(newUser));
      return true;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      const newUser = {
        id: data._id,
        name: data.name,
        email: data.email,
        avatarUrl: null,
        homeCountry: data.homeCountry,
        passportCountry: data.passportCountry,
        defaultCurrency: data.defaultCurrency,
        travelStyle: data.travelStyle,
      };
      setUser(newUser);
      localStorage.setItem('user_profile', JSON.stringify(newUser));
      return true;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (credential) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Google login failed');
      }

      localStorage.setItem('token', data.token);
      const newUser = {
        id: data._id,
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl || null,
        homeCountry: data.homeCountry,
        passportCountry: data.passportCountry,
        defaultCurrency: data.defaultCurrency,
        travelStyle: data.travelStyle,
      };
      setUser(newUser);
      localStorage.setItem('user_profile', JSON.stringify(newUser));
      return true;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_profile');
    setUser(DEFAULT_USER);
  };

  const updateProfile = async (updates) => {
    if (updates.avatarUrl !== undefined) {
      if (updates.avatarUrl) localStorage.setItem('user_avatar', updates.avatarUrl);
      else localStorage.removeItem('user_avatar');
    }

    // Immediately update local React state & localStorage
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('user_profile', JSON.stringify(updated));
      return updated;
    });

    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) localStorage.setItem('token', data.token);
      }
    } catch (error) {
      console.error('Profile backend sync error:', error);
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, googleLogin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
