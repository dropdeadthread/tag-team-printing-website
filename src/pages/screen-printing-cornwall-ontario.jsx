/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 4rem 2rem 2rem 2rem;
  position: relative;
`;

const ContentCard = styled.div`
  max-width: 900px;
  margin: 4.5rem auto 0 auto;
  background: rgba(255, 245, 209, 0.95);
  border: 3px solid #2563eb;
  box-shadow:
    0 0 20px rgba(37, 99, 235, 0.15),
    inset 0 0 10px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 2.5rem 2rem;
  font-family: 'Georgia', serif;
  color: #1a1a2e;
  line-height: 1.7;
`;

const PageTitle = styled.h1`
  font-family: 'HawlersEightRough', 'Impact', 'Arial Black', sans-serif;
  color: #2563eb;
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const CTABox = styled.div`
  margin-top: 2.5rem;
  padding: 1.5rem;
  background: #2563eb;
  border-radius: 8px;
  text-align: center;
  color: #fff;
`;

const CTALink = styled.a`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: #fff;
  color: #2563eb;
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    background: #f0f4ff;
  }
`;

const ScreenPrintingCornwallOntario = () => {
  const schema = {};

  return (
    <Layout>
      <SEO
        title="Screen Printing Services Cornwall ON | Fast Turnaround, No Minimums"
        description="Get professional screen printed products in Cornwall, Ontario with fast turnaround times and no minimum order requirements."
        url="/screen-printing-cornwall-ontario"
        keywords="screen printing Cornwall Ontario"
        schema={schema ? [schema] : null}
      />
      <PageContainer>
        <ContentCard>
          <PageTitle>
            Expert Screen Printing in Cornwall, Ontario - Tag Team Printing
          </PageTitle>
          <p>
            >{' '}
            <strong>
              Precision Screen Printing & Custom Apparel in Cornwall, Ontario
            </strong>
          </p>
          <p>
            At Tag Team Printing, we're the go-to screen printing experts for
            businesses, sports teams, schools, and organizations in Cornwall and
            Eastern Ontario. Our state-of-the-art equipment and experienced
            print specialists ensure durability, color accuracy, and consistency
            in every order.
          </p>
          <p>
            We pride ourselves on fast turnaround times, no minimum orders, and
            transparent pricing. Whether you need 24 shirts or 2,400, we'll work
            with you to bring your vision to life. Contact us today to request a
            quote!
          </p>
          <p>
            > <strong>Why Choose Tag Team Printing?</strong>
          </p>
          <ul>
            <li> Industry-standard screen printing (not vinyl shortcuts)</li>
            <li>
              {' '}
              Fast turnaround times (often same-day shipping in Cornwall)
            </li>
            <li> Transparent pricing and no hidden fees</li>
            <li> Bulk order capability for large quantities</li>
            <li>
              {' '}
              In-house production control ensures quality and consistency
            </li>
            <li>
              {' '}
              Serving Cornwall, SD&G, Eastern Ontario, and the Ottawa Valley
              region
            </li>
          </ul>

          <section className="faq-section" style={{ marginTop: '2.5rem' }}>
            <h2>Frequently Asked Questions</h2>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>What is your minimum order quantity?</h3>
              <p>
                We have no minimum orders. Contact us to request a quote for any
                quantity.
              </p>
            </div>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>Do you offer same-day shipping in Cornwall?</h3>
              <p>
                Yes, we offer same-day shipping on orders received before 2 PM
                EST. Please contact us to confirm availability.
              </p>
            </div>
          </section>
          <CTABox>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
              Ready to get started? Get a free quote today.
            </p>
            <CTALink href="/design-order">Get a Free Quote</CTALink>
          </CTABox>
        </ContentCard>
      </PageContainer>
    </Layout>
  );
};

export default ScreenPrintingCornwallOntario;
