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
          you from scratch or clean up what you&apos;ve got. Design time is
          billed at $50/hr — your first virtual proof is free.
        </p>
        <p>
          <strong>What file types do you accept?</strong>
          <br />
          <strong>Vector files preferred:</strong> .AI, .EPS, or .PDF (all text
          converted to outlines &amp; linked files embedded)
          <br />
          <strong>Photoshop:</strong> Save as .PSD at 300 DPI or higher, at
          final print size (please leave in layers)
          <br />
          <strong>Important:</strong> PMS colors must be specified for all spot
          color prints. Exact print size must be specified (art preferably sent
          at size).
        </p>
        <p>
          <strong>Can I get a proof before printing?</strong>
          <br />
          Yes — your first virtual proof is free. Additional proofs (due to
          client changes) are $5 each.{' '}
          <strong>Changes must be made in writing.</strong> A virtual proof
          without an order is $10.
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
          <li>Screen Charge: $30 per imprint colour</li>
          <li>Re-print Set-up: $20 per imprint colour</li>
          <li>Less than minimum (15pc): $20.00</li>
          <li>Art Charges: $50.00/hr</li>
          <li>First Virtual Proof: FREE</li>
          <li>Additional Virtual Proofs (due to client changes): $5.00 ea.</li>
          <li>Virtual Proof Without Order: $10.00</li>
          <li>Fold: $0.10 ea. | Fold &amp; Bag: $0.25 ea.</li>
          <li>1 Colour Name: $4.00 ea.</li>
          <li>1 Colour Number: $3.00 ea.</li>
          <li>Additional print charges may apply on specialty items.</li>
        </FAQList>

        <p>
          <strong>Colour Garments:</strong>
          <br />
          Add 1 imprint colour for each location on items requiring a base or
          flash.
        </p>

        <SectionTitle>Turnaround & Rush</SectionTitle>
        <p>
          <strong>Standard turnaround?</strong>
          <br />
          Normally 5–7 business days from artwork approval and garment arrival.
          Peak season (April–mid November) can reach 10–15 business days.
          <br />
          <strong>Important:</strong> Orders received after 12pm will be counted
          as next day.
          <br />
          <strong>
            Art must be approved &amp; goods must be received at least 3 days
            before your requested due date.
          </strong>
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
          <strong>Shipping Info:</strong>
          <br />
          1014 First St E., Cornwall, ON.
          <br />
          We ship Canada-wide. Local pickup available at our Cornwall location.
          <br />
          <strong>Insurance:</strong> Additional $5.00 S&amp;H charged if
          insurance is needed. Amount must be provided.
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

        <SectionTitle>Order Submission Guidelines</SectionTitle>
        <p>
          <strong>P.O. must include:</strong>
        </p>
        <FAQList>
          <li>Brand(s), style(s), colour(s)</li>
          <li>Sizes, print locations</li>
          <li>Shipping info &amp; requested due date</li>
        </FAQList>
        <p>
          <strong>
            Orders received after 12pm will be counted as next day.
          </strong>
        </p>

        <SectionTitle>Under Runs and Spoilage / Damage Rate</SectionTitle>
        <p>
          <strong>
            We reserve the right to bill &amp; ship 2% under the quantity
            ordered.
          </strong>
          <br />
          Spoilage / damage rate of 2% or 3 pieces — customer is responsible
          for. Above 2% or 3 pieces, T.T.P. is responsible.
          <br />
          <strong>
            (Replacement or credit does not apply to items not intended for ASI
            use)
          </strong>
          <br />
          <strong>Damage claims must be made within 5 business days.</strong>
        </p>
      </FAQCard>
    </FAQContainer>
  </Layout>
);

export default FAQ;
