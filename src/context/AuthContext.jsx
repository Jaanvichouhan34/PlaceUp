import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem('placeup_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
    setLoading(false);
  }, []);

  const signup = (userData) => {
    // In a real app, this would be an API call
    localStorage.setItem('placeup_user', JSON.stringify(userData));
    setUser(userData);
    return { success: true };
  };

  const login = (email, password) => {
    const savedUser = localStorage.getItem('placeup_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.email === email && parsedUser.password === password) {
        setUser(parsedUser);
        return { success: true };
      }
    }
    return { success: false, message: "Invalid email or password" };
  };

  const logout = () => {
    setUser(null);
    // Note: We might want to keep the account but just log out, 
    // but for this simple version, let's keep the user in localStorage 
    // and just clear the state, or provide a way to clear it.
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
