import React, { useState, useEffect } from "react";
import SizeChartModal from "./SizeChartModal";
import SwatchModal from "./SwatchModal";
import "../styles/productpage.css";

const ProductPageCardLayout = ({ product }) => {
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showSwatches, setShowSwatches] = useState(false);
  const [swatches, setSwatches] = useState([]);

  useEffect(() => {
    if (!product?.styleID) return;
    fetch(
      `https://api-ca.ssactivewear.com/v2/products/?styleid=${product.styleID}`
    )
      .then((res) => res.json())
      .then((products) => {
        const swatchMap = {};
        products.forEach((prod) => {
          if (!swatchMap[prod.colorCode]) {
            swatchMap[prod.colorCode] = {
              name: prod.colorName,
              hex: prod.color1,
              swatchImg: prod.colorSwatchImage
                ? `https://www.ssactivewear.com/${prod.colorSwatchImage.replace(
                    "_fm",
                    "_fs"
                  )}`
                : null,
            };
          }
        });
        setSwatches(Object.values(swatchMap));
      });
  }, [product?.styleID]);

  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-page-background">
      {/* Front of the card */}
      <div className="card-front">
        <img
          src={`/images/Style/${product.Style || product.styleID}_fm.jpg`}
          alt={product.name || product.Name}
          className="product-image"
        />
        <div className="card-info">
          <h2 className="product-title">{product.name || product.Name}</h2>
          <p className="product-price">
            ${product.retailPrice || product.Price}
          </p>
          <p className="product-brand">{product.brand || product.Brand}</p>
          <p className="product-description">{product.description}</p>
        </div>
        {/* Add your decorative elements here */}
        <div className="wrestling-card-top-rope">
          <div className="ropes">
            <div className="rope red"></div>
            <div className="rope white"></div>
            <div className="rope blue"></div>
          </div>
        </div>
      </div>

      {/* Back of the card */}
      <div className="card-back">
        <h1 className="product-name">{product.name || product.Name}</h1>
        <p className="product-price">${product.retailPrice || product.Price}</p>

        <button className="card-button" onClick={() => setShowSizeChart(true)}>
          View Size Chart
        </button>
        <button className="card-button" onClick={() => setShowSwatches(true)}>
          Color Swatches
        </button>

        <div className="print-toggle">
          <label>
            <input type="checkbox" />
            Get It Printed by Tag Team 🖨️
          </label>
        </div>

        <div className="add-to-cart-section">
          <label>
            Size:
            <select>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </label>

          <button className="add-to-cart-button">Add to Cart</button>
        </div>
      </div>

      {/* Modals */}
      <SizeChartModal
        isOpen={showSizeChart}
        onClose={() => setShowSizeChart(false)}
        styleNumber={product.styleNumber || product.styleID}
      />
      <SwatchModal
        isOpen={showSwatches}
        onClose={() => setShowSwatches(false)}
        swatches={swatches}
      />
    </div>
  );
};

export default ProductPageCardLayout;
