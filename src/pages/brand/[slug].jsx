import React, { useEffect, useState } from "react";
import { useParams } from "@reach/router";
import ProductCard from "../../components/ProductCard";

const BrandPage = () => {
  const params = useParams();
  const slug = params?.slug;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    
    fetch(`/api/list-brands?brand=${slug}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching brand products:', error);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!slug) return <div>Brand not specified.</div>;
  if (!products.length) return <div>No products found for this brand.</div>;

  return (
    <div>
      <h1>Brand: {slug}</h1>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.styleID} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BrandPage;