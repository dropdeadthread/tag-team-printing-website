import React, { useEffect, useState } from 'react';
import { useParams } from '@reach/router';
import Layout from '../../../components/Layout';

const ProductPage = () => {
  const params = useParams();
  const styleID = params?.styleID;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to get proper product image URL - Dynamic proxy/direct URLs
  const getProductImageUrl = (product, colorName = null) => {
    if (!product?.styleID) return '/images/placeholder.png';

    // If a color is specified, try to get color-specific image
    if (colorName) {
      const colorCode = colorName.toLowerCase().replace(/\s+/g, '');
      const imagePath = `Images/Style/${product.styleID}_${colorCode}_fm.jpg`;
      if (
        typeof window !== 'undefined' &&
        window.location.hostname === 'localhost'
      ) {
        return `https://images.ssactivewear.com/${imagePath}`;
      } else {
        return `/ss-images/${imagePath}`;
      }
    }

    // Default product image from API response
    if (product.styleImage) {
      if (
        typeof window !== 'undefined' &&
        window.location.hostname === 'localhost'
      ) {
        return `https://images.ssactivewear.com/${product.styleImage}`;
      } else {
        return `/ss-images/${product.styleImage}`;
      }
    }

    // Fallback to constructed URL
    const imagePath = `Images/Style/${product.styleID}_fm.jpg`;
    if (
      typeof window !== 'undefined' &&
      window.location.hostname === 'localhost'
    ) {
      return `https://images.ssactivewear.com/${imagePath}`;
    } else {
      return `/ss-images/${imagePath}`;
    }
  };

  useEffect(() => {
    if (!styleID) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const apiEndpoint =
      typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? '/.netlify/functions/get-product'
        : '/.netlify/functions/get-product';

    fetch(`${apiEndpoint}?styleID=${styleID}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [styleID]);

  if (loading)
    return (
      <Layout>
        <p>Loading product...</p>
      </Layout>
    );
  if (!styleID)
    return (
      <Layout>
        <p>Product ID not specified.</p>
      </Layout>
    );
  if (!product)
    return (
      <Layout>
        <p>Product not found.</p>
      </Layout>
    );

  const name = product.title || product.styleName || 'Product';
  const mainImageUrl = getProductImageUrl(product);

  return (
    <Layout>
      <h1>{name}</h1>
      {/* Main product image */}
      <img
        src={mainImageUrl}
        alt={name}
        onError={(e) => {
          // Fallback to placeholder if main image fails
          console.log('Main image failed to load:', mainImageUrl);
          e.target.src = '/images/placeholder.png';
        }}
        style={{ width: 300, marginBottom: 16 }}
      />

      {/* Show available colors if they exist */}
      {product.colors && product.colors.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <h3>Available Colors:</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {product.colors.map((color) => (
              <div key={color.name} style={{ textAlign: 'center' }}>
                <img
                  src={getProductImageUrl(product, color.name)}
                  alt={color.name}
                  onError={(e) => {
                    // Fallback to main image if color image fails
                    e.target.src = mainImageUrl;
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: 'cover',
                    borderRadius: 4,
                    border: '1px solid #ddd',
                  }}
                  loading="lazy"
                />
                <p style={{ fontSize: '0.8rem', margin: '4px 0' }}>
                  {color.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p>{product.description}</p>

      {/* Additional product details */}
      {product.brandName && (
        <p>
          <strong>Brand:</strong> {product.brandName}
        </p>
      )}
      {product.categories && (
        <p>
          <strong>Category:</strong> {product.categories.join(', ')}
        </p>
      )}
      {product.mill && (
        <p>
          <strong>Mill:</strong> {product.mill}
        </p>
      )}
      {product.piecesPerCase && (
        <p>
          <strong>Pieces per case:</strong> {product.piecesPerCase}
        </p>
      )}
    </Layout>
  );
};

export default ProductPage;
