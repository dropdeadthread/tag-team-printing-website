// ProductList.jsx
import { useEffect, useState } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('/.netlify/functions/list-products')
      .then((res) => res.json())
      .then((data) => {
        // Handle both array format (legacy) and object format (Netlify function)
        const productsArray = Array.isArray(data) ? data : data.products || [];
        setProducts(productsArray);
      });
  }, []);
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.styleID} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
