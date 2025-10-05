import React, { useState } from "react";
import ProductCard from "../components/ProductCard";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async e => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/search-products?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <div>
      <h1>Search Products</h1>
      <form onSubmit={handleSearch}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by keyword, style, etc."
        />
        <button type="submit">Search</button>
      </form>
      {loading && <div>Loading...</div>}
      <div className="product-grid">
        {results.map(product => (
          <ProductCard key={product.styleID} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;