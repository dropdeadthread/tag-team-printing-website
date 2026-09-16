import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';

// Fixed 2026-09-16: this page loaded real product data correctly (it calls a genuine,
// separately-hand-written Netlify function at /.netlify/functions/list-products -- not
// affected by the routing bug found on /search and /api/get-order), but rendered with no
// Layout wrapper (no header/nav/footer/title) and Tailwind utility classNames that do
// nothing on this site (no tailwind.config.js exists here) -- so it always looked like a
// bare, unstyled page despite working correctly underneath.
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/.netlify/functions/list-products?category=21&limit=50')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
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

  return (
    <Layout>
      <SEO
        title="All Products | Tag Team Printing Cornwall"
        description="Browse all available wholesale apparel at Tag Team Printing — available for custom screen printing and DTF."
        url="/products"
      />
      <div className="search-page-wrapper">
        <div className="search-page-header">
          <h1 className="search-page-title">All Products</h1>
        </div>

        {loading && <p className="search-page-empty">Loading products...</p>}
        {error && <p className="search-page-error">Error: {error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="search-page-empty">No products found.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="search-product-grid">
            {products.map((product) => (
              <ProductCard key={product.styleID} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductsPage;
