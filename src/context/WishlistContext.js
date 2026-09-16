// src/context/WishlistContext.js
//
// Mirrors CartContext.js's localStorage-backed pattern. The site's own backend wishlist
// functions (src/api/add-wishlist-item.js etc.) were evaluated and rejected as a foundation
// for this: they write to a local JSON file on disk, which doesn't survive between
// invocations in Netlify's stateless Functions environment (the same class of bug already
// found and fixed in streamlined-order.js) -- so they were never usable in production.
// The cart already proves the anonymous, no-login, localStorage-based approach works for a
// "save this for later" action on this site.
import React, { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tagteam_wishlist');
      if (saved) {
        try {
          setWishlistItems(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading wishlist from localStorage:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tagteam_wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems]);

  const isInWishlist = (styleID) =>
    wishlistItems.some((item) => String(item.styleID) === String(styleID));

  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      if (
        prevItems.some(
          (item) => String(item.styleID) === String(product.styleID),
        )
      ) {
        return prevItems;
      }
      return [
        ...prevItems,
        {
          styleID: product.styleID,
          name: product.name || 'Product',
          brand: product.brand || '',
          price: product.price || null,
          image: product.image || null,
        },
      ];
    });
  };

  const removeFromWishlist = (styleID) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => String(item.styleID) !== String(styleID)),
    );
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.styleID)) {
      removeFromWishlist(product.styleID);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
