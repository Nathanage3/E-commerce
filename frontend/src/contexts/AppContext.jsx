/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [wishItems, setWishItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem('ecomCart');
    const storedWish = localStorage.getItem('ecomWish');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    if (storedWish) {
      setWishItems(JSON.parse(storedWish));
    }
  }, [user]);

  function toggleCart() {
    setShowCart(!showCart);
  }
  function handleOpenNavbar() {
    setShowNav(true);
  }
  function handleCloseNavbar() {
    setShowNav(false);
  }

  const addToCart = (product) => {
    const existsInCart = cartItems.find((item) => item.id === product.id);
    if (existsInCart) {
      return;
    } else {
      const updatedCart = [...cartItems, { ...product }];
      localStorage.setItem('ecomCart', JSON.stringify(updatedCart));

      setCartItems(updatedCart);
    }
  };
  const addToWish = (product) => {
    const existsInWish = wishItems.find((item) => item.id === product.id);
    if (existsInWish) {
      return;
    } else {
      const updatedWish = [...wishItems, { ...product }];
      localStorage.setItem('ecomWish', JSON.stringify(updatedWish));

      setWishItems(updatedWish);
    }
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    localStorage.setItem('ecomCart', JSON.stringify(updatedCart));

    setCartItems(updatedCart);
  };
  const removeFromWish = (itemId) => {
    const updatedWish = wishItems.filter((item) => item.id !== itemId);
    localStorage.setItem('ecomWish', JSON.stringify(updatedWish));

    setWishItems(updatedWish);
  };
  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('ecomCart');
  };

  return (
    <AppContext.Provider
      value={{
        handleClearCart,
        showCart,
        toggleCart,
        handleCloseNavbar,
        handleOpenNavbar,
        showNav,
        cartItems,
        addToCart,
        removeFromCart,
        addToWish,
        removeFromWish,
        wishItems,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider, AppContext };
