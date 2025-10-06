import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch from Netlify Function endpoint
    fetch('/.netlify/functions/list-products?category=21&limit=50')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Handle both old format (array) and new format (object with products array)
        const productList = Array.isArray(data) ? data : data.products || [];
        setProducts(productList);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading products:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="p-8 text-center">Loading products...</div>;
  if (error)
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  if (!products.length)
    return <div className="p-8 text-center">No products found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.styleID} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
