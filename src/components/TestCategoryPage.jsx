import React, { useEffect, useState } from "react";

const TestCategoryPage = ({ categoryId, categoryName }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('TestCategoryPage - Category ID:', categoryId);
    
    if (!categoryId) {
      console.log('No category ID provided');
      setLoading(false);
      return;
    }

    fetch(`/api/list-products?category=${categoryId}`)
      .then(res => res.json())
      .then(data => {
        console.log('TestCategoryPage - Raw response:', data);
        console.log('TestCategoryPage - Is array:', Array.isArray(data));
        console.log('TestCategoryPage - Length:', data?.length);
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('TestCategoryPage - Error:', err);
        setLoading(false);
      });
  }, [categoryId]);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#fff', color: '#333' }}>
      <h1>Test Category Page: {categoryName}</h1>
      <div style={{ background: '#f0f0f0', padding: '1rem', margin: '1rem 0' }}>
        <p><strong>Debug Info:</strong></p>
        <p>Category ID: {categoryId}</p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Products array length: {products.length}</p>
        <p>Products is array: {Array.isArray(products) ? 'Yes' : 'No'}</p>
      </div>

      {loading && <p>Loading...</p>}
      
      {!loading && products.length === 0 && (
        <p>No products found</p>
      )}

      {!loading && products.length > 0 && (
        <div>
          <h2>Found {products.length} products:</h2>
          {products.slice(0, 3).map((product, index) => (
            <div key={index} style={{ 
              border: '1px solid #ccc', 
              padding: '1rem', 
              margin: '1rem 0',
              background: '#f9f9f9'
            }}>
              <h3>{product.title || product.name || 'No title'}</h3>
              <p>Brand: {product.brand || product.brandName || 'No brand'}</p>
              <p>Style ID: {product.styleID || 'No ID'}</p>
              <p>Style Name: {product.styleName || 'No style name'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestCategoryPage;
