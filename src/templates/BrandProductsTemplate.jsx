import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';

const BrandProductsTemplate = ({ data, pageContext }) => {
  const brandName = pageContext?.brandName || 'Brand';
  const brandLogoUrl = pageContext?.brandLogoUrl || null;
  const products = data?.allSsProduct?.nodes || [];

  return (
    <Layout>
      <SEO
        title={`${brandName} Products`}
        description={`Browse ${brandName} styles available for printing.`}
        canonicalPath={pageContext?.canonicalPath}
      />

      <div style={{ padding: '1rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1rem',
          }}
        >
          {brandLogoUrl && (
            <img
              src={brandLogoUrl}
              alt={`${brandName} logo`}
              loading="lazy"
              style={{ maxHeight: 60, width: 'auto' }}
            />
          )}
          <h1 style={{ margin: 0 }}>{brandName}</h1>
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.styleID || product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <p>No products found for this brand.</p>
        )}

        <div style={{ marginTop: '1.25rem' }}>
          <Link to="/products/">Back to Products</Link>
        </div>
      </div>
    </Layout>
  );
};

export default BrandProductsTemplate;

export const query = graphql`
  query BrandProducts($brandName: String!) {
    allSsProduct(
      filter: { brandName: { eq: $brandName } }
      sort: { title: ASC }
    ) {
      nodes {
        id
        styleID
        styleName
        brandName
        title
        description
        baseCategory
        categories
        styleImage
        brandImage
      }
    }
  }
`;
