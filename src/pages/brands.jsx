import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const slugify = (value) =>
  (value || '')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const getBrandLogoUrl = (brandImage) => {
  if (!brandImage) return null;
  const fileName = (brandImage.match(/[^/\\]+$/) || [null])[0];
  if (!fileName) return null;
  return `/images/Brands/${fileName}`;
};

const BrandsPage = ({ data }) => {
  const curatedBrands = new Set([
    'Gildan',
    'JERZEES',
    'BELLA + CANVAS',
    'Next Level',
    'Hanes',
    'Comfort Colors',
    'Threadfast Apparel',
    'M&O',
    'Richardson',
    'YP Classics',
    'Valucap',
  ]);

  const nodes = data?.allSsProduct?.nodes || [];
  const byBrand = new Map();

  nodes.forEach((p) => {
    const brandName = p?.brandName;
    if (!brandName || !curatedBrands.has(brandName)) return;
    if (byBrand.has(brandName)) return;
    byBrand.set(brandName, {
      brandName,
      brandSlug: slugify(brandName),
      brandLogoUrl: getBrandLogoUrl(p?.brandImage),
    });
  });

  const brands = Array.from(byBrand.values()).sort((a, b) =>
    a.brandName.localeCompare(b.brandName),
  );

  return (
    <Layout>
      <SEO
        title="Brands"
        description="Browse apparel brands available for printing."
        canonicalPath="/brands/"
      />

      <div style={{ padding: '1rem' }}>
        <h1 style={{ marginTop: 0 }}>Brands</h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
          }}
        >
          {brands.map((brand) => (
            <Link
              key={brand.brandName}
              to={`/brand/${brand.brandSlug}/`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              {brand.brandLogoUrl ? (
                <img
                  src={brand.brandLogoUrl}
                  alt={`${brand.brandName} logo`}
                  loading="lazy"
                  style={{ maxHeight: 42, width: 'auto' }}
                />
              ) : null}
              <span>{brand.brandName}</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BrandsPage;

export const query = graphql`
  query BrandsIndexPage {
    allSsProduct {
      nodes {
        brandName
        brandImage
      }
    }
  }
`;
