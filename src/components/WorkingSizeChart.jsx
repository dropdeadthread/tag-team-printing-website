import React, { useState } from 'react';

const WorkingSizeChart = ({ product, inventoryData, selectedColor }) => {
  const [showModal, setShowModal] = useState(false);

  if (!inventoryData?.sizes) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '1rem',
          fontWeight: 'bold',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
        onMouseOver={(e) => {
          e.target.style.background = '#0056b3';
          e.target.style.transform = 'translateY(-1px)';
        }}
        onFocus={(e) => {
          e.target.style.background = '#0056b3';
          e.target.style.transform = 'translateY(-1px)';
        }}
        onMouseOut={(e) => {
          e.target.style.background = '#007bff';
          e.target.style.transform = 'translateY(0)';
        }}
        onBlur={(e) => {
          e.target.style.background = '#007bff';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        📏 Size Chart
      </button>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                borderBottom: '2px solid #f0f0f0',
                paddingBottom: '1rem',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: '#333',
                  fontSize: '1.5rem',
                }}
              >
                📏 Size Chart
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ color: '#333' }}>
              <h3
                style={{
                  marginBottom: '1rem',
                  color: '#333',
                  fontSize: '1.2rem',
                }}
              >
                {product.title}
              </h3>

              <div
                style={{
                  background: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  border: '1px solid #dee2e6',
                }}
              >
                <div>
                  <strong>Brand:</strong> {product.brandName}
                </div>
                <div>
                  <strong>Style:</strong> {product.styleName}
                </div>
                <div>
                  <strong>Category:</strong> {product.baseCategory}
                </div>
              </div>

              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginBottom: '1rem',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th
                      style={{
                        padding: '0.75rem',
                        textAlign: 'left',
                        border: '1px solid #dee2e6',
                        fontWeight: 'bold',
                        color: '#333',
                      }}
                    >
                      Size
                    </th>
                    <th
                      style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        border: '1px solid #dee2e6',
                        fontWeight: 'bold',
                        color: '#333',
                      }}
                    >
                      Chest (in)
                    </th>
                    <th
                      style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        border: '1px solid #dee2e6',
                        fontWeight: 'bold',
                        color: '#333',
                      }}
                    >
                      Length (in)
                    </th>
                    <th
                      style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        border: '1px solid #dee2e6',
                        fontWeight: 'bold',
                        color: '#333',
                      }}
                    >
                      Sleeve (in)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedColor?.sizes ? (
                    Object.keys(selectedColor.sizes).map((size) => {
                      // Standard t-shirt measurements (approximate)
                      const measurements = {
                        XS: { chest: '31-34', length: '27', sleeve: '8.5' },
                        S: { chest: '34-37', length: '28', sleeve: '9' },
                        M: { chest: '38-41', length: '29', sleeve: '9.5' },
                        L: { chest: '42-45', length: '30', sleeve: '10' },
                        XL: { chest: '46-49', length: '31', sleeve: '10.5' },
                        '2XL': { chest: '50-53', length: '32', sleeve: '11' },
                        '3XL': { chest: '54-57', length: '33', sleeve: '11.5' },
                        '4XL': { chest: '58-61', length: '34', sleeve: '12' },
                        '5XL': { chest: '62-65', length: '35', sleeve: '12.5' },
                      };
                      const sizeData = measurements[size] || {
                        chest: 'N/A',
                        length: 'N/A',
                        sleeve: 'N/A',
                      };

                      return (
                        <tr key={size} style={{ backgroundColor: 'white' }}>
                          <td
                            style={{
                              padding: '0.75rem',
                              border: '1px solid #dee2e6',
                              fontWeight: 'bold',
                              color: '#333',
                            }}
                          >
                            {size}
                          </td>
                          <td
                            style={{
                              padding: '0.75rem',
                              border: '1px solid #dee2e6',
                              textAlign: 'center',
                              color: '#333',
                            }}
                          >
                            {sizeData.chest}
                          </td>
                          <td
                            style={{
                              padding: '0.75rem',
                              border: '1px solid #dee2e6',
                              textAlign: 'center',
                              color: '#333',
                            }}
                          >
                            {sizeData.length}
                          </td>
                          <td
                            style={{
                              padding: '0.75rem',
                              border: '1px solid #dee2e6',
                              textAlign: 'center',
                              color: '#333',
                            }}
                          >
                            {sizeData.sleeve}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          textAlign: 'center',
                          padding: '1rem',
                          fontStyle: 'italic',
                        }}
                      >
                        Select a color to see size measurements
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div
                style={{
                  background: '#e8f5e8',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #c8e6c8',
                  marginBottom: '1rem',
                }}
              >
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>
                  � How to Measure
                </h4>
                <div
                  style={{
                    fontSize: '0.9rem',
                    color: '#333',
                    lineHeight: '1.6',
                  }}
                >
                  <div>
                    <strong>Chest:</strong> Measure around the fullest part of
                    your chest, keeping the tape horizontal.
                  </div>
                  <div>
                    <strong>Length:</strong> Measure from the highest point of
                    the shoulder to the bottom hem.
                  </div>
                  <div>
                    <strong>Sleeve:</strong> Measure from the center back neck
                    to the end of the sleeve.
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: '#fff3cd',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #ffeaa7',
                }}
              >
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>
                  ℹ️ Size Guide Notes
                </h4>
                <div
                  style={{
                    fontSize: '0.9rem',
                    color: '#333',
                    lineHeight: '1.6',
                  }}
                >
                  <div>
                    • Measurements are approximate and may vary by ±1 inch
                  </div>
                  <div>
                    • For between sizes, we recommend sizing up for comfort
                  </div>
                  <div>• Contact us for specific brand sizing questions</div>
                  {product.sustainableStyle && (
                    <div
                      style={{
                        color: '#388e3c',
                        fontWeight: 'bold',
                        marginTop: '0.5rem',
                      }}
                    >
                      🌱 This is a sustainable product
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkingSizeChart;
