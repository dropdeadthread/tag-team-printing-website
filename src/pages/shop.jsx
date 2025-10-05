import React from "react";
import Layout from "../components/Layout";
import "../styles/shop.css";

const placeholderProducts = [
  { id: 1, name: "TTP001", price: 15.99, image: "/images/mock-shirt.png", tier: "Good" },
  { id: 2, name: "TTP002", price: 19.99, image: "/images/mock-hoodie.png", tier: "Better" },
  { id: 3, name: "TTP003", price: 24.99, image: "/images/mock-longsleeve.png", tier: "Best" },
];

const ShopPage = () => {
  const tiers = {
    Good: placeholderProducts.filter(p => p.tier === "Good"),
    Better: placeholderProducts.filter(p => p.tier === "Better"),
    Best: placeholderProducts.filter(p => p.tier === "Best"),
  };

  return (
    <Layout>
      <div className="shop-wrapper">
        <h1 className="shop-header">Our Blanks</h1>
        <div className="tier-row">
          {Object.keys(tiers).map((tier) => (
            <div key={tier} className={`tier-column tier-${tier.toLowerCase()}`}>
              <h2>{tier}</h2>
              {tiers[tier].map((product) => (
                <div key={product.id} className="product-card-flip">
                  <div className="card-inner">
                    <div className="card-front">
                      <img src={product.image} alt={product.name} />
                      <h3>{product.name}</h3>
                    </div>
                    <div className="card-back">
                      <p>${product.price}</p>
                      <button>View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ShopPage;
