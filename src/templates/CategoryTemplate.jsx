import React from "react";
import Layout from "../components/Layout";
import SimpleCategoryPage from "../components/SimpleCategoryPage";

const CategoryTemplate = ({ pageContext }) => {
  const { categorySlug, categoryName, categoryId } = pageContext;
  
  return (
    <Layout>
      <SimpleCategoryPage 
        categorySlug={categorySlug}
        categoryName={categoryName}
        categoryId={categoryId}
      />
    </Layout>
  );
};

export default CategoryTemplate;
