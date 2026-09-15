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

// Mapping of brand names to their logo filenames in static/images/Brands/
const brandLogoMap = {
  'threadfast apparel': '272_fm.jpg',
  'bella + canvas': '5_fm.jpg',
  'comfort colors': '8_fm.jpg',
  jerzees: '23_fm.jpg',
  'next level': '123_fm.jpg',
  gildan: '35_fm.jpg', // Also have 73_fm.jpg as alternative
  valucap: '70_fm.jpg',
  'm&o': '169_fm.jpg',
  'yp classics': '71_fm.jpg',
  richardson: '138_fm.jpg',
};

const getBrandLogoUrl = (brandName) => {
  if (!brandName) return null;
  const normalizedBrand = brandName.toLowerCase();
  const fileName = brandLogoMap[normalizedBrand];
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
      brandLogoUrl: getBrandLogoUrl(brandName),
    });
  });

  const brands = Array.from(byBrand.values()).sort((a, b) =>
    a.brandName.localeCompare(b.brandName),
  );

  return (
    <Layout>
      <SEO
        title="Apparel Brands | Tag Team Printing Cornwall"
        description="Browse the wholesale apparel brands we print on — Gildan, Next Level, Bella+Canvas, Comfort Colors, AS Colour, and more. Available for custom screen printing and DTF."
        url="/brands"
      />

      <div className="brands-page-wrapper">
        <div className="brands-page-header">
          <h1 className="brands-page-title">Apparel Brands</h1>
          <p className="brands-page-desc">
            We print on quality wholesale blanks sourced through S&amp;S
            Activewear and SanMar. Browse our available brands below — click any
            brand to see styles and colours.
          </p>
        </div>

        <div className="brands-grid">
          {brands.map((brand) => (
            <Link
              key={brand.brandName}
              to={`/brand/${brand.brandSlug}/`}
              className="brand-card"
            >
              {brand.brandLogoUrl ? (
                <img
                  src={brand.brandLogoUrl}
                  alt={`${brand.brandName} logo`}
                  loading="lazy"
                  className="brand-card-logo"
                />
              ) : null}
              <span className="brand-card-name">{brand.brandName}</span>
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
      }
    }
  }
`;
