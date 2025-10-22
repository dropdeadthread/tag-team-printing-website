// src/pages/SavedItems.jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";

const SavedItems = () => {
  const [savedProducts, setSavedProducts] = useState([]);

  useEffect(() => {
    // SSR guard: only access localStorage in browser
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("savedItems");
      if (saved) {
        setSavedProducts(JSON.parse(saved));
      }
    }
  }, []);

  const handleRemove = (productId) => {
    const updatedItems = savedProducts.filter((item) => item.id !== productId);
    setSavedProducts(updatedItems);
    // SSR guard: only access localStorage in browser
    if (typeof window !== 'undefined') {
      localStorage.setItem("savedItems", JSON.stringify(updatedItems));
    }
  };

  return (
    <Layout>
      <div
        style={{
          padding: "2rem",
          fontFamily: "var(--font-tecnica)",
          textAlign: "center",
        }}
      >
        <h1>Saved Items</h1>

        {savedProducts.length === 0 ? (
          <p style={{ marginTop: "2rem" }}>
            No items saved yet. Go haunt the shop!
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
              marginTop: "2rem",
              maxWidth: "1000px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {savedProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "#fff5d1",
                  border: "3px solid black",
                  padding: "1rem",
                  textAlign: "center",
                  boxShadow: "5px 5px 0px black",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "auto",
                    marginBottom: "1rem",
                    border: "2px solid black",
                  }}
                />
                <h3 style={{ marginBottom: "0.5rem" }}>{product.name}</h3>
                <p style={{ marginBottom: "1rem" }}>{product.price}</p>
                <button
                  onClick={() => handleRemove(product.id)}
                  style={{
                    backgroundColor: "#ff5050",
                    color: "black",
                    border: "2px solid black",
                    padding: "0.5rem 1rem",
                    fontFamily: "var(--font-rueda)",
                    cursor: "pointer",
                    boxShadow: "3px 3px 0px black",
                    transition: "all 0.2s ease",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SavedItems;
