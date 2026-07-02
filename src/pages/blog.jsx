import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const Blog = () => {
  return (
    <Layout>
      <SEO
        title="Blog | Tag Team Printing — Cornwall Screen Printing"
        description="Shop updates, behind-the-scenes from the press, and printing tips from Tag Team Printing in Cornwall, Ontario."
        url="/blog"
      />
      <div
        style={{
          padding: '3rem',
          fontFamily: 'LuchitaPayolLaRuda, sans-serif',
          color: '#fff5d1',
          textAlign: 'center',
        }}
      >
        <h1>Tag Team Blog</h1>
        <p>
          Shop updates, behind-the-scenes from the press, and printing tips from
          Cornwall.
        </p>
        <p>First post coming soon.</p>
      </div>
    </Layout>
  );
};

export default Blog;
