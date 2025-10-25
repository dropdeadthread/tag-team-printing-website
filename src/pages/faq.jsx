import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';

const FAQContainer = styled.div`
  min-height: 100vh;
  padding: 4rem 2rem 2rem 2rem;
  position: relative;
`;

const FAQCard = styled.div`
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

const FAQTitle = styled.h1`
  font-family: 'HawlersEightRough', 'Impact', 'Arial Black', sans-serif;
  color: #2563eb;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 6rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const SectionTitle = styled.h2`
  font-family: 'HawlersEightRough', 'Impact', 'Arial Black', sans-serif;
  color: #2563eb;
  font-size: 1.3rem;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FAQList = styled.ul`
  margin: 0 0 1.5rem 1.5rem;
  padding: 0;
  list-style: disc inside;
`;

const FAQ = () => (
  <Layout>
    <FAQContainer>
      <FAQCard>
        <div
          style={{
            background: '#e0e7ff',
            border: '2px solid #2563EB',
            borderRadius: '8px',
            padding: '1.2rem 1.5rem',
            marginBottom: '2.5rem',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.15rem',
          }}
        >
          Are you looking for info about our design services?{' '}
          <a
            href="/designer-faq"
            style={{
              color: '#0070d1',
              fontWeight: 'bold',
              textDecoration: 'underline',
            }}
          >
            Check out our Designer FAQ
          </a>{' '}
          for answers about artwork, file prep, and creative projects.
        </div>
        <FAQTitle>FAQ</FAQTitle>

        <SectionTitle>Design & File Setup</SectionTitle>
        <p>
          <strong>I have an idea but no artwork — can you help?</strong>
          <br />
          Absolutely. Our in-house design crew can create something custom for
          you from scratch or clean up what you’ve got. Design time is billed at
          $50/hr — your first virtual proof is free.
        </p>
        <p>
          <strong>What file types do you accept?</strong>
          <br />
          Vector files preferred: .AI, .EPS, .PDF (text outlined, links
          embedded). We also accept layered .PSD files at 300 DPI at actual
          print size. Please include PMS color specs for spot color jobs.
        </p>
        <p>
          <strong>Can I get a proof before printing?</strong>
          <br />
          Yes — your first virtual proof is free. Additional proofs (due to
          client changes) are $5 each, and a proof without an order is $10.
        </p>

        <SectionTitle>Quotes, Pricing & Minimums</SectionTitle>
        <p>
          <strong>Can I get a quote?</strong>
          <br />
          Use our <a href="/product-page">product/order form</a> or{' '}
          <a href="/print-order-form">print order form</a> to get instant
          pricing. For specialty jobs not listed, contact us directly.
        </p>
        <p>
          <strong>What are your order minimums?</strong>
        </p>
        <FAQList>
          <li>1-color: 15 pcs</li>
          <li>2-color: 20 pcs</li>
          <li>3-color: 30 pcs</li>
          <li>+10 more per additional color</li>
        </FAQList>
        <p>
          <strong>Additional Charges:</strong>
        </p>
        <FAQList>
          <li>Screen Charge: $30/color</li>
          <li>Reprint Setup: $20/color</li>
          <li>Under Minimum: $20 surcharge</li>
          <li>Art: $50/hr</li>
          <li>Fold: $0.10 ea | Fold &amp; Bag: $0.25 ea</li>
          <li>Names: $4 | Numbers: $3</li>
          <li>Additional fees may apply for specialty items or color bases.</li>
        </FAQList>

        <SectionTitle>Turnaround & Rush</SectionTitle>
        <p>
          <strong>Standard turnaround?</strong>
          <br />
          5–7 business days from artwork approval and garment arrival. During
          peak season (April–mid November), expect 10–15 business days. Orders
          after 12pm count as next-day.
        </p>
        <p>
          <strong>Rush order fees:</strong>
        </p>
        <FAQList>
          <li>5-day: +20%</li>
          <li>4-day: +30%</li>
          <li>3-day: +40%</li>
          <li>2-day: +50%</li>
          <li>1-day: Not available</li>
        </FAQList>

        <SectionTitle>Shipping & Delivery</SectionTitle>
        <p>
          <strong>Do you ship?</strong>
          <br />
          Yes — we ship Canada-wide. Pickup available at 1014 First St E,
          Cornwall, ON. Shipping with insurance? Let us know the value — a $5
          fee applies.
        </p>
        <p>
          <strong>Do you deliver?</strong>
          <br />
          Local delivery may be available. Standard rates apply — just ask.
        </p>

        <SectionTitle>Reorders & Screens</SectionTitle>
        <p>
          <strong>Can I reorder a past job?</strong>
          <br />
          If we still have your files/screens, yes — and it&apos;ll likely cost
          less. Screens aren&apos;t guaranteed to be stored after the job, but
          we often retain them briefly for quality control.
        </p>

        <SectionTitle>Garment Supply</SectionTitle>
        <p>
          <strong>Do you supply the garments?</strong>
          <br />
          Yes — we have wholesale partners and can help choose the best blanks.
        </p>
        <p>
          <strong>Can I bring my own garments?</strong>
          <br />
          Yes, but they must be brand new. Used or pre-washed garments are only
          accepted under certain conditions. All customer-supplied garments are
          printed at your own risk.
        </p>

        <SectionTitle>Order Requirements</SectionTitle>
        <p>Your PO must include:</p>
        <FAQList>
          <li>Brand, style, colour, size breakdown</li>
          <li>Print location(s) and PMS colours</li>
          <li>Shipping info and due date</li>
          <li>Approved art at final size, 300 DPI</li>
        </FAQList>

        <SectionTitle>Spoilage & Underruns</SectionTitle>
        <p>
          We reserve the right to ship up to 2% fewer items than ordered.
          Spoilage up to 2% or 3 garments (whichever is greater) is considered
          acceptable. Claims must be made within 5 business days. No replacement
          or credit is given on non-ASI garments.
        </p>
      </FAQCard>
    </FAQContainer>
  </Layout>
);

export default FAQ;
