import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import SimpleCategoryPage from '../components/SimpleCategoryPage';

const CategoryTemplate = ({ pageContext }) => {
  const { categorySlug, categoryName, categoryId } = pageContext;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tagteamprints.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: 'https://tagteamprints.com/categories',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName || categorySlug,
        item: `https://tagteamprints.com/category/${categorySlug}`,
      },
    ],
  };

  return (
    <Layout>
      <Helmet>
        <title>
          {categoryName
            ? `${categoryName} | Tag Team Printing`
            : 'Shop | Tag Team Printing'}
        </title>
        <script type="application/ld+json">{`${JSON.stringify(breadcrumbSchema)}`}</script>
      </Helmet>
      <SimpleCategoryPage
        categorySlug={categorySlug}
        categoryName={categoryName}
        categoryId={categoryId}
      />
    </Layout>
  );
};

export default CategoryTemplate;
