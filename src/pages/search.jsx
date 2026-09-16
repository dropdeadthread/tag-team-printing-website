import React, { useState } from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      // Fixed 2026-09-15: this used to call /.netlify/functions/search-products directly,
      // but the Gatsby adapter compiles src/api/*.js files under a different real name
      // (search-products-js) -- same routing bug already found and fixed for /api/get-order.
      // Going through /api/* uses the site's own _redirects rule that maps to the real
      // compiled function name, matching every other src/api/*.js caller on this site.
      const res = await fetch(
        `/api/search-products?q=${encodeURIComponent(query.trim())}`,
      );

      if (!res.ok) {
        throw new Error(`Search failed (${res.status})`);
      }

      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Something went wrong searching. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Search Products | Tag Team Printing Cornwall"
        description="Search our available wholesale apparel by brand, style, or keyword."
        url="/search"
      />

      <div className="search-page-wrapper">
        <div className="search-page-header">
          <h1 className="search-page-title">Search Products</h1>
          <p className="search-page-desc">
            Search by keyword, brand, or style name.
          </p>
        </div>

        <form className="search-page-form" onSubmit={handleSearch}>
          <input
            className="search-page-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by keyword, style, etc."
            aria-label="Search products"
          />
          <button
            className="search-page-button"
            type="submit"
            disabled={loading || !query.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <p className="search-page-error">{error}</p>}

        {!loading && !error && searched && results.length === 0 && (
          <p className="search-page-empty">
            No products found for &quot;{query}&quot;. Try a different brand or
            keyword.
          </p>
        )}

        <div className="search-product-grid">
          {results.map((product) => (
            <ProductCard key={product.styleID} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
