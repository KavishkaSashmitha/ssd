// CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      // Check if user is logged in before making API call
      const token = localStorage.getItem('userToken');
      if (!token) {
        setCartCount(0);
        return;
      }

      try {
        // Fetch cart count from the server
        const response = await axios.get(
          'http://localhost:8070/api/user/cart',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCartCount(response.data.length);
      } catch (error) {
        console.error('Error fetching cart count:', error);
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, []);

  const updateCartCount = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const response = await axios.get(
        'http://localhost:8070/api/user/cart',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartCount(response.data.length);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
