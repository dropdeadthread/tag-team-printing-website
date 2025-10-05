import React from "react";
import { graphql } from "gatsby";
import { Link } from "gatsby";
import Layout from "../components/Layout";

const BrandPageTemplate = ({ data, pageContext }) => {
  // Since GraphQL query was removed, products will be empty
  // This template is not currently used in page creation
  const products = data?.allProductsJson?.nodes || [];

  return (
    <Layout>
      <div>
        <h1>{pageContext.brand || "Unknown Brand"}</h1>
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.Slug}>
            <Link to={`/products/${product.Slug}`}>
              {product.Name || "Unnamed product"}
            </Link>
          </div>
        ))
      ) : (
        <p>No products available for this brand.</p>
      )}
    </div>
    </Layout>
  );
};

// GraphQL query removed - this template is no longer used as a page component
// Brand pages would use API calls if implemented

export default BrandPageTemplate;
