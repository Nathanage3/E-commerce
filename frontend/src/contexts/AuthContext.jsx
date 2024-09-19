import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
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
    localStorage.setItem('ecomUser', JSON.stringify(userData.user));
    localStorage.setItem('ecomUserAccess', JSON.stringify(userData.access));
    localStorage.setItem('ecomUserRefresh', JSON.stringify(userData.refresh));
    setIsAuthenticated(true);
  };

  const isLoggedIn = () => {
    const user = JSON.parse(localStorage.getItem('ecomUser'));
    return user !== null;
  };
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        connect,
        isLoggedIn,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
AuthContextProvider.propTypes = {
  children: PropTypes.node,
};
export { AuthContextProvider, AuthContext };
