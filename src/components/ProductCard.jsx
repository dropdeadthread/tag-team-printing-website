// src/components/ProductCard.jsx - Fixed with Netlify proxy

import React from 'react';
import { Link } from 'gatsby';
import '../styles/productcard.css';

// Slugify function
const slugify = (str) =>
  str
    ? str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    : '';

// Helper to get correct image path using Netlify proxy
const getImageUrl = (product) => {
  // Use Netlify proxy to avoid CORS issues with S&S images

  // Try styleID first
  if (product.styleID) {
    return `/ss-images/Images/Style/${product.styleID}_fm.jpg`;
  }

  // Try Style field
  if (product.Style) {
    return `/ss-images/Images/Style/${product.Style}_fm.jpg`;
  }

  // Try styleImage field
  if (product.styleImage) {
    // If it's a relative path
    if (product.styleImage.includes('Images/Style/')) {
      return `/ss-images/${product.styleImage}`;
    }
  }

  // Fallback to placeholder
  return '/images/placeholder.png';
};

const ProductCard = ({ product }) => {
  const [imgError, setImgError] = React.useState(false);
  const image = imgError ? '/images/placeholder.png' : getImageUrl(product);
  const name =
    product.Name ||
    product.title ||
    product.name ||
    product.styleName ||
    'Product';
  const brand = product.Brand || product.brand || product.brandName || '';
  const slug = slugify(name);
  const productId = product.Style || product.styleID || product.styleCode;

  const handleImageError = (e) => {
    console.log('Image failed to load:', image);
    setImgError(true);
  };

  return (
    <Link to={`/products/${productId}`} className="wrestling-card-link">
      <div className="wrestling-card">
        <div className="product-image-wrapper">
          <img
            src={image}
            alt={name}
            className="product-image"
            onError={handleImageError}
            loading="lazy"
          />
        </div>
        <div className="card-info">
          <h3 className="product-title">{name}</h3>
          {brand && (
            <p className="product-brand text-sm text-gray-600">{brand}</p>
          )}
          {product.Price && (
            <p className="product-price">${product.Price.toFixed(2)}</p>
          )}
        </div>
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
