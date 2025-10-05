import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/list-products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (!products.length) return <div>No products found.</div>;

  return (
    <div>
      <h1>All Products</h1>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.styleID} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;