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

const BulkApparelPrinting = () => {
  const schema = null;

  return (
    <Layout>
      <SEO
        title="Bulk Apparel Printing Services | Screen Printing & Custom Apparel in Cornwall ON"
        description="Get high-quality bulk apparel printing services from Tag Team Printing in Cornwall, Ontario. Fast turnaround times, transparent pricing, and durable prints for businesses, events, and sports organizations."
        url="/bulk-apparel-printing"
        keywords="bulk apparel printing"
        schema={schema ? [schema] : null}
      />
      <PageContainer>
        <ContentCard>
          <PageTitle>
            Bulk Apparel Printing in Cornwall, Ontario - Tag Team Printing
          </PageTitle>
          <p>> Bulk Apparel Printing in Cornwall, Ontario</p>
          <p>
            At Tag Team Printing, we understand the importance of cost-effective
            solutions for large-scale apparel orders. Our bulk apparel printing
            services are designed to help you save time and money while ensuring
            high-quality prints that meet your brand's standards.
          </p>
          <p>
            <strong>Benefits of Bulk Apparel Printing with Us</strong>
          </p>
          <ul>
            <li>
              **Volume Discounts**: Order hundreds of garments and enjoy
              significant volume discounts on our screen printing services.
            </li>
            <li>
              **Staff Uniforms & Corporate Orders**: We cater to businesses,
              event organizers, and sports organizations with bulk apparel
              orders. Our staff uniforms and corporate orders are tailored to
              meet your specific needs.
            </li>
            <li>
              **Quality Control**: Our professional-grade equipment and
              experienced print specialists guarantee durable prints that
              withstand the rigors of daily wear and tear.
            </li>
            <li>
              **Sourcing Hundreds of Garment Styles**: We work closely with S&S
              Activewear, offering a vast range of styles to suit your brand's
              unique requirements.
            </li>
          </ul>
          <p>
            <strong>Our Bulk Apparel Printing Process</strong>
          </p>
          <p>
            1. <strong>Order Placement</strong>: Simply contact us via phone or
            email to discuss your bulk apparel printing needs.
          </p>
          <p>
            2. <strong>Design and Artwork</strong>: Provide your design and
            artwork, ensuring we have all necessary files for production.
          </p>
          <p>
            3. <strong>Pre-Production</strong>: Our team reviews your order for
            accuracy and quality before proceeding with print preparation.
          </p>
          <p>
            4. <strong>Printing & Finishing</strong>: We use our
            state-of-the-art equipment to ensure high-quality prints while
            maintaining fast turnaround times.
          </p>
          <p>
            <strong>
              Why Choose Tag Team Printing for Your Bulk Apparel Printing Needs?
            </strong>
          </p>
          <ul>
            <li>
              {' '}
              **Quality Guaranteed**: Our professional-grade equipment and
              experienced team guarantee durable prints that meet your brand's
              standards.
            </li>
            <li>
              {' '}
              **Fast Turnaround Times**: We understand the importance of timely
              delivery, ensuring your bulk apparel orders are ready when needed.
            </li>
            <li>
              {' '}
              **Transparent Pricing**: We provide transparent pricing to ensure
              you're always aware of costs before placing an order.
            </li>
          </ul>
          <p>
            <strong>Get a Quote Today!</strong>
          </p>
          <p>
            Contact us at 613-363-4997 or tagteam@tagteamprints.com to discuss
            your bulk apparel printing needs. Our team is here to help you find
            the perfect solution for your business.
          </p>

          <section className="faq-section" style={{ marginTop: '2.5rem' }}>
            <h2>Frequently Asked Questions</h2>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>What types of garments can be printed with bulk orders?</h3>
              <p>
                We print a wide range of garments, including t-shirts, hoodies,
                hats, and more.
              </p>
            </div>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>How long does it take to receive my bulk apparel order?</h3>
              <p>
                Our fast turnaround times ensure your order is ready when
                needed. Please allow 7-10 business days for standard orders.
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

export default BulkApparelPrinting;
