// src/context/CartContext.js - FIXED: Standardized cart data format + localStorage persistence
import React, { createContext, useState, useEffect } from 'react';

// ✅ Named export for context
export const CartContext = createContext();

// ✅ Named export for provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('tagteam_cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tagteam_cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Standardize product data format (normalize to lowercase field names)
      const standardizedProduct = {
        styleID: product.StyleID || product.styleID,
        styleName: product.styleName || product.StyleName,
        name: product.name || product.title || product.Title,
        price: parseFloat(product.price || product.Price || 0),
        quantity: parseInt(product.quantity || product.Quantity || 1),
        size: product.size || product.Size,
        color: product.color || product.Color,
        image: product.image || product.styleImage || product.Image,
        brand: product.brand || product.brandName || product.Brand,
      };

      // Create unique key for each product variant (styleID + size + color)
      const productKey = `${standardizedProduct.styleID}-${standardizedProduct.size}-${standardizedProduct.color}`;
      const existingItemIndex = prevItems.findIndex((item) => {
        const itemKey = `${item.styleID}-${item.size}-${item.color}`;
        return itemKey === productKey;
      });

      if (existingItemIndex !== -1) {
        // Item exists, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity:
            (updatedItems[existingItemIndex].quantity || 1) +
            standardizedProduct.quantity,
        };
        return updatedItems;
      }

      // New item with standardized format
      return [...prevItems, standardizedProduct];
    });
  };

  const removeFromCart = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateCartItemQuantity = (index, newQuantity) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: newQuantity, // Use lowercase field name
      };
      return updatedItems;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity, // ✅ Include in context value
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ❌ DO NOT default export CartProvider
// export default CartProvider;
