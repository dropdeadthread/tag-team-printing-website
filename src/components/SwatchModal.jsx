import React, { useEffect, useRef } from 'react';
import '../styles/sizechartmodal.css';

const SwatchModal = ({ isOpen, onClose, swatches = [] }) => {
  const closeBtnRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    closeBtnRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && modalRef.current) {
        const focusableEls = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop modal-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="swatch-modal-title"
    >
      <div
        className="modal-box modal-animate-in"
        onClick={e => e.stopPropagation()}
        ref={modalRef}
      >
        <h2 id="swatch-modal-title">🎨 Colour Options</h2>
        {swatches.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5em", justifyContent: "center" }}>
            {swatches.map((swatch, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                {swatch.swatchImg ? (
                  <img
                    src={swatch.swatchImg}
                    alt={swatch.name}
                    style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #ccc" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: swatch.hex || "#eee",
                      border: "1px solid #ccc",
                      margin: "0 auto"
                    }}
                    title={swatch.name}
                    aria-label={swatch.name}
                  />
                )}
                <div style={{ fontSize: "0.85em", marginTop: 2 }}>{swatch.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>This is placeholder swatch preview info.</p>
        )}
        <button
          className="modal-close"
          onClick={onClose}
          ref={closeBtnRef}
          aria-label="Close swatch modal"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SwatchModal;