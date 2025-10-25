import React, { useState, useEffect } from 'react';
import '../styles/printorderform.css';
import { calculatePrintQuote } from '../helpers/calculatePrintQuote';

const PrintOrderForm = () => {
  const [shirtCount, setShirtCount] = useState(15);
  const [numColors, setNumColors] = useState(1);
  const [hasUnderbase, setHasUnderbase] = useState(true);
  const [notes, setNotes] = useState('');
  const [artFile, setArtFile] = useState(null);
  const [error, setError] = useState('');
  const [quote, setQuote] = useState(null);
  const [status, setStatus] = useState('');

  // New garment source selection
  const [garmentSource, setGarmentSource] = useState('recommend'); // 'recommend' or 'own'
  const [recommendedColor, setRecommendedColor] = useState('black');
  const [, setGarmentType] = useState('tee'); // 'tee', 'hoodie', etc. - only setter used
  const [warning, setWarning] = useState('');

  // Handle garment source change
  const handleGarmentSourceChange = (source) => {
    setGarmentSource(source);
    if (source === 'recommend') {
      setGarmentType('tee');
      setWarning('');
    }
  };

  // Recalculate quote anytime inputs change
  useEffect(() => {
    const garmentData =
      garmentSource === 'recommend'
        ? {
            garmentColor: recommendedColor,
            garmentWholesalePrice: 2.5, // Gildan 5000 wholesale price
          }
        : {
            // For own blanks, use a neutral default - customer will specify details in notes
            garmentColor: 'unknown',
            garmentWholesalePrice: null,
          };

    const result = calculatePrintQuote({
      garmentQty: shirtCount,
      colorCount: numColors,
      needsUnderbase: hasUnderbase,
      inkColors: [], // We don't collect specific ink colors in this form yet
      ...garmentData,
    });

    if (result.valid) {
      setQuote(result);
      setError('');
    } else {
      setQuote(null);
    }
  }, [shirtCount, numColors, hasUnderbase, garmentSource, recommendedColor]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (warning) {
      setError(
        'Please resolve garment compatibility issues before submitting.',
      );
      return;
    }

    const garmentData =
      garmentSource === 'recommend'
        ? {
            garmentColor: recommendedColor,
            garmentWholesalePrice: 2.5, // Gildan 5000 wholesale price
          }
        : {
            garmentColor: 'unknown',
            garmentWholesalePrice: null,
          };

    const result = calculatePrintQuote({
      garmentQty: shirtCount,
      colorCount: numColors,
      needsUnderbase: hasUnderbase,
      inkColors: [],
      ...garmentData,
    });

    if (!result.valid) {
      setError(result.message);
      return;
    }

    setError('');
    setStatus('Submitting...');

    // Prepare form data for backend (including file)
    const formData = new FormData();
    formData.append('shirtCount', shirtCount);
    formData.append('numColors', numColors);
    formData.append('hasUnderbase', hasUnderbase);
    formData.append('garmentSource', garmentSource);
    if (garmentSource === 'recommend') {
      formData.append('recommendedColor', recommendedColor);
      formData.append('garmentType', 'Gildan 5000 T-Shirt');
    }
    formData.append('notes', notes);
    formData.append('quote', JSON.stringify(quote));
    if (artFile) formData.append('artFile', artFile);

    try {
      const res = await fetch('/api/print-order.js', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setStatus('Order submitted! We’ll follow up to confirm your details.');
        setShirtCount(15);
        setNumColors(1);
        setHasUnderbase(true);
        setGarmentSource('recommend');
        setRecommendedColor('black');
        setGarmentType('tee');
        setWarning('');
        setNotes('');
        setArtFile(null);
      } else {
        setStatus('Submission failed. Please try again.');
      }
    } catch (err) {
      setStatus('Submission failed. Please try again.');
    }
  };

  return (
    <form className="print-order-form" onSubmit={handleSubmit}>
      <h2>Tag Team Print Quote</h2>

      {/* Garment Source Selection */}
      <div className="garment-source-section">
        <h3>Choose Your Garments</h3>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              value="recommend"
              checked={garmentSource === 'recommend'}
              onChange={() => handleGarmentSourceChange('recommend')}
            />
            <span>Recommend a standard tee (Gildan 5000)</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              value="own"
              checked={garmentSource === 'own'}
              onChange={() => handleGarmentSourceChange('own')}
            />
            <span>I&apos;ll choose my own blanks from your catalog</span>
          </label>
        </div>

        {/* Recommended Tee Options */}
        {garmentSource === 'recommend' && (
          <div className="recommended-options">
            <h4>Gildan 5000 - Heavy Cotton T-Shirt</h4>
            <p className="garment-description">
              Pre-shrunk 100% cotton, classic fit. Perfect for most print jobs.
            </p>
            <label>
              Choose Color:
              <select
                value={recommendedColor}
                onChange={(e) => setRecommendedColor(e.target.value)}
                className="color-selector"
              >
                <option value="black">⚫ Black</option>
                <option value="white">⚪ White</option>
              </select>
            </label>
            <div className="price-preview">
              Estimated garment cost: $6.25 each
            </div>
          </div>
        )}

        {/* Own Blanks Notice */}
        {garmentSource === 'own' && (
          <div className="own-blanks-notice">
            <p>
              ✨ Browse our <a href="/categories">catalog</a> to select your
              garments first.
            </p>
            <p>
              Then return here to get your print quote. Garment costs will be
              calculated separately.
            </p>
          </div>
        )}
      </div>

      {warning && <div className="warning-box">{warning}</div>}

      <label>
        Total Shirts Ordered
        <span
          className="info-tooltip"
          title="Minimum 15 shirts for 1 color, 30 for 2+ colors."
        >
          ℹ️
        </span>
        <input
          type="number"
          min="1"
          value={shirtCount}
          onChange={(e) => setShirtCount(parseInt(e.target.value))}
        />
      </label>

      <label>
        How many print colors?
        <span
          className="info-tooltip"
          title="Each ink counts as a color. Underbase adds 1 if needed."
        >
          ℹ️
        </span>
        <select
          value={numColors}
          onChange={(e) => setNumColors(parseInt(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <label className="toggle-option">
        <input
          type="checkbox"
          checked={hasUnderbase}
          onChange={() => setHasUnderbase(!hasUnderbase)}
        />
        Include White Underbase
        <span
          className="info-tooltip"
          title="Usually required on dark garments, and white-on-black prints."
        >
          ℹ️
        </span>
      </label>

      <label>
        Upload Artwork (.png, .ai, .psd, .pdf)
        <input
          type="file"
          accept=".png,.ai,.psd,.pdf"
          onChange={(e) => setArtFile(e.target.files[0])}
        />
      </label>

      <label>
        Additional Notes
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Mention desired print size and location, expected print colors, etc."
        />
      </label>

      {error && <p className="error">{error}</p>}

      {quote && (
        <div className="quote-box">
          <h3>Estimated Quote</h3>
          <p>
            Garments ({quote.garmentQty} × ${quote.garmentCostPerShirt}): $
            {(quote.garmentQty * quote.garmentCostPerShirt).toFixed(2)}
          </p>
          <p>
            Printing ({quote.garmentQty} × $
            {(quote.printingCostPerShirt - quote.garmentCostPerShirt).toFixed(
              2,
            )}
            ): $
            {(
              quote.garmentQty *
              (quote.printingCostPerShirt - quote.garmentCostPerShirt)
            ).toFixed(2)}
          </p>
          <p>
            Set-up Fees ({quote.screenBreakdown}): ${quote.setupTotal}
          </p>
          <p>Subtotal: ${quote.subtotal}</p>
          <p>Tax (HST): ${(quote.totalWithTax - quote.subtotal).toFixed(2)}</p>
          <p className="grand-total">Total: ${quote.totalWithTax}</p>
        </div>
      )}

      <label className="confirm-box">
        <input type="checkbox" required />I confirm the above details and
        understand minimums apply.
      </label>

      <button type="submit">Submit Print Order</button>
      {status && <p className="status">{status}</p>}
    </form>
  );
};

export default PrintOrderForm;
