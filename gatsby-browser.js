import React from 'react';
import './src/styles/globals.css';

import { CartProvider } from './src/context/CartContext';
import { WishlistProvider } from './src/context/WishlistContext';

export const wrapRootElement = ({ element }) => (
  <CartProvider>
    <WishlistProvider>{element}</WishlistProvider>
  </CartProvider>
);
