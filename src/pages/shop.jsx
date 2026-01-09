import React, { useState } from 'react';
import Layout from '../components/Layout';
import ShopQuoteCalculator from '../components/ShopQuoteCalculator';
import TShirtMockup from '../components/TShirtMockup';
import { OrderProvider, useOrder } from '../context/OrderContext';
import styled from 'styled-components';
import '../styles/shop.css';

// Sample products - these would come from your product data
const SHOP_PRODUCTS = [
  {
    id: 'gildan5000',
    brand: 'Gildan',
    styleName: '5000',
    title: 'Heavy Cotton™ T-Shirt',
    description: '5.3 oz./yd², 100% cotton classic fit tee',
    wholesalePrice: 2.5,
    tier: 'Good',
    colors: [
      { name: 'Black', value: 'black', hex: '#000000' },
      { name: 'White', value: 'white', hex: '#FFFFFF' },
      { name: 'Navy', value: 'navy', hex: '#1F2937' },
      { name: 'Forest Green', value: 'forest-green', hex: '#065F46' },
      { name: 'Cardinal Red', value: 'cardinal-red', hex: '#B91C1C' },
      { name: 'Royal Blue', value: 'royal-blue', hex: '#1D4ED8' },
      { name: 'Yellow', value: 'yellow', hex: '#FBBF24' },
    ],
  },
  {
    id: 'moGold',
    brand: 'M&O',
    styleName: '4800',
    title: 'Gold Soft Touch T-Shirt',
    description: '5 oz./yd², 100% preshrunk cotton jersey',
    wholesalePrice: 3.25,
    tier: 'Better',
    colors: [
      { name: 'Black', value: 'black', hex: '#000000' },
      { name: 'White', value: 'white', hex: '#FFFFFF' },
      { name: 'Navy', value: 'navy', hex: '#1F2937' },
      { name: 'Heather Grey', value: 'heather-grey', hex: '#6B7280' },
      { name: 'Military Green', value: 'military-green', hex: '#059669' },
      { name: 'Burgundy', value: 'burgundy', hex: '#7C2D12' },
      { name: 'Yellow', value: 'yellow', hex: '#FBBF24' },
    ],
  },
];

const placeholderProducts = [
  {
    id: 1,
    name: 'TTP001',
    price: 15.99,
    image: '/images/mock-shirt.png',
    tier: 'Good',
  },
  {
    id: 2,
    name: 'TTP002',
    price: 19.99,
    image: '/images/mock-hoodie.png',
    tier: 'Better',
  },
  {
    id: 3,
    name: 'TTP003',
    price: 24.99,
    image: '/images/mock-longsleeve.png',
    tier: 'Best',
  },
];

const PageContainer = styled.div`
  background: none;
  min-height: 100vh;
  padding: 8rem 2rem 2rem 2rem;
`;

const SectionDivider = styled.div`
  margin: 4rem 0;
  text-align: center;

  h2 {
    font-family: 'HawlersEightRough', 'Impact', sans-serif;
    font-size: 2.5rem;
    color: #2563eb;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 2px 2px 0px #000;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    color: #6b7280;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const QuoteSection = styled.div`
  max-width: 1600px;
  margin: 0 auto 4rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const QuoteCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid #2563eb;
`;

const QuoteHeader = styled.div`
  background: #2563eb;
  color: white;
  padding: 1.5rem;
  margin: -2rem -2rem 2rem -2rem;
  border-radius: 10px 10px 0 0;
  text-align: center;
  position: relative;

  h3 {
    font-family: 'HawlersEightRough', 'Impact', sans-serif;
    font-size: 1.8rem;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 2px 2px 0px #000;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    height: 10px;
    background: url('/images/torn-tape-rougher.png') repeat-x;
    background-size: auto 100%;
  }
`;

const MockupContainer = styled.div`
  background: rgba(255, 245, 209, 0.95);
  border-radius: 12px;
  padding: 2rem;
  border: 2px solid #2563eb;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const ProductCard = styled.div`
  background: white;
  border: 3px solid ${(props) => (props.$selected ? '#2563EB' : '#E5E7EB')};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #2563eb;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  }

  ${(props) =>
    props.$selected &&
    `
    &::before {
      content: '✓';
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #2563EB;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
  `}
`;

const ProductTitle = styled.h4`
  font-family: 'HawlersEightRough', sans-serif;
  color: #1f2937;
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
`;

const ColorSwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ColorSwatch = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${(props) => props.$hex};
  border: 3px solid ${(props) => (props.$selected ? '#2563EB' : '#E5E7EB')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    border-color: #2563eb;
  }

  ${(props) =>
    props.$selected &&
    `
    &::after {
      content: '✓';
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: ${props.$hex === '#FFFFFF' ? '#000' : '#fff'};
      font-weight: bold;
      font-size: 0.7rem;
    }
  `}
`;

const ConnectedMockup = ({
  selectedGarment: _selectedGarment,
  selectedColor,
}) => {
  const { printLocation, selectedArtwork } = useOrder();

  return (
    <MockupContainer>
      <TShirtMockup
        garmentColor={selectedColor || 'white'}
        printLocation={printLocation}
        artworkUrl={selectedArtwork}
        garmentStyle="basic-tee"
      />
    </MockupContainer>
  );
};

const ShopPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    // Auto-select first color when product is selected
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0].value);
    }
  };

  const tiers = {
    Good: placeholderProducts.filter((p) => p.tier === 'Good'),
    Better: placeholderProducts.filter((p) => p.tier === 'Better'),
    Best: placeholderProducts.filter((p) => p.tier === 'Best'),
  };

  return (
    <Layout>
      <PageContainer>
        {/* Screen Printing Quote Calculator Section */}
        <SectionDivider>
          <h2>🎨 Screen Printing Quote Calculator</h2>
          <p>
            Select a garment and color below, then get an instant quote for
            custom screen printing
          </p>
        </SectionDivider>

        {/* Product Selection */}
        <SectionDivider style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.8rem' }}>Step 1: Choose Your Garment</h3>
        </SectionDivider>

        <ProductGrid>
          {SHOP_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              $selected={selectedProduct?.id === product.id}
              onClick={() => handleProductSelect(product)}
            >
              <ProductTitle>
                {product.brand} {product.styleName}
              </ProductTitle>
              <p
                style={{
                  color: '#6b7280',
                  fontSize: '0.9rem',
                  margin: '0 0 1rem 0',
                }}
              >
                {product.description}
              </p>
              <div
                style={{
                  fontSize: '0.9rem',
                  color: '#059669',
                  fontWeight: '600',
                }}
              >
                From ${product.wholesalePrice.toFixed(2)} each + printing
              </div>

              {selectedProduct?.id === product.id && (
                <>
                  <div
                    style={{
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '2px solid #E5E7EB',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Select Color:
                    </p>
                    <ColorSwatchGrid>
                      {product.colors.map((color) => (
                        <ColorSwatch
                          key={color.value}
                          $hex={color.hex}
                          $selected={selectedColor === color.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedColor(color.value);
                          }}
                          title={color.name}
                        />
                      ))}
                    </ColorSwatchGrid>
                  </div>
                </>
              )}
            </ProductCard>
          ))}
        </ProductGrid>

        {/* Quote Calculator */}
        {selectedProduct && selectedColor && (
          <>
            <SectionDivider style={{ marginTop: '3rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.8rem' }}>Step 2: Get Your Quote</h3>
            </SectionDivider>

            <OrderProvider>
              <QuoteSection>
                <QuoteCard>
                  <QuoteHeader>
                    <h3>Live Preview</h3>
                  </QuoteHeader>
                  <ConnectedMockup
                    selectedGarment={selectedProduct}
                    selectedColor={selectedColor}
                  />
                </QuoteCard>

                <QuoteCard>
                  <QuoteHeader>
                    <h3>Quote Builder</h3>
                  </QuoteHeader>
                  <ShopQuoteCalculator
                    selectedGarment={selectedProduct}
                    selectedColor={selectedColor}
                  />
                </QuoteCard>
              </QuoteSection>
            </OrderProvider>
          </>
        )}

        {/* Browse Blank Garments Section */}
        <SectionDivider style={{ marginTop: '6rem' }}>
          <h2>📦 Browse Blank Garments</h2>
          <p>
            Explore our selection of quality blank apparel for other products
            like hats, hoodies, and more
          </p>
        </SectionDivider>

        <div className="shop-wrapper">
          <div className="tier-row">
            {Object.keys(tiers).map((tier) => (
              <div
                key={tier}
                className={`tier-column tier-${tier.toLowerCase()}`}
              >
                <h2>{tier}</h2>
                {tiers[tier].map((product) => (
                  <div key={product.id} className="product-card-flip">
                    <div className="card-inner">
                      <div className="card-front">
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                      </div>
                      <div className="card-back">
                        <p>${product.price}</p>
                        <button>View</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default ShopPage;
