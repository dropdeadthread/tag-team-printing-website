import React, { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';

// Self-contained (inline styles, no external CSS dependency) so it drops cleanly into both
// ProductCard.jsx (its own CSS module) and SimpleProductPageTemplate.jsx (pure inline
// styles) without fighting either page's styling convention.
const WishlistButton = ({ product, size = 'md', className }) => {
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  if (!product?.styleID) return null;

  const saved = isInWishlist(product.styleID);
  const dimension = size === 'lg' ? 44 : 34;
  const fontSize = size === 'lg' ? '1.4rem' : '1.1rem';

  const handleClick = (e) => {
    // Prevent the click from also triggering a wrapping <Link> (ProductCard) or any parent
    // click handler.
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? 'Remove from saved items' : 'Save for later'}
      aria-pressed={saved}
      title={saved ? 'Remove from saved items' : 'Save for later'}
      className={className}
      style={{
        width: `${dimension}px`,
        height: `${dimension}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: saved ? '2px solid #ff5050' : '2px solid rgba(0,0,0,0.15)',
        background: saved ? '#ff5050' : 'rgba(255,255,255,0.95)',
        color: saved ? '#fff' : '#333',
        cursor: 'pointer',
        fontSize,
        lineHeight: 1,
        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        transition: 'all 0.15s ease',
        flexShrink: 0,
      }}
    >
      {saved ? '♥' : '♡'}
    </button>
  );
};

export default WishlistButton;
