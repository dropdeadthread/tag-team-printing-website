import React from 'react';
import './src/styles/globals.css';

import { CartProvider } from './src/context/CartContext';

export const wrapRootElement = ({ element }) => (
  <CartProvider>{element}</CartProvider>
);
