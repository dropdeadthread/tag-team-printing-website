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

const BreweryMerchPrinting = () => {
  const schema = null;

  return (
    <Layout>
      <SEO
        title="Expert Brewery Merch Printing Services in Eastern Ontario"
        description="Get high-quality brewery merch printing services in Cornwall, ON. Fast turnaround times, affordable prices, and expert craftsmanship for your taproom swag."
        url="/brewery-merch-printing"
        keywords="brewery merch printing"
        schema={schema ? [schema] : null}
      />
      <PageContainer>
        <ContentCard>
          <PageTitle>
            Brewery Merch Printing in Cornwall, Ontario | Tag Team Printing
          </PageTitle>
          <p>
            > <strong>Brewery Merch Printing Experts</strong>
          </p>
          <p>
            At Tag Team Printing, we understand the importance of having
            professional-grade merchandise that represents your brand's
            identity. That's why we offer brewery merch printing services
            tailored to meet the unique needs of craft breweries in Eastern
            Ontario and beyond.
          </p>
          <p>
            > <strong>Custom Apparel for Taproom Swag</strong>
          </p>
          <p>
            From t-shirts to hoodies, hats, and staff shirts, our custom apparel
            solutions are designed to help you create a cohesive brand image
            that resonates with your customers. Our team works closely with each
            brewery to understand their vision, preferences, and target
            audience.
          </p>
          <p>
            >{' '}
            <strong>
              Brewery Merch Printing for Tap Takeovers & Festivals
            </strong>
          </p>
          <p>
            We've helped numerous breweries across Eastern Ontario and Canada
            create show-stopping merchandise for tap takeovers, festivals, and
            other events. Our fast turnaround times and affordable prices ensure
            that you can get your merch printed quickly and efficiently, without
            compromising on quality.
          </p>
          <p>
            > <strong>Local Ontario Craft Brewing Community Support</strong>
          </p>
          <p>
            As a local business serving Cornwall, ON, we're proud to support the
            craft brewing community in Eastern Ontario. We understand the
            importance of building relationships with local breweries and
            distilleries, which is why we offer customized solutions that cater
            to their unique needs.
          </p>
          <p>
            > <strong>Expert Printing Services for Brewery Merch</strong>
          </p>
          <p>
            Our state-of-the-art printing equipment and experienced print
            specialists ensure that every item meets our high standards of
            quality and durability. From vibrant colors to precise designs, we
            guarantee that your brewery merch will stand out from the crowd.
          </p>
          <p>
            > <strong>Get a Quote Today!</strong>
          </p>
          <p>
            Ready to elevate your taproom swag? Contact us today to get started
            on your custom brewery merch printing project. Our team is ready to
            help you create merchandise that represents your brand's unique
            spirit and resonates with your customers.
          </p>

          <section className="faq-section" style={{ marginTop: '2.5rem' }}>
            <h2>Frequently Asked Questions</h2>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>What types of apparel can I print for my brewery?</h3>
              <p>
                We offer a range of apparel options, including t-shirts,
                hoodies, hats, staff shirts, and more.
              </p>
            </div>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>How long does it take to get my merchandise printed?</h3>
              <p>
                Our fast turnaround times vary depending on the quantity
                ordered, but we aim to deliver your merchandise within 5-7
                business days.
              </p>
            </div>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>Do you offer discounts for bulk orders?</h3>
              <p>
                Yes, we offer competitive pricing for bulk orders. Contact us
                today to discuss your specific needs and get a quote.
              </p>
            </div>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>Can I upload my own design files?</h3>
              <p>
                Yes, we accept high-resolution PDF or JPEG files via email or
                our online upload portal.
              </p>
            </div>
            <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
              <h3>What is the minimum order quantity for custom apparel?</h3>
              <p>
                Our minimum order quantity varies depending on the item. Please
                contact us for more information and to discuss your specific
                needs.
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

export default BreweryMerchPrinting;
