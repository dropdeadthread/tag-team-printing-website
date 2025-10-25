import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';

const DesignContainer = styled.div`
  min-height: 100vh;
  padding: 4rem 2rem 2rem 2rem;
  position: relative;
`;

const DesignCard = styled.div`
  max-width: 900px;
  margin: 4.5rem auto 0 auto;
  background: rgba(255, 245, 209, 0.95);
  border: 3px solid #2563eb;
  box-shadow:
    0 0 20px rgba(37, 99, 235, 0.15),
    inset 0 0 10px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 2.5rem 2rem;
`;

const DesignTitle = styled.h1`
  font-family: 'HawlersEightRough', 'Impact', 'Arial Black', sans-serif;
  color: #2563eb;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const SectionTitle = styled.h2`
  font-family: 'HawlersEightRough', 'Impact', 'Arial Black', sans-serif;
  color: #ff5050;
  font-size: 1.3rem;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const DesignerPage = () => (
  <Layout>
    <DesignContainer>
      <DesignCard>
        <DesignTitle>Tag Team Printing — Design Services</DesignTitle>
        <p>
          Custom artwork, merch design, and print-ready prep — all under one
          roof.
        </p>

        <SectionTitle>■ Technical Prep Work — $25/hr</SectionTitle>
        <p>
          For quick fixes and production-ready adjustments on client-provided
          files. Perfect when your design just needs a little love before
          hitting the press.
        </p>
        <p>
          <b>Includes:</b> 1 free revision, 1 free virtual proof, $5 for
          additional revisions.
        </p>
        <p>
          <b>Examples:</b> Color separations, raster-to-vector conversion,
          resizing logos, fixing resolution issues.
        </p>

        <SectionTitle>■ Creative & Branding Design — $50/hr</SectionTitle>
        <p>
          For full-scale custom projects where we create something from scratch.
          When you need original artwork, merch layouts, or killer branding,
          we&apos;re your crew.
        </p>
        <p>
          <b>Includes:</b> Up to 3 free revisions, 1 free virtual proof, $5 for
          additional revisions.
        </p>
        <p>
          <b>Examples:</b> T-shirt graphics, album covers, logos, posters, full
          merch layouts.
        </p>

        <SectionTitle>■■ Standalone Design Projects — $50/hr</SectionTitle>
        <p>
          Not printing with us? No problem. We&apos;ll deliver finished,
          print-ready files that you fully own.
        </p>

        {/* Turnaround times removed for realistic expectations */}
        <div
          style={{
            background: '#e0e7ff',
            border: '2px solid #2563EB',
            borderRadius: '8px',
            padding: '1.2rem 1.5rem',
            marginTop: '2.5rem',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.15rem',
          }}
        >
          Have questions about our design process, file prep, or creative
          services?{' '}
          <a
            href="/designer-faq"
            style={{
              color: '#0070d1',
              fontWeight: 'bold',
              textDecoration: 'underline',
            }}
          >
            Check out our Designer FAQ
          </a>
          .
        </div>
      </DesignCard>
    </DesignContainer>
  </Layout>
);

export default DesignerPage;
