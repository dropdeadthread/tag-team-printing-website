// ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "@reach/router";

// Helper to get correct image path
const getImageUrl = (product) => {
  if (!product) return "/placeholder.png";
  if (product.Style) {
    return `/images/Style/${product.Style}_fm.jpg`;
  }
  return "/placeholder.png";
};

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/get-products?slug=${slug}`)
      .then(res => res.json())
      .then(setProduct);
  }, [slug]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product.title}</h1>
      <img src={getImageUrl(product)} alt={product.title || product.Name} />
      <div dangerouslySetInnerHTML={{ __html: product.description }} />
      {/* Add more product details here */}
    </div>
  );
};

export default ProductDetail;