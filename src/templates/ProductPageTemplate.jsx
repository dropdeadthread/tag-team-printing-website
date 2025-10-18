import React, { useContext, useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import { CartContext } from '../context/CartContext';
import SizeChartModal from '../components/SizeChartModal';
import ProductSpecsModal from '../components/ProductSpecsModal';
import { trackProductView } from '../utils/analytics';

// Helper for main style image
const getStyleImageUrl = (styleIdentifier) =>
  styleIdentifier
    ? `https://images.ssactivewear.com/Style/${styleIdentifier}_fm.jpg`
    : '/images/placeholder.png';

const ProductPageTemplate = ({ data, pageContext }) => {
  const product = data && data.ssProduct ? data.ssProduct : null;
  const { addToCart } = useContext(CartContext);

  const [selectedSize, setSelectedSize] = useState('M');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [inventoryData, setInventoryData] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product?.styleID) {
      // Track product view for analytics
      trackProductView({
        id: product.styleID,
        styleNumber: product.styleNumber,
        brand: product.brand,
        styleName: product.styleName,
        category: product.category || 'Apparel',
        price: product.prices?.at48 || 0,
      });

      fetch(`/api/get-inventory?styleID=${product.styleID}`)
        .then((res) => res.json())
        .then((data) => {
          setInventoryData(data);
          const sizesWithStock = Object.keys(data.sizes || {}).filter(
            (size) => data.sizes[size].available > 0,
          );
          if (sizesWithStock.length > 0) {
            setSelectedSize(sizesWithStock[0]);
          }

          // Set default color if available
          if (data.colors && data.colors.length > 0) {
            const availableColor = data.colors.find((c) => c.available);
            if (availableColor) {
              setSelectedColor(availableColor);
            }
          }
        })
        .catch((err) => {
          console.error('Error fetching inventory:', err);
        });
    }
  }, [product?.styleID]);

  if (!product) {
    return (
      <div
        style={{
          background: '#fff',
          minHeight: '100vh',
          padding: '2rem',
          fontFamily: 'Arial, sans-serif',
          color: '#000',
          textAlign: 'center',
        }}
      >
        <h1>Product not found</h1>
        <p>The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  const imageUrl = getStyleImageUrl(product.styleID || product.styleName);
  const productName = product?.title || product?.Name || 'Product';
  const productPrice = inventoryData?.sizes?.[selectedSize]?.price || 25.0;

  const availableSizes = inventoryData?.sizes
    ? Object.keys(inventoryData.sizes).filter(
        (size) => inventoryData.sizes[size].available > 0,
      )
    : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const swatches = inventoryData?.colors || [];

  const handleAddToCart = () => {
    addToCart({
      Title: productName,
      Price: productPrice,
      Size: selectedSize,
      Color: selectedColor?.name || 'Standard',
      Image: imageUrl,
      Quantity: quantity,
      StyleID: product.styleID,
    });

    // Item added to cart - no popup needed, floating cart button will show the count
  };

  return (
    <div
      style={{
        background: '#fff',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        zIndex: 1000,
        overflow: 'auto',
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        color: '#000',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <img
              src={imageUrl}
              alt={productName}
              style={{
                width: '100%',
                maxWidth: '400px',
                height: 'auto',
                objectFit: 'contain',
                border: '2px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f8f8f8',
              }}
              onError={(e) => {
                console.log('Product image failed to load:', imageUrl);
                if (e.target.src.includes('images.ssactivewear.com')) {
                  e.target.src = `https://www.ssactivewear.com/Images/Style/${product.styleID}_fm.jpg`;
                } else if (e.target.src.includes('www.ssactivewear.com')) {
                  e.target.src = '/images/placeholder.png';
                }
              }}
            />
          </div>

          <div style={{ color: '#000' }}>
            <h1
              style={{
                fontSize: '2.5rem',
                color: '#333',
                marginBottom: '1rem',
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif',
              }}
            >
              {productName}
            </h1>

            <p
              style={{
                fontSize: '1.5rem',
                color: '#666',
                marginBottom: '1rem',
              }}
            >
              Brand: {product.brandName}
            </p>

            <p
              style={{
                fontSize: '2rem',
                color: '#333',
                fontWeight: 'bold',
                marginBottom: '2rem',
              }}
            >
              ${productPrice}
            </p>

            <div style={{ marginBottom: '2rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '0.5rem',
                }}
              >
                Size:
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                style={{
                  padding: '0.5rem',
                  fontSize: '1rem',
                  border: '2px solid #333',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  color: '#333',
                }}
              >
                {availableSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Options */}
            {inventoryData?.colors && inventoryData.colors.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '0.5rem',
                  }}
                >
                  Color: {selectedColor?.name || 'Select a color'}
                </label>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {inventoryData.colors.map((color, index) => (
                    <div
                      key={index}
                      onClick={() => color.available && setSelectedColor(color)}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: color.hex || '#ccc',
                        border:
                          selectedColor?.name === color.name
                            ? '4px solid #333'
                            : '2px solid #ddd',
                        cursor: color.available ? 'pointer' : 'not-allowed',
                        opacity: color.available ? 1 : 0.5,
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title={`${color.name} ${!color.available ? '(Unavailable)' : ''}`}
                    >
                      {!color.available && (
                        <span
                          style={{
                            color: 'red',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                          }}
                        >
                          ✕
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '0.5rem',
                }}
              >
                Quantity:
              </label>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                  }}
                >
                  -
                </button>
                <span
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    minWidth: '50px',
                    textAlign: 'center',
                    color: '#333',
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              style={{
                backgroundColor: '#333',
                color: '#fff',
                border: 'none',
                padding: '1rem 2rem',
                fontSize: '1.2rem',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '1rem',
                marginBottom: '1rem',
              }}
            >
              Add {quantity} to Cart - ${(productPrice * quantity).toFixed(2)}
            </button>

            <button
              onClick={() => setShowSizeChart(true)}
              style={{
                backgroundColor: '#666',
                color: '#fff',
                border: 'none',
                padding: '1rem 2rem',
                fontSize: '1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '1rem',
                marginBottom: '1rem',
              }}
            >
              Size Chart
            </button>

            <button
              onClick={() => setShowSpecsModal(true)}
              style={{
                backgroundColor: '#666',
                color: '#fff',
                border: 'none',
                padding: '1rem 2rem',
                fontSize: '1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '1rem',
              }}
            >
              Specifications
            </button>

            <button
              onClick={() => setShowSpecsModal(true)}
              style={{
                backgroundColor: '#666',
                color: '#fff',
                border: 'none',
                padding: '1rem 2rem',
                fontSize: '1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '1rem',
              }}
            >
              Specifications
            </button>
          </div>
        </div>
      </div>

      {showSizeChart && (
        <SizeChartModal
          isOpen={showSizeChart}
          onClose={() => setShowSizeChart(false)}
          brandName={product.brandName}
          styleID={product.styleID}
        />
      )}

      {showSpecsModal && (
        <ProductSpecsModal
          isOpen={showSpecsModal}
          onClose={() => setShowSpecsModal(false)}
          product={product}
          inventoryData={inventoryData}
        />
      )}

      {showSpecsModal && (
        <ProductSpecsModal
          isOpen={showSpecsModal}
          onClose={() => setShowSpecsModal(false)}
          product={product}
          inventoryData={inventoryData}
        />
      )}
    </div>
  );
};

// GraphQL query removed - this template is no longer used as a page component
// All product pages now use SimpleProductPageTemplate.jsx with API calls instead

export default ProductPageTemplate;
