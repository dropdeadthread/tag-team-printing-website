// ProductList.jsx
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch("/api/list-products.js")
      .then(res => res.json())
      .then(setProducts);
  }, []);
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.styleID} product={product} />
      ))}
    </div>
  );
};

export default ProductList;