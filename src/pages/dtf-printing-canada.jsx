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

const DtfPrintingCanada = () => {
  const schema = null;

  return (
    <Layout>
      <SEO
        title="Canada's Best DTF Printing Service - Tag Team Printing"
        description="Get vibrant, full-color prints on any fabric with our DTF printing service in Canada. Nationwide shipping from Cornwall, ON."
        url="/dtf-printing-canada"
        keywords="DTF printing Canada"
        schema={schema ? [schema] : null}
      />
      <PageContainer>
        <ContentCard>
          <PageTitle>
            Direct-to-Film Printing in Canada | Tag Team Printing
          </PageTitle>
          <p>
            >{' '}
            <strong>
              Direct-to-Film (DTF) Printing in Canada: The Future of Screen
              Printing
            </strong>
          </p>
          <p>
            At Tag Team Printing, we're proud to offer direct-to-film printing
            services across Canada. Our state-of-the-art equipment and
            experienced team ensure that your prints are not only vibrant but
            also long-lasting.
          </p>
          <p>
            <strong>What is DTF Printing?</strong>
          </p>
          <p>
            Direct-to-film printing is a revolutionary process that allows for
            high-quality prints on any fabric without the need for screens or
            plates. Using specialized film, our printers apply ink directly to
            the fabric, eliminating the risk of fading or discoloration.
          </p>
          <p>
            <strong>
              Benefits of DTF Printing over Traditional Screen Printing:
            </strong>
          </p>
          <ul>
            <li>
              {' '}
              **Faster Turnaround Times:** With DTF printing, you can get your
              prints faster than traditional screen printing methods.
            </li>
            <li>
              {' '}
              **Cost-Effective:** Our DTF printing service is more
              cost-effective than traditional screen printing, especially for
              large orders.
            </li>
            <li>
              {' '}
              **Increased Color Accuracy:** Direct-to-film printing ensures that
              your colors are accurate and consistent, eliminating the risk of
              human error.
            </li>
          </ul>
          <p>
            <strong>
              Why Choose Tag Team Printing for Your DTF Printing Needs?
            </strong>
          </p>
          <ul>
            <li>
              {' '}
              **Nationwide Shipping:** We ship our prints across Canada,
              ensuring that you receive your products quickly and efficiently.
            </li>
            <li>
              {' '}
              **Experienced Team:** Our team has years of experience in screen
              printing and is dedicated to providing exceptional service.
            </li>
            <li>
              {' '}
              **State-of-the-Art Equipment:** Our equipment is the latest
              technology, ensuring that your prints are of the highest quality.
            </li>
          </ul>
          <p>
            <strong>Get a Quote Today!</strong>
          </p>
          <p>
            Contact us today to get a quote for your DTF printing needs. Our
            team will work with you to ensure that your prints meet your
            expectations.
          </p>
          <p>> ## Frequently Asked Questions</p>
          <h3>Q: How does DTF printing work?</h3>
          <p>
            A: Direct-to-film printing uses specialized film to apply ink
            directly to the fabric, eliminating the need for screens or plates.
          </p>
          <h3>Q: What types of fabrics can be printed with DTF?</h3>
          <p>
            A: Our DTF printing service can print on a wide range of fabrics,
            including cotton, polyester, and blends.
          </p>
          <h3>
            Q: How long does DTF printing take compared to traditional screen
            printing?
          </h3>
          <p>
            A: With our DTF printing service, you can get your prints faster
            than traditional screen printing methods.
          </p>
          <p>> ## Contact Us</p>
          <p>
            Ready to experience the benefits of DTF printing? Contact us today
            to get a quote for your next project. Our team is dedicated to
            providing exceptional service and ensuring that your prints meet
            your expectations. Call or email us at [phone number] or [email
            address]. We look forward to working with you!
          </p>
          <p>---</p>
          <h2>FAQ</h2>

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

export default DtfPrintingCanada;
