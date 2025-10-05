import React, { useEffect, useState } from "react";
import { useParams, Link } from "@reach/router";

const StyleDetail = () => {
  const params = useParams();
  const slug = params?.slug;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    
    fetch("/api/get-products")
      .then(res => res.json())
      .then(data => {
        // Assuming each product has a styleSlug field
        const filtered = data.filter(p => p.styleSlug === slug);
        setProducts(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Loading style variants...</p>;
  if (!slug) return <p>Style not specified.</p>;
  if (!products.length) return <p>No variants found for this style.</p>;

  return (
    <div>
      <h1>Variants for {slug.replace(/-/g, " ")}</h1>
      <ul>
        {products.map(prod => (
          <li key={prod.id}>
            <Link to={`/products/${prod.slug}`}>{prod.name} {prod.colorName ? `(${prod.colorName})` : ""}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StyleDetail;