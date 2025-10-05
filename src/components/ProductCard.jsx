// src/components/ProductCard.jsx

import React from "react";
import { Link } from "gatsby";
import "../styles/productcard.css";

// Slugify function
const slugify = str =>
  str
    ? str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    : "";

// Helper to get correct image path from S&S ActiveWear CDN
const getImageUrl = (product) => {
  // Use S&S ActiveWear CDN for images
  if (product.styleID) {
    return `https://images.ssactivewear.com/Images/Style/${product.styleID}_fm.jpg`;
  }
  if (product.Style) {
    return `https://images.ssactivewear.com/Images/Style/${product.Style}_fm.jpg`;
  }
  if (product.styleImage) {
    return `https://images.ssactivewear.com/${product.styleImage}`;
  }
  return "/images/placeholder.png";
};

const getBrandLogoUrl = (brand) =>
  brand ? `/images/Brand/${brand}_fm.jpg` : null;

const ProductCard = ({ product }) => {
  const image = getImageUrl(product);
  const brandLogo = getBrandLogoUrl(product.Brand);
  const name = product.Name || product.title || product.styleName || "Product";
  const slug = slugify(name);
  return (
    <Link to={`/products/${product.Style || product.styleID}/${slug}`} className="wrestling-card-link">
      <div className="wrestling-card">
        <img 
          src={image} 
          alt={name} 
          className="product-image"
          onError={(e) => {
            console.log('Product image failed to load:', image);
            e.target.src = '/images/placeholder.png';
          }}
        />
        {brandLogo && (
          <img
            src={brandLogo}
            alt={product.Brand}
            className="brand-logo"
            style={{ width: 40, height: 40, objectFit: "contain", position: "absolute", top: 8, right: 8, background: "#fff", borderRadius: 4 }}
            onError={e => { e.target.onerror = null; e.target.src = `/images/Brand/${product.Brand}_fm.jpg`; }}
          />
        )}
        <div className="card-info">
          <h3 className="product-title">{name}</h3>
          <p className="product-price">${product.Price?.toFixed(2) || "0.00"}</p>
        </div>
        {product.TopRope && (
          <div className="wrestling-card-top-rope">{product.TopRope}</div>
        )}
        <div className="ropes">
          <div className="rope red" />
          <div className="rope white" />
          <div className="rope blue" />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
