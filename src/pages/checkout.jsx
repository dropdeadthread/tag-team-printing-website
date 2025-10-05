// src/pages/checkout.jsx
import React, { useEffect, useState, useContext } from "react";
import { loadSquareSdk } from "../utils/loadSquareSdk";
import { CartContext } from "../context/CartContext";
import "../styles/checkout.css";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const [card, setCard] = useState(null);
  const [status, setStatus] = useState("");
  const [fields, setFields] = useState({ name: "", email: "", address: "" });

  useEffect(() => {
    async function initializeSquare() {
      await loadSquareSdk();
      if (!window.Square) return;

      const paymentsInstance = window.Square.payments(
        process.env.GATSBY_SQUARE_APP_ID,
        process.env.GATSBY_SQUARE_LOCATION_ID
      );

      const cardInstance = await paymentsInstance.card();
      await cardInstance.attach("#card-container");
      setCard(cardInstance);
    }

    initializeSquare();
  }, []);

  const handleChange = e => setFields({ ...fields, [e.target.name]: e.target.value });

  const handlePayment = async e => {
    if (e) e.preventDefault();
    if (!card) return;

    try {
      setStatus("Processing...");
      const result = await card.tokenize();

      if (result.status === "OK") {
        const response = await fetch("/api/process-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: result.token }),
        });

        const paymentResult = await response.json();

        if (paymentResult.success) {
          // Create order in backend
          const orderResponse = await fetch("/api/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...fields,
              items: cartItems,
              paymentId: paymentResult.paymentId || null,
            }),
          });
          
          const orderData = await orderResponse.json();
          
          // Sync to Control Hub
          try {
            await fetch("/api/order-webhook", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "order.completed",
                data: {
                  id: orderData.orderId || `TTP-${Date.now()}`,
                  customer: {
                    name: fields.name,
                    email: fields.email,
                    phone: fields.phone || null
                  },
                  items: cartItems,
                  total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                  billingDetails: { ...fields },
                  paymentId: paymentResult.paymentId,
                  orderType: cartItems.some(item => item.customDesign) ? 'custom-design' : 'standard'
                }
              }),
            });
            console.log("✅ Order synced to Control Hub");
          } catch (hubError) {
            console.warn("⚠️ Control Hub sync failed (order still processed):", hubError);
          }
          
          clearCart();
          setStatus("Payment Successful! Redirecting...");
          setTimeout(() => {
            window.location.href = "/order-confirmed";
          }, 2000);
        } else {
          setStatus("Payment Failed: " + (paymentResult.message || "Unknown error"));
        }
      } else {
        setStatus("Card validation failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setStatus("Error during payment");
    }
  };

  return (
    <div className="checkout-container" style={{ fontFamily: "var(--font-luchita-rueda)" }}>
      <div className="checkout-box">
        <h1>Checkout</h1>
        <form onSubmit={handlePayment}>
          <input name="name" value={fields.name} onChange={handleChange} placeholder="Name" required />
          <input name="email" value={fields.email} onChange={handleChange} placeholder="Email" required />
          <input name="address" value={fields.address} onChange={handleChange} placeholder="Shipping Address" required />
          <div id="card-container"></div>
          <button className="checkout-button" type="submit">
            Pay Now
          </button>
        </form>
        {status && (
          <div
            className={`payment-status ${
              status.includes("Failed") || status.includes("Error") ? "error" : "success"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
