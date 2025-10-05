// src/context/CartContext.js
import React, { createContext, useState } from "react";

// ✅ Named export for context
export const CartContext = createContext();

// ✅ Named export for provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Create unique key for each product variant (styleID + size + color)
      const productKey = `${product.StyleID || product.styleID}-${product.Size}-${product.Color}`;
      const existingItemIndex = prevItems.findIndex(item => {
        const itemKey = `${item.StyleID || item.styleID}-${item.Size}-${item.Color}`;
        return itemKey === productKey;
      });
      
      if (existingItemIndex !== -1) {
        // Item exists, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          Quantity: (updatedItems[existingItemIndex].Quantity || 1) + (product.Quantity || 1),
        };
        return updatedItems;
      }
      
      // New item
      return [...prevItems, { ...product, Quantity: product.Quantity || 1 }];
    });
  };

  const removeFromCart = (index) => {
    setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateCartItemQuantity = (index, newQuantity) => {
    setCartItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        Quantity: newQuantity,
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
