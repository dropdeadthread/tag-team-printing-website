// src/components/SizeChartModal.jsx
import React, { useEffect, useRef } from 'react';
import SizeChart from './SizeChart';
import '../styles/sizechartmodal.css';

const SizeChartModal = ({ isOpen, onClose, brandName }) => {
  const closeBtnRef = useRef(null);
  const modalRef = useRef(null);

  // Focus trap and Escape key
  useEffect(() => {
    if (!isOpen) return;

    // Focus the close button on open
    closeBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      // Focus trap
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
      aria-labelledby="sizechart-modal-title"
    >
      <div
        className="modal-box modal-animate-in"
        onClick={e => e.stopPropagation()}
        ref={modalRef}
      >
        <h2 id="sizechart-modal-title">📏 Size Chart</h2>
        <SizeChart brandName={brandName} />
        <button
          className="modal-close"
          onClick={onClose}
          ref={closeBtnRef}
          aria-label="Close size chart modal"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SizeChartModal;
