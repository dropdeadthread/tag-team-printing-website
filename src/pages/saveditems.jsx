// src/pages/saveditems.jsx
import React, { useContext } from 'react';
import { Link } from 'gatsby';
import Layout from '../components/Layout';
import { WishlistContext } from '../context/WishlistContext';

const slugify = (value) =>
  (value || '')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const SavedItems = () => {
  // Fixed 2026-09-15: this page used to read/write its own separate `savedItems`
  // localStorage key directly, but nothing anywhere in the site ever wrote an item INTO it
  // (no heart/save icon existed on any product) -- this page's own Remove button was the
  // only thing that ever touched that key, and only to shrink it. Now reads from the real,
  // shared WishlistContext that the new heart button on ProductCard/product pages writes to.
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);

  return (
    <Layout>
      <div
        style={{
          padding: '2rem',
          fontFamily: 'var(--font-tecnica)',
          textAlign: 'center',
        }}
      >
        <h1>Saved Items</h1>

        {wishlistItems.length === 0 ? (
          <p style={{ marginTop: '2rem' }}>
            No items saved yet. Go haunt the shop!
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginTop: '2rem',
              maxWidth: '1000px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {wishlistItems.map((product) => (
              <div
                key={product.styleID}
                style={{
                  background: '#fff5d1',
                  border: '3px solid black',
                  padding: '1rem',
                  textAlign: 'center',
                  boxShadow: '5px 5px 0px black',
                }}
              >
                <Link
                  to={`/products/${product.styleID}/${slugify(product.name)}/`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: 'auto',
                        marginBottom: '1rem',
                        border: '2px solid black',
                      }}
                    />
                  )}
                  <h3 style={{ marginBottom: '0.5rem' }}>{product.name}</h3>
                  {product.brand && (
                    <p style={{ marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                      {product.brand}
                    </p>
                  )}
                </Link>
                {product.price && (
                  <p style={{ marginBottom: '1rem' }}>
                    ${Number(product.price).toFixed(2)}
                  </p>
                )}
                <button
                  onClick={() => removeFromWishlist(product.styleID)}
                  style={{
                    backgroundColor: '#ff5050',
                    color: 'black',
                    border: '2px solid black',
                    padding: '0.5rem 1rem',
                    fontFamily: 'var(--font-rueda)',
                    cursor: 'pointer',
                    boxShadow: '3px 3px 0px black',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SavedItems;
