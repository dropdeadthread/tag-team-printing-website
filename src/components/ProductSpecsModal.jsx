import React, { useEffect, useRef } from 'react';
import '../styles/productspecsmodal.css';

const ProductSpecsModal = ({
  isOpen,
  onClose,
  product,
  inventoryData,
  selectedColor,
}) => {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Focus management and escape key handling
  useEffect(() => {
    if (!isOpen) return;

    closeBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableEls = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Parse HTML description to extract key specifications
  const extractSpecs = (description) => {
    if (!description) return [];

    // Remove HTML tags and extract bullet points
    const textOnly = description.replace(/<[^>]*>/g, '');
    const bullets = textOnly
      .split('•')
      .filter((item) => item.trim().length > 0);

    return bullets.map((item) => item.trim()).slice(0, 8); // Limit to 8 specs
  };

  const specs = extractSpecs(product?.description);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className="specs-modal-backdrop"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      role="dialog"
      tabIndex={-1}
      aria-modal="true"
      aria-labelledby="specs-modal-title"
    >
      <div
        className="specs-modal-card"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="specs-modal-header">
          <h2 id="specs-modal-title">Product Specifications</h2>
          <button
            className="specs-modal-close"
            onClick={onClose}
            ref={closeBtnRef}
            aria-label="Close specifications modal"
          >
            ✕
          </button>
        </div>

        <div className="specs-modal-content">
          {/* Product Basic Info */}
          <div className="specs-section">
            <h3>Product Details</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Style ID:</span>
                <span className="spec-value">{product?.styleID}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Style Name:</span>
                <span className="spec-value">{product?.styleName}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Brand:</span>
                <span className="spec-value">{product?.brandName}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Category:</span>
                <span className="spec-value">{product?.baseCategory}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Part Number:</span>
                <span className="spec-value">{product?.partNumber}</span>
              </div>
              {product?.sustainableStyle && (
                <div className="spec-item">
                  <span className="spec-label">Sustainable:</span>
                  <span className="spec-value">✓ Eco-Friendly</span>
                </div>
              )}
              {inventoryData?.totalStock && (
                <div className="spec-item">
                  <span className="spec-label">Stock:</span>
                  <span className="spec-value">
                    {inventoryData.totalStock} available
                    {inventoryData.lowStock && (
                      <span className="low-stock-indicator"> (Low Stock)</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Material & Construction Specs */}
          {specs.length > 0 && (
            <div className="specs-section">
              <h3>Material & Construction</h3>
              <ul className="specs-list">
                {specs.map((spec, index) => (
                  <li key={index} className="spec-list-item">
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Size & Pricing Table */}
          {inventoryData?.sizes && (
            <div className="specs-section">
              <h3>Sizing & Pricing</h3>
              <div className="sizing-table">
                <div className="sizing-header">
                  <span>Size</span>
                  <span>Stock</span>
                  <span>Price</span>
                </div>
                {selectedColor?.sizes ? (
                  Object.entries(selectedColor.sizes).map(([size, data]) => (
                    <div
                      key={size}
                      className={`sizing-row ${data.available === 0 ? 'out-of-stock' : ''}`}
                    >
                      <span className="size-name">{size}</span>
                      <span className="size-stock">
                        {data.available > 0 ? data.available : 'Out'}
                      </span>
                      <span className="size-price">
                        ${data.price?.toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="sizing-row">
                    <span>Select a color to see size availability</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="specs-modal-footer">
          <button className="specs-close-btn" onClick={onClose}>
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecsModal;
