/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('ecomUser'));
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const connect = (userData) => {
    setUser(userData);
    localStorage.setItem('ecomUser', JSON.stringify(userData));
    setIsAuthenticated(true);
  };
  const logout = () => {
    localStorage.removeItem('ecomUser');
    setIsAuthenticated(false);
  };
  const isLoggedIn = () => {
    const user = JSON.parse(localStorage.getItem('ecomUser'));
    return user !== null;
  };

  return (
    <AuthContext.Provider
      value={{
        logout,
        user,
        isAuthenticated,

        connect,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};