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

const SchoolAndEventPrinting = () => {
  const schema = null;

  return (
    <Layout>
      <SEO
        title="Custom School Spirit Wear & Event Shirts in Cornwall, ON"
        description="Get professional-grade school spirit wear and event shirts printed in Cornwall, Ontario. Fast turnaround times, affordable prices, and local pickup available."
        url="/school-and-event-printing"
        keywords="school and event printing Cornwall"
        schema={schema ? [schema] : null}
      />
      <PageContainer>
        <ContentCard>
          <PageTitle>
            School and Event Printing Cornwall - Tag Team Printing
          </PageTitle>
          <h2>School and Event Printing Cornwall</h2>
          <p>
            At Tag Team Printing, we understand the importance of creating
            custom school spirit wear and event shirts that showcase your team's
            personality and pride. Whether you're looking for graduation shirts,
            sports jerseys, or fundraiser t-shirts, our expert printing services
            will help you achieve your goals.
          </p>
          <h2>Our Services</h2>
          <ul>
            <li>
              {' '}
              Custom screen printing: Choose from a variety of colors and
              designs to create unique school spirit wear.
            </li>
            <li>
              {' '}
              Fast turnaround times: We prioritize quick production to ensure
              timely delivery for events and deadlines.
            </li>
            <li>
              {' '}
              Affordable prices: Our budget-friendly options make it easy to fit
              custom shirts into your school or event budget.
            </li>
          </ul>
          <h2>Local Pickup Available</h2>
          <p>
            We offer local pickup in Cornwall, Ontario, for added convenience.
            Simply select the "Local Pickup" option during checkout to arrange a
            time that works for you.
          </p>
          <h2>Why Choose Tag Team Printing?</h2>
          <ul>
            <li>
              {' '}
              Industry-standard screen printing equipment for high-quality
              prints
            </li>
            <li>
              {' '}
              Experienced print specialists with attention to detail and color
              accuracy
            </li>
            <li> Transparent pricing and no hidden fees</li>
          </ul>
          <h2>Frequently Asked Questions</h2>
          <h3>
            Q: What is the minimum order quantity for custom school spirit wear?
          </h3>
          <p>
            A: Our minimum order quantity is 10 shirts. However, we also offer a
            one-off option for smaller orders.
          </p>
          <h3>Q: Can I request a specific design or color scheme?</h3>
          <p>
            A: Absolutely! Please provide us with your design concept and color
            preferences, and we'll work with you to bring it to life.
          </p>
          <h3>Q: How long does shipping take for custom school spirit wear?</h3>
          <p>
            A: We strive to ship all orders within 3-5 business days. Shipping
            times vary depending on your location, but most orders arrive within
            7-10 business days.
          </p>
          <h3>Q: Can I cancel or change my order after it's been placed?</h3>
          <p>
            A: Please contact us as soon as possible if you need to make any
            changes to your order. We'll do our best to accommodate your
            request, but please note that we may not be able to make changes
            once production has begun.
          </p>
          <h3>
            Q: Do you offer wholesale pricing for schools and event organizers?
          </h3>
          <p>
            A: Yes! We offer competitive wholesale pricing for bulk orders.
            Please contact us for a custom quote and more information.
          </p>

          <section className="faq-section" style={{ marginTop: '2.5rem' }}>
            <h2>Frequently Asked Questions</h2>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>
                What is the minimum order quantity for custom school spirit
                wear?
              </h3>
              <p>
                Our minimum order quantity is 10 shirts. However, we also offer
                a one-off option for smaller orders.
              </p>
            </div>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>Can I request a specific design or color scheme?</h3>
              <p>
                Absolutely! Please provide us with your design concept and color
                preferences, and we'll work with you to bring it to life.
              </p>
            </div>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>
                How long does shipping take for custom school spirit wear?
              </h3>
              <p>
                We strive to ship all orders within 3-5 business days. Shipping
                times vary depending on your location, but most orders arrive
                within 7-10 business days.
              </p>
            </div>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>Can I cancel or change my order after it's been placed?</h3>
              <p>
                Please contact us as soon as possible if you need to make any
                changes to your order. We'll do our best to accommodate your
                request, but please note that we may not be able to make changes
                once production has begun.
              </p>
            </div>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>
                Do you offer wholesale pricing for schools and event organizers?
              </h3>
              <p>
                Yes! We offer competitive wholesale pricing for bulk orders.
                Please contact us for a custom quote and more information.
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

export default SchoolAndEventPrinting;
