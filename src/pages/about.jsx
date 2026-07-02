import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import DualBioPage from '../components/DualBioPage';

const AboutPage = () => (
  <Layout>
    <SEO
      title="About Us | Tag Team Printing — Cornwall, Ontario"
      description="Tag Team Printing is a custom screen printing shop in Cornwall, Ontario. Meet the team behind your custom apparel, school shirts, and bulk printing orders."
      url="/about"
    />
    <DualBioPage />
  </Layout>
);

export default AboutPage;
