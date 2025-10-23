import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import Layout from '../components/Layout';
import IntegratedPrintOrderForm from '../components/IntegratedPrintOrderForm';

// Simple working product template that loads data directly
const SimpleProductPageTemplate = ({ pageContext }) => {
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [inventoryData, setInventoryData] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showPrintOrder, setShowPrintOrder] = useState(false);
  const [colorInventoryLoading, setColorInventoryLoading] = useState(false);

  useEffect(() => {
    // Load product data from our JSON file directly
    const loadProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch('/all_styles_raw.json');
        const data = await response.json();

        // Ensure data is an array
        let allProducts = Array.isArray(data) ? data : data.products || [];

        if (!Array.isArray(allProducts)) {
          console.error(
            'Expected allProducts to be an array, got:',
            typeof allProducts,
            allProducts,
          );
          allProducts = [];
        }

        const foundProduct = allProducts.find(
          (p) => p.styleName === pageContext.styleCode,
        );

        // Product lookup completed

        setProduct(foundProduct);

        // Load inventory data
        if (foundProduct?.styleID) {
          // Always use the real Netlify function (not the mock API)
          const apiEndpoint = '/.netlify/functions/get-inventory';
          const inventoryResponse = await fetch(
            `${apiEndpoint}?styleCode=${foundProduct.styleID}`,
          );
          const inventory = await inventoryResponse.json();
          setInventoryData(inventory);

          // Set default color if available
          if (inventory.colors && inventory.colors.length > 0) {
            const availableColor = inventory.colors.find((c) =>
              Object.values(c.sizes || {}).some((size) => size.available > 0),
            );
            if (availableColor) {
              setSelectedColor(availableColor);

              // Set default selected size to first available for this color
              const sizesWithStock = Object.keys(
                availableColor.sizes || {},
              ).filter((size) => availableColor.sizes[size].available > 0);
              if (sizesWithStock.length > 0) {
                setSelectedSize(sizesWithStock[0]);
              }
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading product:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          styleCode: pageContext.styleCode,
        });
        setLoading(false);
      }
    };

    loadProduct();
  }, [pageContext.styleCode]);

  if (loading) {
    return (
      <Layout>
        <div
          style={{
            padding: '4rem 2rem',
            color: '#333',
            backgroundColor: '#fff',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: '#333', marginBottom: '1rem' }}>
              Loading product...
            </h1>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #ff5050',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto',
              }}
            ></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div
          style={{
            padding: '4rem 2rem',
            color: '#333',
            backgroundColor: '#fff',
            minHeight: '400px',
          }}
        >
          <h1 style={{ color: '#333' }}>Product not found</h1>
          <p style={{ color: '#666' }}>
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <p style={{ color: '#666' }}>
            Looking for style code: {pageContext.styleCode}
          </p>
        </div>
      </Layout>
    );
  }

  // Get fallback image for product page based on product category
  const getProductFallbackImage = (product) => {
    // For t-shirts, use actual mockup
    if (
      product?.baseCategory?.toLowerCase().includes('shirt') ||
      product?.categories?.includes('21')
    ) {
      return '/images/black tshirt mockup.png';
    }

    // For other categories, use placeholder (will be replaced with styled div)
    return '/images/placeholder.png';
  };

  // Get category-specific styling for product placeholders
  const getProductPlaceholderStyle = (product) => {
    const category = product?.baseCategory?.toLowerCase() || '';

    if (category.includes('hoodie') || category.includes('sweatshirt')) {
      return { backgroundColor: '#1e3a8a', color: 'white' }; // Navy blue
    } else if (category.includes('zip')) {
      return { backgroundColor: '#3b82f6', color: 'white' }; // Royal blue
    } else if (category.includes('long')) {
      return { backgroundColor: '#15803d', color: 'white' }; // Green
    } else if (category.includes('tank')) {
      return { backgroundColor: '#dc2626', color: 'white' }; // Red
    } else if (category.includes('headwear') || category.includes('hat')) {
      return { backgroundColor: '#6b7280', color: 'white' }; // Gray
    } else if (category.includes('crew')) {
      return { backgroundColor: '#eab308', color: 'black' }; // Yellow
    }

    return { backgroundColor: '#f3f4f6' }; // Default gray
  };

  const getProductLabel = (product) => {
    const category = product?.baseCategory?.toLowerCase() || '';

    if (category.includes('hoodie') || category.includes('sweatshirt'))
      return 'HOODIE';
    if (category.includes('zip')) return 'ZIP-UP';
    if (category.includes('long')) return 'LONG SLEEVE';
    if (category.includes('tank')) return 'TANK TOP';
    if (category.includes('headwear') || category.includes('hat')) return 'HAT';
    if (category.includes('crew')) return 'CREWNECK';
    if (category.includes('shirt')) return 'T-SHIRT';

    return 'APPAREL';
  };

  // Helper function to determine product type from category information
  const getProductType = (product) => {
    if (!product) return 'APPAREL';

    const category = (product.baseCategory || '').toLowerCase();
    const title = (product.title || '').toLowerCase();

    // Check for headwear
    if (
      category.includes('headwear') ||
      title.includes('cap') ||
      title.includes('hat') ||
      title.includes('beanie')
    ) {
      return 'HEADWEAR';
    }

    // Check for hoodies
    if (
      category.includes('hood') ||
      title.includes('hoodie') ||
      title.includes('hooded')
    ) {
      return 'HOODIE';
    }

    // Check for crewneck sweatshirts
    if (
      category.includes('crew') ||
      title.includes('crewneck') ||
      title.includes('crew neck')
    ) {
      return 'CREWNECK';
    }

    // Check for t-shirts
    if (
      category.includes('shirt') ||
      title.includes('tee') ||
      title.includes('t-shirt')
    ) {
      return 'T-SHIRT';
    }

    // Check for other categories
    if (category.includes('quarter') || title.includes('quarter-zip')) {
      return 'QUARTER-ZIP';
    }

    if (category.includes('polo') || title.includes('polo')) {
      return 'POLO';
    }

    return 'APPAREL';
  };

  // REMOVED: Old color mapping - now using real S&S API color image data

  // FIXED: Helper function to generate image URLs based on environment
  // Uses process.env.NODE_ENV which works during both build-time (SSR) and run-time
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      console.log('❌ No imagePath provided to getImageUrl');
      return null;
    }

    // Check if we're in development using environment variable
    // This works during both build-time (SSR) and run-time
    const isDevelopment = process.env.NODE_ENV === 'development';

    let finalUrl;
    if (isDevelopment) {
      // Development: Access S&S images directly (no CORS issues on localhost)
      finalUrl = `https://www.ssactivewear.com/${imagePath}`;
    } else {
      // Production: Proxy through Netlify function
      finalUrl = `/ss-images/${imagePath}`;
    }

    console.log(`🖼️ Image URL (${isDevelopment ? 'dev' : 'prod'}):`, finalUrl);
    return finalUrl;
  };

  // Get color-aware product image using S&S API color images
  const getProductImageUrl = (product, selectedColor) => {
    console.log('🔍 Getting image URL for:', {
      productStyleID: product?.styleID,
      productStyleImage: product?.styleImage,
      selectedColorName: selectedColor?.name,
      selectedColorFrontImage: selectedColor?.colorFrontImage,
      selectedColorSideImage: selectedColor?.colorSideImage,
    });

    if (!product?.styleID) {
      console.log('❌ No styleID found, using fallback');
      return getProductFallbackImage(product);
    }

    // Use S&S API color-specific images if available
    if (selectedColor && selectedColor.colorFrontImage) {
      const colorImageUrl = getImageUrl(selectedColor.colorFrontImage);
      console.log(
        `✅ Using S&S color front image for ${selectedColor.name}:`,
        colorImageUrl,
      );
      return colorImageUrl;
    }

    // Alternative - use colorSideImage if colorFrontImage not available
    if (selectedColor && selectedColor.colorSideImage) {
      const colorImageUrl = getImageUrl(selectedColor.colorSideImage);
      console.log(
        `✅ Using S&S color side image for ${selectedColor.name}:`,
        colorImageUrl,
      );
      return colorImageUrl;
    }

    // Fallback to main product image if no color-specific S&S image
    if (product.styleImage) {
      const mainImageUrl = getImageUrl(product.styleImage);
      console.log('✅ Using main product image:', mainImageUrl);
      return mainImageUrl;
    }

    // Final fallback to constructed URL using styleID
    const imagePath = `Images/Style/${product.styleID}_fm.jpg`;
    const fallbackImageUrl = getImageUrl(imagePath);
    console.log('✅ Using constructed fallback image:', fallbackImageUrl);
    return fallbackImageUrl || getProductFallbackImage(product);
  };

  // FIXED: Handle image loading errors and provide fallback
  const handleImageError = (event) => {
    console.log(
      'Color-specific image not found, falling back to main product image',
    );

    // Try main product image first using our helper function
    if (product?.styleImage) {
      const mainImageUrl = getImageUrl(product.styleImage);

      // Don't try the same URL twice
      if (event.target.src !== mainImageUrl) {
        event.target.src = mainImageUrl;
        return;
      }
    }

    // Ultimate fallback based on product type
    const productType = getProductType(product);
    let fallbackImage = '/api/placeholder/400/400';

    switch (productType) {
      case 'T-SHIRT':
        fallbackImage = '/images/black tshirt mockup.png';
        break;
      case 'HOODIE':
        fallbackImage = '/images/black hoodie mockup.png';
        break;
      case 'CREWNECK':
        fallbackImage = '/images/black crewneck mockup.png';
        break;
      case 'HEADWEAR':
        fallbackImage = '/images/black hat mockup.png';
        break;
      default:
        fallbackImage = '/api/placeholder/400/400';
    }

    event.target.src = fallbackImage;
  };

  const brandLogoUrl = null; // Disable brand logos for now due to CORS issues

  // Get pricing from selected color and size
  const rawPrice = selectedColor?.sizes?.[selectedSize]?.price || 25.0;
  const currentPrice = parseFloat(rawPrice) || 25.0;
  const stockAmount = selectedColor?.sizes?.[selectedSize]?.available || 0;

  const handleAddToCart = () => {
    addToCart({
      Title: product.title,
      Price: currentPrice,
      Size: selectedSize,
      Image: product ? getProductImageUrl(product, selectedColor) : null,
      Color: selectedColor?.name || 'Standard',
      Quantity: quantity,
      StyleID: product.styleID,
    });

    // Show visual confirmation
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);

    // Item added to cart - no popup needed, floating cart button will show the count
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleColorChange = async (color) => {
    console.log('🎨 Color changed to:', color.name, 'Color data:', color);
    setSelectedColor(color);
    setColorInventoryLoading(true);

    // No need to reload inventory - we already have all color data
    // Just update selected size to first available size for this color
    const availableSizes = Object.keys(color.sizes || {}).filter(
      (size) => color.sizes[size].available > 0,
    );
    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    }

    setColorInventoryLoading(false);
  };

  return (
    <Layout>
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
        `}
      </style>
      <div
        style={{
          backgroundImage: 'url(/images/vintage-black-paper.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          backgroundPosition: '-40px top',
          minHeight: '100vh',
          color: '#fff',
          position: 'relative',
          zIndex: 1, // Ensure this is below the floating button
          margin: 0,
          padding: '220px 0 0 0', // Top, Right, Bottom, Left padding
          width: '100%',
        }}
      >
        {/* Add CSS for loading animation and layout overrides */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Override layout wrapper styles for product pages */
          .layout-wrapper.product-layout {
            background: none !important;
            align-items: stretch !important;
          }
          
          .layout-wrapper.product-layout main {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
        `}</style>

        <div
          style={{
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            paddingTop: '2rem', // Override the container padding-top since we set it on parent
          }}
        >
          {/* Category Navigation */}
          <div style={{ marginBottom: '2rem' }}>
            {/* Breadcrumb */}
            <div
              style={{
                marginBottom: '1rem',
                fontSize: '14px',
                color: '#ccc',
              }}
            >
              <a href="/" style={{ color: '#fff', textDecoration: 'none' }}>
                Home
              </a>
              <span style={{ margin: '0 0.5rem' }}>›</span>
              <span>Products</span>
              {product && (
                <>
                  <span style={{ margin: '0 0.5rem' }}>›</span>
                  <span>{product.title}</span>
                </>
              )}
            </div>

            {/* Category Quick Navigation */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              {[
                {
                  id: '21',
                  slug: 't-shirts',
                  name: 'T-Shirts',
                  color: '#2c2c2c',
                },
                {
                  id: '36',
                  slug: 'hoodies',
                  name: 'Hoodies',
                  color: '#1e3a8a',
                },
                {
                  id: '38',
                  slug: 'zip-ups',
                  name: 'Zip-Ups',
                  color: '#3b82f6',
                },
                {
                  id: '56',
                  slug: 'long-sleeves',
                  name: 'Long Sleeves',
                  color: '#15803d',
                },
                {
                  id: '64',
                  slug: 'tank-tops',
                  name: 'Tank Tops',
                  color: '#dc2626',
                },
                {
                  id: '11',
                  slug: 'headwear',
                  name: 'Headwear',
                  color: '#6b7280',
                },
                {
                  id: '400',
                  slug: 'crewnecks',
                  name: 'Crewnecks',
                  color: '#eab308',
                },
              ].map((category) => (
                <a
                  key={category.id}
                  href={`/category/${category.slug}`}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: category.color,
                    color: category.color === '#eab308' ? '#000' : '#fff',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    border: '2px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {category.name}
                </a>
              ))}
            </div>

            {/* Back to Category Button */}
            {product && (
              <button
                onClick={() =>
                  typeof window !== 'undefined' && window.history.back()
                }
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }}
              >
                ← Back to Previous Page
              </button>
            )}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '3rem',
              alignItems: 'start',
            }}
          >
            {/* Product Image */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setImageZoomed(!imageZoomed)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setImageZoomed(!imageZoomed);
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'zoom-in',
                }}
                aria-label="Click to zoom image"
              >
                {/* Custom placeholder for non-t-shirt products */}
                {(() => {
                  const currentImageUrl = product
                    ? getProductImageUrl(product, selectedColor)
                    : null;
                  return currentImageUrl &&
                    currentImageUrl.includes('placeholder') &&
                    !product?.baseCategory?.toLowerCase().includes('shirt') ? (
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        height: '400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        border: '3px solid #fff',
                        fontWeight: 'bold',
                        fontSize: '24px',
                        textAlign: 'center',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                        cursor: 'zoom-in',
                        transition: 'all 0.3s ease',
                        transform: imageZoomed ? 'scale(1.5)' : 'scale(1)',
                        zIndex: imageZoomed ? 1000 : 1,
                        position: imageZoomed ? 'fixed' : 'relative',
                        top: imageZoomed ? '50%' : 'auto',
                        left: imageZoomed ? '50%' : 'auto',
                        marginTop: imageZoomed ? '-250px' : '0',
                        marginLeft: imageZoomed ? '-250px' : '0',
                        ...getProductPlaceholderStyle(product),
                      }}
                    >
                      {getProductLabel(product)}
                    </div>
                  ) : currentImageUrl ? (
                    <img
                      key={`${product?.styleID}-${selectedColor?.name || 'default'}`}
                      src={currentImageUrl}
                      alt={product.title}
                      onError={handleImageError}
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        height: 'auto',
                        background: '#f8f8f8',
                        border: '3px solid #fff',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                        cursor: 'zoom-in',
                        transition: 'all 0.3s ease',
                        transform: imageZoomed ? 'scale(1.5)' : 'scale(1)',
                        zIndex: imageZoomed ? 1000 : 1,
                        position: imageZoomed ? 'fixed' : 'relative',
                        top: imageZoomed ? '50%' : 'auto',
                        left: imageZoomed ? '50%' : 'auto',
                        marginTop: imageZoomed ? '-250px' : '0',
                        marginLeft: imageZoomed ? '-250px' : '0',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        height: '300px',
                        background: '#f8f8f8',
                        border: '3px solid #fff',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666',
                        fontSize: '16px',
                      }}
                    >
                      Loading image...
                    </div>
                  );
                })()}
              </button>
              {imageZoomed && (
                <div
                  onClick={() => setImageZoomed(false)}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' ||
                      e.key === ' ' ||
                      e.key === 'Escape'
                    ) {
                      e.preventDefault();
                      setImageZoomed(false);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Click to close zoomed image"
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 999,
                    cursor: 'zoom-out',
                  }}
                />
              )}

              {/* Enhanced Color indicator overlay */}
              {selectedColor && (
                <div
                  style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background:
                      'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.95) 100%)',
                    padding: '10px 16px',
                    borderRadius: '25px',
                    boxShadow:
                      '0 4px 16px rgba(0,0,0,0.25), 0 0 0 2px rgba(255,255,255,0.8)',
                    zIndex: 10,
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.9)',
                    animation: 'slideDown 0.4s ease-out',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: selectedColor.hex,
                      border: '3px solid #fff',
                      boxShadow:
                        '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)',
                      position: 'relative',
                    }}
                  >
                    {/* Color ring animation */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-3px',
                        left: '-3px',
                        right: '-3px',
                        bottom: '-3px',
                        borderRadius: '50%',
                        border: '2px solid transparent',
                        borderTop: '2px solid #ff5050',
                        animation: 'spin 2s linear infinite',
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#333',
                        textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                      }}
                    >
                      {selectedColor.name}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '500',
                        color: '#666',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Selected
                    </span>
                  </div>
                </div>
              )}

              <div
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  zIndex: 10,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                Click to zoom
              </div>

              {/* Action Buttons Under Image */}
              <div
                style={{
                  marginTop: '1rem',
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  style={{
                    background:
                      'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.95rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 8px rgba(0,123,255,0.3)',
                    flex: 1,
                    minWidth: '140px',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 12px rgba(0,123,255,0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0,123,255,0.3)';
                  }}
                  onFocus={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 12px rgba(0,123,255,0.4)';
                  }}
                  onBlur={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0,123,255,0.3)';
                  }}
                >
                  📏 Size Chart
                </button>

                <button
                  onClick={() => setShowProductDetails(!showProductDetails)}
                  style={{
                    background:
                      'linear-gradient(135deg, #6f42c1 0%, #5a2d91 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.95rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 8px rgba(111,66,193,0.3)',
                    flex: 1,
                    minWidth: '140px',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow =
                      '0 6px 12px rgba(111,66,193,0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 8px rgba(111,66,193,0.3)';
                  }}
                  onFocus={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow =
                      '0 6px 12px rgba(111,66,193,0.4)';
                  }}
                  onBlur={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 8px rgba(111,66,193,0.3)';
                  }}
                >
                  ℹ️ Product Details
                </button>
              </div>

              {/* ENHANCED Print Quote Section - Primary Action */}
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '2rem',
                  background:
                    'linear-gradient(135deg, rgba(255, 80, 80, 0.15) 0%, rgba(204, 64, 64, 0.15) 100%)',
                  border: '3px solid #ff5050',
                  borderRadius: '16px',
                  textAlign: 'center',
                  boxShadow: '0 8px 20px rgba(255, 80, 80, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Background accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '200px',
                    height: '200px',
                    background: 'rgba(255, 80, 80, 0.1)',
                    borderRadius: '50%',
                    zIndex: 0,
                  }}
                />

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#ff5050',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      marginBottom: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    ⚡ Custom Printing Available
                  </div>

                  <h3
                    style={{
                      color: '#ff5050',
                      fontSize: '1.8rem',
                      marginBottom: '0.5rem',
                      fontWeight: 'bold',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    Tag Us In to Print for You
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        color: '#fff',
                        fontSize: '0.9rem',
                        padding: '0.3rem 0.8rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '15px',
                        border: '1px solid rgba(255, 245, 209, 0.3)',
                      }}
                    >
                      ✓ Championship quality prints
                    </span>
                    <span
                      style={{
                        color: '#fff',
                        fontSize: '0.9rem',
                        padding: '0.3rem 0.8rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '15px',
                        border: '1px solid rgba(255, 245, 209, 0.3)',
                      }}
                    >
                      ✓ Fast turnaround, no job too tough
                    </span>
                    <span
                      style={{
                        color: '#fff',
                        fontSize: '0.9rem',
                        padding: '0.3rem 0.8rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '15px',
                        border: '1px solid rgba(255, 245, 209, 0.3)',
                      }}
                    >
                      ✓ Our team brings your vision to the main event
                    </span>
                  </div>

                  <button
                    onClick={() => setShowPrintOrder(!showPrintOrder)}
                    style={{
                      background: showPrintOrder
                        ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                        : 'linear-gradient(135deg, #ff5050 0%, #cc4040 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '1.2rem 2.5rem',
                      fontSize: '1.3rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease',
                      boxShadow: showPrintOrder
                        ? '0 8px 20px rgba(40, 167, 69, 0.4)'
                        : '0 8px 20px rgba(255,80,80,0.5)',
                      transform: showPrintOrder ? 'scale(0.98)' : 'scale(1)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      minWidth: '250px',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-3px) scale(1.05)';
                      e.target.style.boxShadow = showPrintOrder
                        ? '0 12px 25px rgba(40, 167, 69, 0.6)'
                        : '0 12px 25px rgba(255,80,80,0.7)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = showPrintOrder
                        ? 'scale(0.98)'
                        : 'scale(1)';
                      e.target.style.boxShadow = showPrintOrder
                        ? '0 8px 20px rgba(40, 167, 69, 0.4)'
                        : '0 8px 20px rgba(255,80,80,0.5)';
                    }}
                    onFocus={(e) => {
                      e.target.style.transform = 'translateY(-3px) scale(1.05)';
                      e.target.style.boxShadow = showPrintOrder
                        ? '0 12px 25px rgba(40, 167, 69, 0.6)'
                        : '0 12px 25px rgba(255,80,80,0.7)';
                    }}
                    onBlur={(e) => {
                      e.target.style.transform = showPrintOrder
                        ? 'scale(0.98)'
                        : 'scale(1)';
                      e.target.style.boxShadow = showPrintOrder
                        ? '0 8px 20px rgba(40, 167, 69, 0.4)'
                        : '0 8px 20px rgba(255,80,80,0.5)';
                    }}
                  >
                    {showPrintOrder ? 'Hide Quote Form' : 'Get Instant Quote'}
                  </button>
                </div>
              </div>

              {/* ENHANCED Print Quote Form */}
              {showPrintOrder && (
                <div
                  style={{
                    marginTop: '1.5rem',
                    padding: '2.5rem',
                    background:
                      'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
                    border: '3px solid #fff5d1',
                    borderRadius: '16px',
                    boxShadow:
                      '0 12px 30px rgba(0, 0, 0, 0.5), 5px 5px 0 #ff5050',
                    animation: 'slideDown 0.3s ease-out',
                    position: 'relative',
                  }}
                >
                  {/* Success/Progress Indicator */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-15px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#ff5050',
                      color: 'white',
                      padding: '0.5rem 1.5rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    ⚡ Live Quote Generator
                  </div>

                  <h3
                    style={{
                      color: '#ff5050',
                      fontSize: '2rem',
                      marginBottom: '1rem',
                      marginTop: '1rem',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    }}
                  >
                    Custom Print Quote
                  </h3>

                  <div
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255, 245, 209, 0.15) 0%, rgba(255, 245, 209, 0.08) 100%)',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: '2px solid rgba(255, 245, 209, 0.3)',
                      marginBottom: '2rem',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '1rem',
                      }}
                    >
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '8px',
                          backgroundColor: selectedColor?.hex || '#f0f0f0',
                          border: '3px solid #fff',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <h4
                          style={{
                            color: '#fff5d1',
                            margin: 0,
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {product.title}
                        </h4>
                        <p
                          style={{
                            color: 'rgba(255, 245, 209, 0.8)',
                            margin: '0.25rem 0 0 0',
                            fontSize: '1rem',
                          }}
                        >
                          Size: <strong>{selectedSize}</strong> • Color:{' '}
                          <strong>{selectedColor?.name || 'Standard'}</strong>
                        </p>
                        <p
                          style={{
                            color: '#fff5d1',
                            margin: '0.25rem 0 0 0',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                          }}
                        >
                          Garment Price:{' '}
                          <span style={{ color: '#ff5050' }}>
                            ${currentPrice.toFixed(2)} each
                          </span>
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '1rem',
                        backgroundColor: 'rgba(255, 80, 80, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 80, 80, 0.3)',
                      }}
                    >
                      <p
                        style={{
                          color: '#ff5050',
                          margin: 0,
                          fontSize: '0.95rem',
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}
                      >
                        “Built from scratch. Designed to destroy.”
                        <br />
                        <span
                          style={{
                            color: 'rgba(255, 245, 209, 0.9)',
                            fontSize: '0.85rem',
                          }}
                        >
                          Work with our in-house designers to create bold,
                          custom art that leaves a mark.
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Print Order Form */}
                  <IntegratedPrintOrderForm
                    isEmbedded={true}
                    preSelectedGarment={{
                      title: product.title,
                      price: currentPrice,
                      wholesalePrice: null, // Not available in new API structure
                      color: selectedColor?.name || null,
                      size: selectedSize,
                      baseCategory: product.baseCategory,
                      brandName: product.brandName,
                      styleID: product.styleID,
                    }}
                  />
                </div>
              )}

              {brandLogoUrl && (
                <img
                  src={brandLogoUrl}
                  alt={product.brandName}
                  style={{
                    width: '80px',
                    height: 'auto',
                    marginTop: '1rem',
                    background: 'white',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </div>

            {/* Product Details */}
            <div style={{ marginLeft: '4rem' }}>
              <h1
                style={{
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                  color: '#fff',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                }}
              >
                {product.title}
              </h1>

              <div
                style={{
                  fontSize: '2rem',
                  color: '#ff5050',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                }}
              >
                ${currentPrice.toFixed(2)}
              </div>

              {showProductDetails && (
                <div
                  style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '2px solid #ddd',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    animation: 'slideDown 0.3s ease-out',
                  }}
                >
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#333' }}>Brand:</strong>
                    <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                      {product.brandName}
                    </span>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#333' }}>Style:</strong>
                    <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                      {product.styleName}
                    </span>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#333' }}>Category:</strong>
                    <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                      {product.baseCategory}
                    </span>
                  </div>
                  <div>
                    <strong style={{ color: '#333' }}>Part Number:</strong>
                    <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                      {product.partNumber}
                    </span>
                  </div>
                  {product.description && (
                    <>
                      <hr
                        style={{
                          margin: '1rem 0',
                          border: 'none',
                          borderTop: '1px solid #ddd',
                        }}
                      />
                      <div>
                        <strong
                          style={{
                            color: '#333',
                            display: 'block',
                            marginBottom: '0.5rem',
                          }}
                        >
                          Description:
                        </strong>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: product.description,
                          }}
                          style={{
                            color: '#666',
                            lineHeight: '1.6',
                            fontSize: '0.9rem',
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {showSizeChart && (
                <div
                  style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    border: '2px solid #007bff',
                    boxShadow: '0 4px 8px rgba(0,123,255,0.3)',
                    animation: 'slideDown 0.3s ease-out',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 1rem 0',
                      color: '#007bff',
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                    }}
                  >
                    📏 Size Chart - {product?.title}
                  </h3>

                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.9rem',
                        marginBottom: '1rem',
                      }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                          <th
                            style={{
                              padding: '0.75rem',
                              border: '1px solid #dee2e6',
                              textAlign: 'left',
                              fontWeight: 'bold',
                              color: '#495057',
                            }}
                          >
                            Size
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              border: '1px solid #dee2e6',
                              textAlign: 'center',
                              fontWeight: 'bold',
                              color: '#495057',
                            }}
                          >
                            Chest (in)
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              border: '1px solid #dee2e6',
                              textAlign: 'center',
                              fontWeight: 'bold',
                              color: '#495057',
                            }}
                          >
                            Length (in)
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              border: '1px solid #dee2e6',
                              textAlign: 'center',
                              fontWeight: 'bold',
                              color: '#495057',
                            }}
                          >
                            Sleeve (in)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedColor?.sizes &&
                          Object.keys(selectedColor.sizes).map((size) => {
                            // Standard t-shirt measurements (approximate)
                            const measurements = {
                              XS: {
                                chest: '31-34',
                                length: '27',
                                sleeve: '8.5',
                              },
                              S: { chest: '34-37', length: '28', sleeve: '9' },
                              M: {
                                chest: '38-41',
                                length: '29',
                                sleeve: '9.5',
                              },
                              L: { chest: '42-45', length: '30', sleeve: '10' },
                              XL: {
                                chest: '46-49',
                                length: '31',
                                sleeve: '10.5',
                              },
                              XXL: {
                                chest: '50-53',
                                length: '32',
                                sleeve: '11',
                              },
                              '2XL': {
                                chest: '50-53',
                                length: '32',
                                sleeve: '11',
                              },
                              XXXL: {
                                chest: '54-57',
                                length: '33',
                                sleeve: '11.5',
                              },
                              '3XL': {
                                chest: '54-57',
                                length: '33',
                                sleeve: '11.5',
                              },
                              '4XL': {
                                chest: '58-61',
                                length: '34',
                                sleeve: '12',
                              },
                              '5XL': {
                                chest: '62-65',
                                length: '35',
                                sleeve: '12.5',
                              },
                            };
                            const sizeData = measurements[size] || {
                              chest: 'N/A',
                              length: 'N/A',
                              sleeve: 'N/A',
                            };

                            return (
                              <tr
                                key={size}
                                style={{
                                  backgroundColor:
                                    selectedSize === size ? '#e7f1ff' : 'white',
                                }}
                              >
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    border: '1px solid #dee2e6',
                                    fontWeight:
                                      selectedSize === size ? 'bold' : 'normal',
                                    color:
                                      selectedSize === size
                                        ? '#007bff'
                                        : '#495057',
                                  }}
                                >
                                  {size} {selectedSize === size && '← Selected'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    border: '1px solid #dee2e6',
                                    textAlign: 'center',
                                    color: '#495057',
                                  }}
                                >
                                  {sizeData.chest}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    border: '1px solid #dee2e6',
                                    textAlign: 'center',
                                    color: '#495057',
                                  }}
                                >
                                  {sizeData.length}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    border: '1px solid #dee2e6',
                                    textAlign: 'center',
                                    color: '#495057',
                                  }}
                                >
                                  {sizeData.sleeve}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>

                    <div
                      style={{
                        background: '#e8f5e8',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #c8e6c8',
                        marginBottom: '1rem',
                      }}
                    >
                      <h4
                        style={{
                          margin: '0 0 0.5rem 0',
                          color: '#2e7d32',
                          fontSize: '1rem',
                        }}
                      >
                        📐 How to Measure
                      </h4>
                      <div
                        style={{
                          fontSize: '0.85rem',
                          color: '#333',
                          lineHeight: '1.6',
                        }}
                      >
                        <div>
                          <strong>Chest:</strong> Measure around the fullest
                          part of your chest, keeping the tape horizontal.
                        </div>
                        <div>
                          <strong>Length:</strong> Measure from the highest
                          point of the shoulder to the bottom hem.
                        </div>
                        <div>
                          <strong>Sleeve:</strong> Measure from the center back
                          neck to the end of the sleeve.
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: '#fff3cd',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #ffeaa7',
                      }}
                    >
                      <h4
                        style={{
                          margin: '0 0 0.5rem 0',
                          color: '#856404',
                          fontSize: '1rem',
                        }}
                      >
                        ℹ️ Size Guide Notes
                      </h4>
                      <div
                        style={{
                          fontSize: '0.85rem',
                          color: '#333',
                          lineHeight: '1.6',
                        }}
                      >
                        <div>
                          • Measurements are approximate and may vary by ±1 inch
                        </div>
                        <div>
                          • For between sizes, we recommend sizing up for
                          comfort
                        </div>
                        <div>
                          • Contact us for specific brand sizing questions
                        </div>
                        {product?.sustainableStyle && (
                          <div
                            style={{
                              color: '#388e3c',
                              fontWeight: 'bold',
                              marginTop: '0.5rem',
                            }}
                          >
                            🌱 This is a sustainable product
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {selectedColor?.sizes && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.75rem',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: '#fff',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                    }}
                  >
                    Size: {selectedSize}
                  </label>

                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    {Object.entries(selectedColor?.sizes || {}).map(
                      ([size, data]) => (
                        <button
                          key={size}
                          onClick={() => handleSizeChange(size)}
                          style={{
                            padding: '0.75rem 1rem',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            border:
                              selectedSize === size
                                ? '2px solid #ff5050'
                                : '2px solid #ddd',
                            background:
                              data.available === 0
                                ? '#f8f9fa'
                                : selectedSize === size
                                  ? '#ff5050'
                                  : '#fff',
                            color:
                              data.available === 0
                                ? '#999'
                                : selectedSize === size
                                  ? '#fff'
                                  : '#333',
                            cursor:
                              data.available === 0 ? 'not-allowed' : 'pointer',
                            fontWeight:
                              selectedSize === size ? 'bold' : 'normal',
                            opacity: data.available === 0 ? 0.6 : 1,
                            transition: 'all 0.2s ease',
                          }}
                          disabled={data.available === 0}
                        >
                          {size}
                          <br />
                          <small style={{ fontSize: '0.8rem' }}>
                            {data.available === 0
                              ? 'Out'
                              : `${data.available} left`}
                          </small>
                        </button>
                      ),
                    )}
                  </div>
                  <div
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.9rem',
                      color: stockAmount < 5 ? '#dc3545' : '#28a745',
                      fontWeight: 'bold',
                    }}
                  >
                    {stockAmount === 0
                      ? 'Out of Stock'
                      : stockAmount < 5
                        ? `Only ${stockAmount} left in stock!`
                        : `${stockAmount} available`}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="quantity-input"
                  style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#fff',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  }}
                >
                  Quantity:
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    style={{
                      background: quantity <= 1 ? '#ccc' : '#ff5050',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 0.75rem',
                      fontSize: '1.2rem',
                      borderRadius: '4px',
                      cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    -
                  </button>
                  <input
                    id="quantity-input"
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, Math.min(stockAmount, value)));
                    }}
                    min="1"
                    max={stockAmount}
                    style={{
                      width: '80px',
                      padding: '0.5rem',
                      fontSize: '1.1rem',
                      textAlign: 'center',
                      border: '2px solid #ddd',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                    }}
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(stockAmount, quantity + 1))
                    }
                    disabled={quantity >= stockAmount}
                    style={{
                      background: quantity >= stockAmount ? '#ccc' : '#ff5050',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 0.75rem',
                      fontSize: '1.2rem',
                      borderRadius: '4px',
                      cursor:
                        quantity >= stockAmount ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    +
                  </button>
                  <span
                    style={{
                      marginLeft: '1rem',
                      fontSize: '0.9rem',
                      color: '#fff',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                    }}
                  >
                    Max: {stockAmount}
                  </span>
                </div>
              </div>

              {/* Add to Cart - Repositioned above color selection */}
              <button
                onClick={handleAddToCart}
                disabled={stockAmount === 0}
                style={{
                  background: addedToCart
                    ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                    : stockAmount === 0
                      ? '#ccc'
                      : '#ff5050',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  fontSize: '1.2rem',
                  borderRadius: '8px',
                  cursor: stockAmount === 0 ? 'not-allowed' : 'pointer',
                  marginBottom: '1.5rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  boxShadow: addedToCart
                    ? '0 6px 12px rgba(40, 167, 69, 0.4)'
                    : '0 6px 12px rgba(0,0,0,0.4)',
                  width: '100%',
                  transform: addedToCart ? 'scale(1.02)' : 'scale(1)',
                }}
                onMouseOver={(e) => {
                  if (stockAmount > 0 && !addedToCart) {
                    e.target.style.background = '#cc4040';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (stockAmount > 0 && !addedToCart) {
                    e.target.style.background = '#ff5050';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
                onFocus={(e) => {
                  if (stockAmount > 0 && !addedToCart) {
                    e.target.style.background = '#cc4040';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onBlur={(e) => {
                  if (stockAmount > 0 && !addedToCart) {
                    e.target.style.background = '#ff5050';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {addedToCart
                  ? 'Added to Cart!'
                  : stockAmount === 0
                    ? 'Out of Stock'
                    : `Add to Cart - $${(currentPrice * quantity).toFixed(2)}`}
              </button>

              {/* Color Options */}
              {inventoryData?.colors && inventoryData.colors.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.75rem',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: '#fff',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
                    }}
                  >
                    Color: {selectedColor?.name || 'Select a color'}
                    {colorInventoryLoading && (
                      <span
                        style={{
                          marginLeft: '0.5rem',
                          fontSize: '0.9rem',
                          color: '#ffcc00',
                          animation: 'pulse 1s infinite',
                        }}
                      >
                        🔄 Loading inventory...
                      </span>
                    )}
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    {inventoryData.colors.map((color, index) => {
                      // Calculate total stock for this color from its sizes
                      const colorStock = Object.values(
                        color.sizes || {},
                      ).reduce(
                        (total, size) => total + (size.available || 0),
                        0,
                      );
                      const colorAvailable = colorStock > 0;

                      return (
                        <div
                          key={index}
                          onClick={() =>
                            colorAvailable &&
                            !colorInventoryLoading &&
                            handleColorChange(color)
                          }
                          onKeyDown={(e) => {
                            if (
                              (e.key === 'Enter' || e.key === ' ') &&
                              colorAvailable &&
                              !colorInventoryLoading
                            ) {
                              e.preventDefault();
                              handleColorChange(color);
                            }
                          }}
                          tabIndex={
                            colorAvailable && !colorInventoryLoading ? 0 : -1
                          }
                          role="button"
                          aria-label={`Select ${color.name} color`}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            cursor:
                              colorAvailable && !colorInventoryLoading
                                ? 'pointer'
                                : 'not-allowed',
                          }}
                        >
                          <div
                            style={{
                              width: '55px',
                              height: '55px',
                              borderRadius: '50%',
                              backgroundColor: color.hex,
                              border:
                                selectedColor?.name === color.name
                                  ? '4px solid #ff5050'
                                  : '3px solid #ddd',
                              opacity:
                                colorAvailable && !colorInventoryLoading
                                  ? 1
                                  : 0.5,
                              transition: 'all 0.2s ease',
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transform:
                                selectedColor?.name === color.name
                                  ? 'scale(1.1)'
                                  : 'scale(1)',
                              boxShadow:
                                selectedColor?.name === color.name
                                  ? '0 4px 12px rgba(255, 80, 80, 0.5)'
                                  : '0 2px 4px rgba(0,0,0,0.3)',
                            }}
                            title={`${color.name} ${!colorAvailable ? '(Unavailable)' : colorStock ? `(${colorStock} in stock)` : ''}`}
                          >
                            {!colorAvailable && (
                              <span
                                style={{
                                  color: 'red',
                                  fontSize: '20px',
                                  fontWeight: 'bold',
                                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                                }}
                              >
                                ✕
                              </span>
                            )}
                            {colorInventoryLoading &&
                              selectedColor?.name === color.name && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid #fff',
                                    borderTop: '2px solid #ff5050',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                  }}
                                />
                              )}
                          </div>
                          <span
                            style={{
                              fontSize: '0.8rem',
                              color: '#fff',
                              textAlign: 'center',
                              fontWeight:
                                selectedColor?.name === color.name
                                  ? 'bold'
                                  : 'normal',
                              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                              minHeight: '1rem',
                            }}
                          >
                            {color.name}
                            {colorStock !== null &&
                              selectedColor?.name === color.name && (
                                <div
                                  style={{
                                    fontSize: '0.7rem',
                                    color: '#ffcc00',
                                  }}
                                >
                                  {colorStock} in stock
                                </div>
                              )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Enhanced Color Information Note */}
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      background:
                        'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>🎨</span>
                      <strong style={{ color: '#fff', fontSize: '0.9rem' }}>
                        Color & Image Info
                      </strong>
                    </div>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: '#e8e8e8',
                        margin: 0,
                        lineHeight: '1.5',
                        textAlign: 'left',
                      }}
                    >
                      The product image shows the style and fit. Your selected
                      color{' '}
                      {selectedColor && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: selectedColor.hex,
                              border: '1px solid rgba(255,255,255,0.5)',
                            }}
                          />
                          {selectedColor.name}
                        </span>
                      )}{' '}
                      will be the actual garment color you receive.
                    </p>
                    {product?.baseCategory?.toLowerCase().includes('shirt') && (
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: '#ccc',
                          margin: '0.5rem 0 0 0',
                          fontStyle: 'italic',
                        }}
                      >
                        💡 Tip: Some t-shirt colors may show color-matched
                        mockups above for reference.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Browse More Products Section */}
          <div
            style={{
              marginTop: '4rem',
              borderTop: '2px solid rgba(255,255,255,0.2)',
              paddingTop: '2rem',
            }}
          >
            <h3
              style={{
                color: '#fff',
                textAlign: 'center',
                marginBottom: '1.5rem',
                fontSize: '1.5rem',
              }}
            >
              Browse More Products
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              {[
                {
                  id: '21',
                  slug: 't-shirts',
                  name: 'T-Shirts',
                  description: 'Classic comfort for everyday wear',
                  color: '#2c2c2c',
                },
                {
                  id: '36',
                  slug: 'hoodies',
                  name: 'Hoodies',
                  description: 'Cozy warmth for cooler days',
                  color: '#1e3a8a',
                },
                {
                  id: '38',
                  slug: 'zip-ups',
                  name: 'Zip-Ups',
                  description: 'Versatile layering pieces',
                  color: '#3b82f6',
                },
                {
                  id: '56',
                  slug: 'long-sleeves',
                  name: 'Long Sleeves',
                  description: 'Extended coverage and style',
                  color: '#15803d',
                },
                {
                  id: '64',
                  slug: 'tank-tops',
                  name: 'Tank Tops',
                  description: 'Light and breathable options',
                  color: '#dc2626',
                },
                {
                  id: '11',
                  slug: 'headwear',
                  name: 'Headwear',
                  description: 'Complete your look',
                  color: '#6b7280',
                },
                {
                  id: '400',
                  slug: 'crewnecks',
                  name: 'Crewnecks',
                  description: 'Classic pullover style',
                  color: '#eab308',
                },
              ].map((category) => (
                <a
                  key={category.id}
                  href={`/category/${category.slug}`}
                  style={{
                    padding: '1.5rem',
                    backgroundColor: `${category.color}20`,
                    border: `2px solid ${category.color}40`,
                    borderRadius: '12px',
                    textDecoration: 'none',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                    display: 'block',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-4px)';
                    e.target.style.backgroundColor = `${category.color}40`;
                    e.target.style.borderColor = category.color;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.backgroundColor = `${category.color}20`;
                    e.target.style.borderColor = `${category.color}40`;
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      marginBottom: '0.5rem',
                      color: category.color,
                    }}
                  >
                    {category.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: '#ccc',
                      lineHeight: '1.4',
                    }}
                  >
                    {category.description}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SimpleProductPageTemplate;
