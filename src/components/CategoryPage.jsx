import { useEffect, useState } from 'react';
import { useParams } from '@reach/router';
import Layout from './Layout';
import categoryIdSlugMap from '../helpers/categoryIdSlugMap';
import { getProductImageUrl } from '../helpers/imageHelpers';

const CategoryPage = ({
  categorySlug: propCategorySlug,
  categoryName: propCategoryName,
  categoryId: propCategoryId,
}) => {
  const routeParams = useParams();

  const categorySlug = propCategorySlug || routeParams?.categorySlug;
  const categoryName =
    propCategoryName || (categorySlug ? categorySlug.replace(/-/g, ' ') : '');
  const categoryID = propCategoryId || categoryIdSlugMap[categorySlug];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryID) {
      setError('Category not found');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/.netlify/functions/list-products?category=${categoryID}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Products loaded successfully
        // Handle both array format (legacy) and object format (Netlify function)
        const productsArray = Array.isArray(data) ? data : data.products || [];
        setProducts(productsArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setProducts([]);
        setLoading(false);
      });
  }, [categoryID]);

  const content = (
    <>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {loading && <p>Loading products...</p>}
      {!loading && !error && !products.length && (
        <p>No products found in this category.</p>
      )}
      {!loading && !error && products.length > 0 && (
        <>
          <h1 style={{ color: '#fff5d1', marginBottom: '2rem' }}>
            {categoryName || `Products in ${categorySlug?.replace(/-/g, ' ')}`}
          </h1>
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              listStyle: 'none',
              padding: 0,
            }}
          >
            {products.map((prod) => {
              const name = prod.title || prod.styleName || prod.Name || '';
              const brand = prod.brandName || prod.BrandName || '';
              const styleID = prod.styleID || prod.StyleID || '';
              const styleName = prod.styleName || prod.styleCode || ''; // Use styleName as primary

              // Create proper URL slug from product name
              const slug = (name || styleName)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

              // Creating product link

              return (
                <li
                  key={styleID || Math.random()}
                  style={{ width: 220, textAlign: 'center' }}
                >
                  <Link
                    to={`/products/${styleID}/${slug}/`}
                    className="product-link"
                  >
                    <img
                      src={getProductImageUrl(prod.styleImage, styleName)}
                      alt={name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                      style={{
                        width: 200,
                        height: 200,
                        objectFit: 'contain',
                        background: '#f8f8f8',
                        borderRadius: 8,
                      }}
                      loading="lazy"
                    />
                    <div
                      style={{
                        marginTop: 8,
                        fontWeight: 'bold',
                        color: '#fff5d1',
                      }}
                    >
                      {name}
                    </div>
                    <div style={{ fontSize: 14, color: '#ccc' }}>{brand}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      Style: {styleName}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );

  if (propCategorySlug) {
    return content;
  }

  return <Layout>{content}</Layout>;
};

export default CategoryPage;
