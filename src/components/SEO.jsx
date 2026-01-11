import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({
  title = 'Tag Team Printing',
  description = 'Custom screen printing and apparel services for your business, event, or organization.',
  image = '/images/logo.png',
  url = '',
  keywords = 'screen printing, custom apparel, t-shirts, business apparel, event printing',
  schema = null,
}) => {
  const siteTitle = 'Tag Team Printing';
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
  const siteUrl =
    (typeof window !== 'undefined' && window.location.origin) ||
    process.env.GATSBY_SITE_URL ||
    process.env.URL ||
    '';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  const schemaItems = Array.isArray(schema)
    ? schema.filter(Boolean)
    : schema
      ? [schema]
      : [];

  return (
    <Helmet
      htmlAttributes={{
        lang: 'en',
      }}
      title={fullTitle}
      meta={[
        {
          name: 'description',
          content: description,
        },
        {
          name: 'keywords',
          content: keywords,
        },
        {
          property: 'og:title',
          content: fullTitle,
        },
        {
          property: 'og:description',
          content: description,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:url',
          content: fullUrl,
        },
        {
          property: 'og:image',
          content: fullImage,
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: fullTitle,
        },
        {
          name: 'twitter:description',
          content: description,
        },
        {
          name: 'twitter:image',
          content: fullImage,
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
      ]}
    >
      {schemaItems.map((item, index) => (
        <script
          key={`ldjson-${index}`}
          type="application/ld+json"
        >{`${JSON.stringify(item)}`}</script>
      ))}
    </Helmet>
  );
};

export default SEO;
