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

const BandMerchPrintingCanada = () => {
  const schema = null;

  return (
    <Layout>
      <SEO
        title="Band Merch Printing Canada - Tag Team Printing"
        description="Get high-quality band merchandise printed in Canada with fast turnaround times and competitive pricing. Contact us today!"
        url="/band-merch-printing-canada"
        keywords="band merch printing Canada"
        schema={schema ? [schema] : null}
      />
      <PageContainer>
        <ContentCard>
          <PageTitle>
            Band Merch Printing Canada | Fast, Reliable Screen Printing Services
          </PageTitle>
          <p>
            > <strong>Band Merch Printing Canada</strong>
          </p>
          <p>
            At Tag Team Printing, we understand the importance of having
            professional-grade band merchandise for your live shows and tours.
            That's why we offer fast, reliable screen printing services
            specifically designed for bands and musicians.
          </p>
          <p>
            > <strong>Why Choose Us?</strong>
          </p>
          <ul>
            <li>
              {' '}
              Fast turnaround times to ensure you have your merch ready before
              tour dates
            </li>
            <li>
              {' '}
              Competitive pricing with no minimum order requirements for small
              bands
            </li>
            <li> Dark garment options available for the best look on stage</li>
            <li>
              {' '}
              Multi-color designs allowed for unique, eye-catching designs
            </li>
          </ul>
          <p>
            > <strong>Our Process:</strong>
          </p>
          <p>
            1. We start by reviewing your design and making any necessary
            adjustments to ensure it looks its best.
          </p>
          <p>
            2. Next, we prepare your screen with our professional-grade
            equipment and materials.
          </p>
          <p>
            3. Once the screen is ready, we print your design onto high-quality
            merchandise using eco-friendly inks.
          </p>
          <p>
            4. Finally, we package and ship your merch to you or directly to
            your fans.
          </p>
          <p>
            > <strong>What Sets Us Apart:</strong>
          </p>
          <ul>
            <li>
              {' '}
              We're a local business based in Cornwall, Ontario, with a deep
              connection to the Canadian music scene
            </li>
            <li>
              {' '}
              Our team is comprised of experienced print specialists who
              understand what it takes to produce high-quality merchandise for
              bands like you
            </li>
            <li>
              {' '}
              We offer a wide range of services, including DTF printing and
              custom apparel, to help you stand out from the competition
            </li>
          </ul>
          <p>
            > <strong>Get in Touch:</strong>
          </p>
          <p>
            Ready to take your band merch game to the next level? Contact us
            today to learn more about our screen printing services and how we
            can help you achieve your goals.
          </p>
          <p>
            You can reach us at 613-363-4997 or tagteam@tagteamprints.com. We
            look forward to working with you!
          </p>
          <p>
            > <strong>FAQs:</strong>
          </p>
          <ul>
            <li>
              {' '}
              What is the minimum order quantity for band merch printing?
            </li>
          </ul>
          <p>
            Our minimum order quantity is just one item, making it easy for
            small bands and musicians to get started.
          </p>
          <ul>
            <li> How long does it take to receive my printed merchandise?</li>
          </ul>
          <p>
            Turnaround times vary depending on the complexity of your design and
            the volume of orders we're working on. However, we strive to meet or
            beat our promised deadlines whenever possible.
          </p>
          <ul>
            <li> Can I print dark garments with my designs?</li>
          </ul>
          <p>
            Absolutely! We offer a range of dark garment options that will give
            your merch a premium look and feel.
          </p>
          <ul>
            <li> Do you use eco-friendly inks for your printing process?</li>
          </ul>
          <p>
            Yes, we take pride in using environmentally responsible inks to
            minimize our impact on the environment.
          </p>
          <p>
            > <strong>Get Started Today:</strong>
          </p>
          <p>
            Ready to elevate your band merch game? Contact us today to learn
            more about our screen printing services and how we can help you
            achieve your goals. We're here to support you every step of the way.
          </p>

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

export default BandMerchPrintingCanada;
