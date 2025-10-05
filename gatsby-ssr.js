import React from 'react';
import './src/styles/globals.css';


import { NotificationProvider } from './src/context/AddItemNotificationProvider';
import { CartProvider } from './src/context/CartContext';

export const wrapRootElement = ({ element }) => (
  <NotificationProvider>
    <CartProvider>
      {element}
    </CartProvider>
  </NotificationProvider>
);
