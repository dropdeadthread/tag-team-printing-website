import React from "react";
import { Link } from "gatsby";
import Layout from "../components/Layout";
import { categoryLinks } from "../helpers/categoryHelpers";

const CategoriesPage = () => {
  const categoryIcons = {
    "t-shirts": "",
    "hoodies": "🧥", 
    "crewnecks": "👔",
    "zip-ups": "🧥",
    "long-sleeves": "👔",
    "headwear": "🧢",
    "tank-tops": "🎽"
  };

  return (
    <Layout>
      <div style={{ 
        paddingTop: "180px", // Account for header height
        paddingBottom: "3rem",
        color: "white", 
        textAlign: "center",
        minHeight: "100vh"
      }}>
        <h1 style={{ 
          color: "#fff5d1", 
          fontSize: "2.8rem", 
          marginBottom: "1rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          fontWeight: "bold"
        }}>
          Choose Your Canvas
        </h1>
        
        <p style={{
          color: "rgba(255, 245, 209, 0.9)",
          fontSize: "1.3rem",
          marginBottom: "2rem",
          textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
          maxWidth: "600px",
          margin: "0 auto 1.5rem auto"
        }}>
          Browse our premium blanks available for custom printing
        </p>
        
        {/* Quick Print Quote Button */}
        <div style={{ marginBottom: "3rem" }}>
          <Link 
            to="/order"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #ff5050 0%, #cc4040 100%)",
              color: "white",
              textDecoration: "none",
              padding: "1rem 2.5rem",
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderRadius: "12px",
              boxShadow: "0 6px 15px rgba(255,80,80,0.4)",
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 20px rgba(255,80,80,0.6)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 6px 15px rgba(255,80,80,0.4)";
            }}
          >
            Need Quick Print Quote?
          </Link>
          <p style={{
            color: "rgba(255, 245, 209, 0.7)",
            fontSize: "0.9rem",
            marginTop: "0.5rem",
            fontStyle: "italic"
          }}>
            For standard prints on basic garments
          </p>
        </div>
        
        {/* Grid layout for buttons in rows of 3 */}
        <div style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2rem",
          maxWidth: "900px", // Controls max width for 3 columns
          margin: "0 auto",
          padding: "0 2rem"
        }}>
          {categoryLinks.map(category => (
            <Link 
              key={category.slug}
              to={category.path}
              style={{ 
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff5d1", 
                fontSize: "1.4rem", 
                fontWeight: "bold",
                textDecoration: "none",
                border: "3px solid #fff5d1",
                padding: "1.5rem 1rem",
                borderRadius: "12px",
                cursor: "pointer",
                position: "relative",
                zIndex: 10,
                transition: "all 0.3s ease",
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                minHeight: "80px"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#fff5d1";
                e.target.style.color = "#000";
                e.target.style.transform = "translateY(-4px)";
                e.target.style.boxShadow = "0 8px 16px rgba(0,0,0,0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#fff5d1";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
              }}
            >
              <span style={{ marginRight: "0.5rem", fontSize: "1.8rem" }}>
                {categoryIcons[category.slug]}
              </span>
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesPage;
