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

const CustomTShirtsCornwall = () => {
  const schema = {};

  return (
    <Layout>
      <SEO
        title="Custom T Shirts in Cornwall Ontario - Screen Printing Services"
        description="Get fast, reliable custom t-shirt printing services in Cornwall, Ontario. No minimum order required. Local pickup and fast delivery available."
        url="/custom-t-shirts-cornwall"
        keywords="custom t-shirts Cornwall"
        schema={schema ? [schema] : null}
      />
      <PageContainer>
        <ContentCard>
          <PageTitle>
            Custom T-Shirts Cornwall - Fast, Reliable Printing & Quality
            Guarantee
          </PageTitle>
          <p>
            > <strong>Expert Custom T-Shirt Printing in Cornwall</strong>
          </p>
          <p>
            At Tag Team Printing, we offer high-quality custom t-shirts for
            businesses, events, sports leagues, and schools in Cornwall and
            surrounding areas. Our screen printing services are fast, reliable,
            and backed by a quality guarantee.
          </p>
          <p>
            > <strong>No Minimum Order Required</strong>
          </p>
          <p>
            We understand that every business is unique, which is why we don't
            have minimum order requirements. Whether you need 24 shirts or
            2,400, we can accommodate your needs.
          </p>
          <p>
            > <strong>Local Pickup & Fast Delivery</strong>
          </p>
          <p>
            We're committed to fast turnaround times and convenient pickup
            options. Choose from our local Cornwall location for quick and
            reliable service.
          </p>
          <p>
            > <strong>Compare Us to Online Competitors</strong>
          </p>
          <p>
            While online printing services may promise low prices, they often
            can't match the quality and personal touch that Tag Team Printing
            provides. Our expert team uses professional-grade equipment and
            takes pride in every shirt we produce.
          </p>
          <p>
            > <strong>Custom T-Shirt Services for Businesses & Events</strong>
          </p>
          <p>
            Our custom t-shirt printing services are perfect for businesses
            looking to create branded merchandise or events teams wanting to
            upgrade their uniforms. We also offer wholesale apparel options for
            schools, sports leagues, and more.
          </p>
          <p>
            > <strong>Get a Quote Today!</strong>
          </p>
          <p>
            Ready to order your custom t-shirts? Fill out our online form or
            give us a call at 613-363-4997 to get started. We can't wait to help
            you create some amazing shirts!
          </p>

          <section className="faq-section" style={{ marginTop: '2.5rem' }}>
            <h2>Frequently Asked Questions</h2>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>
                What is the minimum order quantity for custom t-shirt printing?
              </h3>
              <p>
                We don't have a minimum order requirement. Order as many or as
                few shirts as you need.
              </p>
            </div>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>Do you offer wholesale apparel options?</h3>
              <p>
                Yes, we do! Our wholesale apparel options are perfect for
                businesses looking to create branded merchandise or events teams
                wanting to upgrade their uniforms.
              </p>
            </div>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>Can I pick up my custom t-shirts in Cornwall?</h3>
              <p>
                Yes, we offer local pickup at our Cornwall location. We'll work
                with you to find a time that suits your schedule.
              </p>
            </div>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>
                How long does it take to produce and deliver custom t-shirts?
              </h3>
              <p>
                We strive to turn around orders quickly while maintaining the
                highest quality standards. Delivery times vary depending on
                order volume, but we aim to get your shirts to you within 5-7
                business days.
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

export default CustomTShirtsCornwall;
