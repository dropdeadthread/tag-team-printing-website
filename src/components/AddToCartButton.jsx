// AddToCartButton.jsx
import React, { useContext } from "react";
import { NotificationContext } from "../context/AddItemNotificationProvider";
import { CartContext } from "../context/CartContext";

const AddToCartButton = ({ product }) => {
  const { cartItems, addToCart } = useContext(CartContext);
  const { showNotification } = useContext(NotificationContext);

  const handleAdd = () => {
    // Check if item is already in cart
    const exists = cartItems.some((item) => item.styleID === product.styleID);
    addToCart({ styleID: product.styleID, Quantity: 1 });
    showNotification(exists ? "Increased quantity!" : "Added to cart!");
  };

  return <button onClick={handleAdd}>Add to Cart</button>;
};

export default AddToCartButton;