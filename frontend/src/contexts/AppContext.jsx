/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, [user]);

  function toggleCart() {
    setShowCart(!showCart);
  }
  function handleCloseCart() {
    setShowCart(false);
  }

  const addToCart = (product) => {
    const existsInCart = cartItems.find((item) => item.id === product.id);
    if (existsInCart) {
      return;
    } else {
      const updatedCart = [...cartItems, { ...product}];
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      setCartItems(updatedCart);
    }
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    setCartItems(updatedCart);
  };
  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <AppContext.Provider
      value={{
        handleClearCart,
        showCart,
        toggleCart,
        handleCloseCart,
        cartItems,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider, AppContext };
