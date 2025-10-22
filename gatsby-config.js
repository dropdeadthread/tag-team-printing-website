// Load environment variables with fallback strategy
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

// Fallback to .env.development if NODE_ENV specific file doesn't exist
require('dotenv').config({
  path: `.env.development`,
});

// And general .env as final fallback
require('dotenv').config();

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/data/`,
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Tag Team Printing`,
        short_name: `TTP`,
        start_url: `/`,
        background_color: `#000000`,
        theme_color: `#c32b14`,
        display: `minimal-ui`,
        icon: `static/images/logo.png`,
      },
    },
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        displayName: true,
        fileName: true,
        ssr: true,
        minify: false,
        transpileTemplateLiterals: true,
        pure: true,
      },
    },
    `gatsby-plugin-postcss`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-gtag`,
      options: {
        trackingId: process.env.GATSBY_GA_TRACKING_ID || 'G-220DWNXBFQ',
        head: false,
        anonymize: true,
        respectDNT: true,
        pageTransitionDelay: 0,
        sampleRate: 5,
        siteSpeedSampleRate: 10,
        cookieDomain: 'tagteamprints.com',
      },
    },
  ],
};
