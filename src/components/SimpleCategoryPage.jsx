import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';

const SimpleCategoryPage = ({ categoryId, categoryName, categorySlug }) => {
  const [products, setProducts] = useState([]);
  const [allCategoryProducts, setAllCategoryProducts] = useState([]); // For brand filtering
  const [loading, setLoading] = useState(true);
  const [showWomensOnly, setShowWomensOnly] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // New sort state
  const [selectedBrands, setSelectedBrands] = useState([]); // New brand filter state
  const [priceRange, setPriceRange] = useState('all'); // New price filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalProducts: 0,
    hasMore: false,
    productsPerPage: 20,
  });

  // Dynamic brand lists based on category and actual products
  const getAvailableBrands = () => {
    // For headwear category (11), show only hat brands
    if (categoryId === 11 || categorySlug === 'headwear') {
      return ['Richardson', 'YP Classics', 'Valucap'];
    }

    // For all other categories, get brands dynamically from ALL products in category
    const productsToCheck =
      allCategoryProducts.length > 0 ? allCategoryProducts : products;

    if (productsToCheck.length === 0) {
      // Return default brands while products are loading
      return [
        'Gildan',
        'JERZEES',
        'BELLA + CANVAS',
        'Next Level',
        'Comfort Colors',
        'Threadfast Apparel',
      ];
    }

    // Get unique brands from all category products
    const brandsInCategory = [
      ...new Set(
        productsToCheck
          .map((product) => product.brandName || product.brand)
          .filter((brand) => brand),
      ),
    ].sort();

    return brandsInCategory;
  };

  const availableBrands = getAvailableBrands();

  // Function to search for products by brand within current category
  const searchByBrand = async (brandName) => {
    setSearchLoading(true);
    setSearchQuery(brandName);

    try {
      console.log(
        'Searching for brand:',
        brandName,
        'in category:',
        categoryId,
      );

      // Filter from all category products, not just current page
      const productsToSearch =
        allCategoryProducts.length > 0 ? allCategoryProducts : products;
      const brandResults = productsToSearch.filter(
        (product) =>
          product.brandName === brandName || product.brand === brandName,
      );

      console.log(
        'Brand search results for',
        brandName,
        ':',
        brandResults.length,
        'products',
      );
      setSearchResults(brandResults);
    } catch (error) {
      console.error('Error searching for brand:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Clear search results and return to category view
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchLoading(false);
  };

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId]);

  useEffect(() => {
    console.log(
      'Fetching products for category:',
      categoryId,
      'page:',
      currentPage,
    );
    setLoading(true);

    // First, get all products in category for brand filtering (without pagination)
    const apiEndpoint =
      typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? '/.netlify/functions/list-products'
        : '/.netlify/functions/list-products';

    fetch(`${apiEndpoint}?category=${categoryId}&limit=1000`) // Get all products
      .then((response) => response.json())
      .then((data) => {
        console.log(
          'All category products loaded:',
          data.products?.length || 0,
        );
        setAllCategoryProducts(data.products || []);
      })
      .catch((err) => {
        console.error('Error fetching all category products:', err);
        setAllCategoryProducts([]);
      });

    // Then get paginated products for display
    fetch(`${apiEndpoint}?category=${categoryId}&page=${currentPage}&limit=20`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Received paginated products:', data);
        setProducts(data.products || data); // Handle both new and old API format
        setPagination({
          totalPages: data.pagination?.totalPages || 1,
          totalProducts:
            data.pagination?.totalProducts || (data.products || data).length,
          hasMore: data.pagination?.hasMore || false,
          productsPerPage: data.pagination?.productsPerPage || 20,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setProducts([]);
        setLoading(false);
      });
  }, [categoryId, currentPage]);

  // Enhanced filter and sort products
  useEffect(() => {
    let filtered = products;

    // Apply women's filter if enabled (enhanced detection)
    if (showWomensOnly) {
      filtered = filtered.filter((product) => {
        const title = (product.title || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const styleCode = (product.styleCode || '').toLowerCase();

        // Enhanced women's detection - be more specific with style codes
        return (
          title.includes('women') ||
          title.includes('ladies') ||
          title.includes('womens') ||
          description.includes('women') ||
          description.includes('ladies') ||
          (styleCode.endsWith('l') && title.includes('women')) || // L suffix + women in title
          (styleCode.includes('w') && !styleCode.includes('sw'))
        ); // W but not SW (southwest, etc)
      });
    }

    // Apply brand filter - only show products that are already in this category
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brandName || product.brand),
      );
    }

    // Apply price sorting when price-low to high is active
    if (priceRange && priceRange !== '') {
      // When price-low to high button is active, always sort by price low to high
      filtered.sort(
        (a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0),
      );
    } else if (sortBy) {
      // Only apply manual sorting when price-low to high is not active
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return (a.title || a.name || '').localeCompare(
              b.title || b.name || '',
            );
          case 'brand':
            return (a.brandName || a.brand || '').localeCompare(
              b.brandName || b.brand || '',
            );
          case 'price-low':
            return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
          case 'price-high':
            return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [products, showWomensOnly, selectedBrands, priceRange, sortBy]);

  // Calculate display pagination based on whether filters are active
  const getDisplayPagination = () => {
    const hasActiveFilters =
      showWomensOnly || selectedBrands.length > 0 || priceRange !== 'all';

    if (hasActiveFilters) {
      // When filters are active, calculate pagination based on filtered results
      const totalFilteredProducts = filteredProducts.length;
      const productsPerPage = pagination.productsPerPage || 20;
      const totalFilteredPages = Math.max(
        1,
        Math.ceil(totalFilteredProducts / productsPerPage),
      );

      return {
        totalPages: totalFilteredPages,
        totalProducts: totalFilteredProducts,
        hasMore: currentPage < totalFilteredPages,
        productsPerPage,
      };
    } else {
      // When no filters are active, use API pagination
      return pagination;
    }
  };

  const displayPagination = getDisplayPagination();

  // Reset to page 1 if current page exceeds the total pages after filtering
  useEffect(() => {
    if (currentPage > displayPagination.totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, displayPagination.totalPages]);

  // Get products to display on current page (for filtered results)
  const getDisplayedProducts = () => {
    const hasActiveFilters =
      showWomensOnly || selectedBrands.length > 0 || priceRange !== 'all';

    if (hasActiveFilters) {
      // When filters are active, paginate the filtered results client-side
      const productsPerPage = pagination.productsPerPage || 20;
      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      return filteredProducts.slice(startIndex, endIndex);
    } else {
      // When no filters are active, show all filtered products (they're already paginated by API)
      return filteredProducts;
    }
  };

  const displayedProducts = getDisplayedProducts();

  // Toggle brand selection
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  // Get women's product count (enhanced detection)
  const getWomensCount = () => {
    // Use all category products for accurate count, not just current page
    const productsToCheck =
      allCategoryProducts.length > 0 ? allCategoryProducts : products;

    return productsToCheck.filter((product) => {
      const title = (product.title || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      const styleCode = (product.styleCode || '').toLowerCase();

      // Enhanced women's detection - be more specific with style codes
      return (
        title.includes('women') ||
        title.includes('ladies') ||
        title.includes('womens') ||
        description.includes('women') ||
        description.includes('ladies') ||
        (styleCode.endsWith('l') && title.includes('women')) || // L suffix + women in title
        (styleCode.includes('w') && !styleCode.includes('sw'))
      ); // W but not SW
    }).length;
  };

  const womensCount = getWomensCount();

  return (
    <>
      <style>
        {`
          /* Enhanced responsive grid for category pages */
          .category-product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            justify-items: center;
            justify-content: center;
            padding: 1rem 0;
            max-width: 100%;
          }
          
          /* Responsive breakpoints for better spacing */
          @media (min-width: 768px) {
            .category-product-grid {
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 1.5rem;
              justify-content: space-evenly;
            }
          }
          
          @media (min-width: 1024px) {
            .category-product-grid {
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 2rem;
              justify-content: space-around;
            }
          }
          
          @media (min-width: 1200px) {
            .category-product-grid {
              grid-template-columns: repeat(3, 1fr);
              gap: 2rem;
              justify-content: center;
            }
          }
          
          @media (min-width: 1400px) {
            .category-product-grid {
              grid-template-columns: repeat(4, 1fr);
              gap: 2rem;
              justify-content: center;
            }
          }
          
          /* Product card hover effects */
          .product-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>

      <div
        style={{
          minHeight: '100vh',
          paddingTop: '180px', // Add top padding to account for header (140px) + extra spacing
          paddingBottom: '2rem',
          fontFamily: 'Arial, sans-serif !important',
          color: '#fff',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem',
          }}
        >
          <h1
            style={{
              fontSize: '2.5rem',
              marginBottom: '2rem',
              marginTop: '1rem',
              color: '#fff',
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'capitalize',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            {categoryName || categorySlug?.replace('-', ' ') || 'Products'}
          </h1>

          {loading ? (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '10px',
                border: '2px solid #fff5d1',
              }}
            >
              <p
                style={{
                  fontSize: '1.5rem',
                  color: '#fff',
                  fontWeight: 'bold',
                  margin: 0,
                }}
              >
                Loading products...
              </p>
            </div>
          ) : !products.length ? (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '10px',
                border: '2px solid #fff5d1',
              }}
            >
              <p
                style={{
                  fontSize: '1.5rem',
                  color: '#fff',
                  fontWeight: 'bold',
                  margin: 0,
                }}
              >
                No products found in this category.
              </p>
            </div>
          ) : (
            <>
              {/* Enhanced S&S-Style Filters */}
              <div
                style={{
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  borderRadius: '8px',
                  border: '2px solid #fff5d1',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.2rem',
                    marginBottom: '1.5rem',
                    color: '#fff5d1',
                    fontWeight: 'bold',
                  }}
                >
                  Refine Your Search:
                </h3>

                {/* Top Row - Sort & Quick Filters */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  {/* Sort By Dropdown - Hidden when price range is active */}
                  {!priceRange && (
                    <div>
                      <label
                        htmlFor="sort-by-select"
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          color: '#fff5d1',
                          fontWeight: '500',
                          fontSize: '0.9rem',
                        }}
                      >
                        Sort By:
                      </label>
                      <select
                        id="sort-by-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          backgroundColor: '#fff',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="">Default Order</option>
                        <option value="name">Name A-Z</option>
                        <option value="brand">Brand A-Z</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                    </div>
                  )}

                  {/* Brand Dropdown */}
                  <div>
                    <label
                      htmlFor="brand-select"
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#fff5d1',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                      }}
                    >
                      Brand:
                    </label>
                    <select
                      id="brand-select"
                      value=""
                      onChange={(e) =>
                        e.target.value && toggleBrand(e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        backgroundColor: '#fff',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="">Select Brand...</option>
                      {availableBrands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand} {selectedBrands.includes(brand) ? '✓' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price-Low to High Button */}
                  <div style={{ display: 'flex', alignItems: 'end' }}>
                    <button
                      onClick={() => setPriceRange(priceRange ? '' : 'active')}
                      style={{
                        width: '100%',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        backgroundColor: priceRange ? '#28a745' : '#007bff',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        height: 'fit-content',
                      }}
                      onMouseEnter={(e) => {
                        if (!priceRange) {
                          e.target.style.backgroundColor = '#0056b3';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!priceRange) {
                          e.target.style.backgroundColor = '#007bff';
                        }
                      }}
                    >
                      {priceRange ? '✓ Price-Low to High' : 'Price-Low to High'}
                    </button>
                  </div>

                  {/* Women's Filter - Only show for garment categories (not headwear) */}
                  {categoryId !== 11 && categorySlug !== 'headwear' && (
                    <div style={{ display: 'flex', alignItems: 'end' }}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          backgroundColor: showWomensOnly ? '#28a745' : '#fff',
                          color: showWomensOnly ? '#fff' : '#333',
                          border: '2px solid #28a745',
                          transition: 'all 0.2s ease',
                          fontWeight: '500',
                          fontSize: '0.9rem',
                          height: 'fit-content',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={showWomensOnly}
                          onChange={(e) => setShowWomensOnly(e.target.checked)}
                          style={{ margin: 0 }}
                        />
                        Women&apos;s Only ({womensCount})
                      </label>
                    </div>
                  )}
                </div>

                {/* Selected Filters Display */}
                {(selectedBrands.length > 0 ||
                  priceRange ||
                  searchQuery ||
                  (showWomensOnly &&
                    categoryId !== 11 &&
                    categorySlug !== 'headwear')) && (
                  <div
                    style={{
                      marginBottom: '1rem',
                      padding: '1rem',
                      backgroundColor: 'rgba(255, 245, 209, 0.1)',
                      borderRadius: '6px',
                      border: '1px solid #fff5d1',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          color: '#fff5d1',
                          fontWeight: '500',
                          fontSize: '0.9rem',
                          marginRight: '0.5rem',
                        }}
                      >
                        Active Filters:
                      </span>

                      {/* Selected Brands */}
                      {selectedBrands.map((brand) => (
                        <span
                          key={brand}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          {brand}
                          <button
                            onClick={() => toggleBrand(brand)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#fff',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              padding: '0',
                              marginLeft: '0.25rem',
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      {/* Price Sort Filter */}
                      {priceRange && (
                        <span
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          Price-Low to High
                          <button
                            onClick={() => setPriceRange('')}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#fff',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              padding: '0',
                              marginLeft: '0.25rem',
                            }}
                          >
                            ×
                          </button>
                        </span>
                      )}

                      {/* Women's Filter (only for garment categories) */}
                      {showWomensOnly &&
                        categoryId !== 11 &&
                        categorySlug !== 'headwear' && (
                          <span
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#28a745',
                              color: '#fff',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            Women&apos;s Only
                            <button
                              onClick={() => setShowWomensOnly(false)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                padding: '0',
                                marginLeft: '0.25rem',
                              }}
                            >
                              ×
                            </button>
                          </span>
                        )}

                      {/* Search Query */}
                      {searchQuery && (
                        <span
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#ffc107',
                            color: '#000',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          Search: {searchQuery}
                          <button
                            onClick={clearSearch}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#000',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              padding: '0',
                              marginLeft: '0.25rem',
                            }}
                          >
                            ×
                          </button>
                        </span>
                      )}

                      {/* Clear All */}
                      <button
                        onClick={() => {
                          setSelectedBrands([]);
                          setPriceRange('');
                          setShowWomensOnly(false);
                          clearSearch();
                        }}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          marginLeft: '0.5rem',
                        }}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Brand Search Buttons (Legacy Support) */}
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#fff5d1',
                      fontWeight: '500',
                      fontSize: '0.9rem',
                      marginRight: '0.5rem',
                    }}
                  >
                    Quick Search:
                  </span>
                  {availableBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => searchByBrand(brand)}
                      disabled={searchLoading}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        backgroundColor:
                          searchQuery === brand ? '#28a745' : '#007bff',
                        color: '#fff',
                        border: 'none',
                        cursor: searchLoading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        fontWeight: '500',
                        fontSize: '0.8rem',
                        opacity: searchLoading ? 0.6 : 1,
                      }}
                    >
                      {searchLoading && searchQuery === brand
                        ? 'Searching...'
                        : brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Counter */}
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '3rem',
                  padding: '1rem',
                  backgroundColor: 'rgba(255, 245, 209, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid #fff5d1',
                }}
              >
                <p
                  style={{
                    fontSize: '1.3rem',
                    color: '#fff5d1',
                    fontWeight: 'bold',
                    margin: 0,
                  }}
                >
                  {searchQuery
                    ? searchLoading
                      ? `Searching for ${searchQuery}...`
                      : `${searchResults.length} products found for "${searchQuery}"`
                    : `${filteredProducts.length} of ${products.length} products shown`}
                </p>
              </div>

              {/* Product Grid - Show search results or filtered products */}
              <div className="category-product-grid">
                {(searchQuery ? searchResults : displayedProducts).map(
                  (prod, index) => {
                    const name =
                      prod.title ||
                      prod.name ||
                      prod.styleName ||
                      'Unknown Product';
                    const brand =
                      prod.brandName || prod.brand || 'Unknown Brand';
                    const styleID = prod.styleID || '';
                    const styleName =
                      prod.styleName || prod.styleCode || 'unknown';

                    // Get fallback image and styling based on category
                    const getFallbackImage = (categoryId) => {
                      // For t-shirts, use actual mockups
                      if (categoryId === 21 || categoryId === '21') {
                        return '/images/black tshirt mockup.png';
                      }

                      // For other categories, use placeholder with category-specific colors
                      return '/images/placeholder.png';
                    };

                    // Get category-specific background color for placeholders
                    const getCategoryPlaceholderStyle = (categoryId) => {
                      const styles = {
                        21: { backgroundColor: '#2c2c2c' }, // T-Shirts - dark
                        36: { backgroundColor: '#1e3a8a', color: 'white' }, // Hoodies - navy blue
                        38: { backgroundColor: '#3b82f6', color: 'white' }, // Full-Zips - royal blue
                        56: { backgroundColor: '#15803d', color: 'white' }, // Long Sleeves - green
                        64: { backgroundColor: '#dc2626', color: 'white' }, // Tank Tops - red
                        11: { backgroundColor: '#6b7280', color: 'white' }, // Headwear - gray
                        400: { backgroundColor: '#eab308', color: 'black' }, // Crewnecks - yellow
                      };
                      return (
                        styles[categoryId] || { backgroundColor: '#f3f4f6' }
                      );
                    };

                    const getCategoryLabel = (categoryId) => {
                      const labels = {
                        21: 'T-SHIRT',
                        36: 'HOODIE',
                        38: 'ZIP-UP',
                        56: 'LONG SLEEVE',
                        64: 'TANK TOP',
                        11: 'HAT',
                        400: 'CREWNECK',
                      };
                      return labels[categoryId] || 'APPAREL';
                    };

                    // Always try to load real images first, with graceful fallback
                    let imageUrl = getFallbackImage(categoryId); // Default fallback
                    let primaryImageUrl = null;

                    // Try to get real product images (both dev and production)
                    if (prod.styleImage) {
                      const ssImagePath = prod.styleImage;
                      // Use direct URL for now, proxy for production
                      primaryImageUrl =
                        typeof window !== 'undefined' &&
                        window.location.hostname === 'localhost'
                          ? `https://www.ssactivewear.com/${ssImagePath}`
                          : `/ss-images/${ssImagePath}`;
                    } else if (styleID) {
                      const imagePath = `Images/Style/${styleID}_fm.jpg`;
                      // Use direct URL for now, proxy for production
                      primaryImageUrl =
                        typeof window !== 'undefined' &&
                        window.location.hostname === 'localhost'
                          ? `https://www.ssactivewear.com/${imagePath}`
                          : `/ss-images/${imagePath}`;
                    }

                    // Use primary image if available, fallback will be handled by onError
                    if (primaryImageUrl) {
                      imageUrl = primaryImageUrl;
                    }

                    console.log(`Product ${index}:`, {
                      name,
                      brand,
                      styleID,
                      styleName,
                      imageUrl,
                    });

                    return (
                      <div
                        key={styleID || index}
                        className="product-card"
                        style={{
                          border: '3px solid #333',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          background: '#fff',
                          textAlign: 'center',
                          width: '100%',
                          maxWidth: '300px',
                          minHeight: '380px',
                          transition:
                            'transform 0.3s ease, box-shadow 0.3s ease',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Link
                          to={(() => {
                            const safeName = (name || styleName || '')
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/(^-|-$)+/g, '');
                            return styleID && safeName
                              ? `/products/${styleID}/${safeName}/`
                              : '/products/';
                          })()}
                          style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'block',
                          }}
                        >
                          {/* Custom placeholder for non-t-shirt categories */}
                          {categoryId !== 21 &&
                          categoryId !== '21' &&
                          imageUrl.includes('placeholder') ? (
                            <div
                              style={{
                                width: '220px',
                                height: '220px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                border: '2px solid #ddd',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                textAlign: 'center',
                                ...getCategoryPlaceholderStyle(categoryId),
                              }}
                            >
                              {getCategoryLabel(categoryId)}
                            </div>
                          ) : (
                            <img
                              src={imageUrl}
                              alt={name}
                              style={{
                                width: '220px',
                                height: '220px',
                                objectFit: 'contain',
                                background: '#f8f8f8',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                border: '2px solid #ddd',
                              }}
                              onError={(e) => {
                                console.log('Image failed to load:', imageUrl);

                                // If it's already a fallback image, don't try again
                                if (
                                  e.target.src.includes('mockup') ||
                                  e.target.src.includes('placeholder')
                                ) {
                                  e.target.style.backgroundColor = '#f0f0f0';
                                  return;
                                }

                                // First fallback: try category-specific mockup
                                const categoryFallback =
                                  getFallbackImage(categoryId);
                                if (
                                  !e.target.src.includes(
                                    categoryFallback.split('/').pop(),
                                  )
                                ) {
                                  e.target.src = categoryFallback;
                                  return;
                                }

                                // Final fallback: placeholder
                                e.target.src = '/images/placeholder.png';
                                e.target.style.backgroundColor = '#f0f0f0';
                              }}
                            />
                          )}

                          <h3
                            style={{
                              fontSize: '1.2rem',
                              fontWeight: 'bold',
                              color: '#333',
                              marginBottom: '0.5rem',
                              lineHeight: '1.3',
                              fontFamily: 'Arial, sans-serif',
                            }}
                          >
                            {name}
                          </h3>

                          <p
                            style={{
                              fontSize: '1rem',
                              color: '#666',
                              marginBottom: '0.5rem',
                              fontWeight: '600',
                            }}
                          >
                            {brand}
                          </p>

                          <p
                            style={{
                              fontSize: '0.9rem',
                              color: '#999',
                              margin: 0,
                              fontWeight: 'normal',
                            }}
                          >
                            Style: {styleName}
                          </p>
                        </Link>
                      </div>
                    );
                  },
                )}
              </div>
            </>
          )}

          {/* Pagination Controls */}
          {displayPagination.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '2rem',
                padding: '1rem',
                background: 'rgba(245, 245, 220, 0.1)',
                borderRadius: '8px',
                border: '1px solid #fff5d1',
              }}
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  background: currentPage === 1 ? '#666' : '#fff5d1',
                  color: currentPage === 1 ? '#999' : '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Previous
              </button>

              <span style={{ color: '#fff5d1', fontWeight: 'bold' }}>
                Page {currentPage} of {displayPagination.totalPages}
                {displayPagination.totalProducts > 0 && (
                  <span style={{ fontSize: '0.9rem', marginLeft: '0.5rem' }}>
                    ({displayPagination.totalProducts} total products)
                  </span>
                )}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(displayPagination.totalPages, prev + 1),
                  )
                }
                disabled={currentPage === displayPagination.totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  background:
                    currentPage === displayPagination.totalPages
                      ? '#666'
                      : '#fff5d1',
                  color:
                    currentPage === displayPagination.totalPages
                      ? '#999'
                      : '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor:
                    currentPage === displayPagination.totalPages
                      ? 'not-allowed'
                      : 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Next
              </button>
            </div>
          )}

          {/* Debug Info */}
          <details
            style={{ marginTop: '3rem', fontSize: '0.8rem', opacity: 0.7 }}
          >
            <summary style={{ color: '#fff5d1', cursor: 'pointer' }}>
              Debug Info
            </summary>
            <pre
              style={{
                background: 'rgba(0, 0, 0, 0.9)',
                color: '#fff5d1',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
                border: '1px solid #fff5d1',
              }}
            >
              Category ID: {categoryId}
              {'\n'}
              Category Slug: {categorySlug}
              {'\n'}
              Total Products: {products.length}
              {'\n'}
              Filtered Products: {filteredProducts.length}
              {'\n'}
              Current Page: {currentPage}
              {'\n'}
              Total Pages: {pagination.totalPages}
              {'\n'}
              Display Total Pages: {displayPagination.totalPages}
              {'\n'}
              Total Products (API): {pagination.totalProducts}
              {'\n'}
              Display Total Products: {displayPagination.totalProducts}
              {'\n'}
              Sample Product: {JSON.stringify(products[0], null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </>
  );
};

export default SimpleCategoryPage;
