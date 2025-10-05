// src/components/SizeChart.jsx
import React, { useState, useEffect } from "react";

const SizeChart = ({ brandName }) => {
  const [sizeChart, setSizeChart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load size chart data
    const loadSizeChart = async () => {
      try {
        const response = await fetch('/data/sizeCharts.json');
        const data = await response.json();
        
        // Get chart for specific brand or default
        const chart = data[brandName] || data['default'];
        setSizeChart(chart);
        setLoading(false);
      } catch (error) {
        console.error('Error loading size chart:', error);
        setLoading(false);
      }
    };

    loadSizeChart();
  }, [brandName]);

  if (loading) return <p>Loading size chart...</p>;
  if (!sizeChart) return <p>No size chart available.</p>;

  const adultSizes = sizeChart.adult?.sizes || [];

  return (
    <div style={{ 
      marginTop: "2rem", 
      background: "#111", 
      padding: "1rem", 
      border: "2px solid #fff5d1", 
      borderRadius: "8px" 
    }}>
      <h3 style={{ 
        fontFamily: "LuchitaPayolTecnica", 
        color: "#ff5050",
        marginBottom: "1rem" 
      }}>
        📏 Size Chart - {brandName || 'Standard'}
      </h3>
      
      {adultSizes.length > 0 && (
        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse", 
          color: "#fff5d1" 
        }}>
          <thead>
            <tr>
              <th style={{ 
                borderBottom: "1px solid #fff5d1", 
                paddingBottom: "0.5rem", 
                fontFamily: "monospace",
                textAlign: "center"
              }}>
                Size
              </th>
              <th style={{ 
                borderBottom: "1px solid #fff5d1", 
                paddingBottom: "0.5rem", 
                fontFamily: "monospace",
                textAlign: "center"
              }}>
                Chest (inches)
              </th>
              <th style={{ 
                borderBottom: "1px solid #fff5d1", 
                paddingBottom: "0.5rem", 
                fontFamily: "monospace",
                textAlign: "center"
              }}>
                Length (inches)
              </th>
            </tr>
          </thead>
          <tbody>
            {adultSizes.map((sizeData, idx) => (
              <tr key={idx}>
                <td style={{ 
                  padding: "0.5rem", 
                  textAlign: "center", 
                  fontFamily: "monospace",
                  fontWeight: "bold"
                }}>
                  {sizeData.size}
                </td>
                <td style={{ 
                  padding: "0.5rem", 
                  textAlign: "center", 
                  fontFamily: "monospace" 
                }}>
                  {sizeData.chest}
                </td>
                <td style={{ 
                  padding: "0.5rem", 
                  textAlign: "center", 
                  fontFamily: "monospace" 
                }}>
                  {sizeData.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <p style={{ 
        marginTop: "1rem", 
        fontSize: "0.9rem", 
        color: "#fff5d1",
        opacity: 0.8 
      }}>
        * Measurements are approximate and may vary by style
      </p>
    </div>
  );
};

export default SizeChart;
