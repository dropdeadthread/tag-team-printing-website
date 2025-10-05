import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ 
  title = 'Tag Team Printing', 
  description = 'Custom screen printing and apparel services for your business, event, or organization.',
  image = '/images/logo.png',
  url = '',
  keywords = 'screen printing, custom apparel, t-shirts, business apparel, event printing'
}) => {
  const siteTitle = 'Tag Team Printing';
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

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
    />
  );
};

export default SEO;