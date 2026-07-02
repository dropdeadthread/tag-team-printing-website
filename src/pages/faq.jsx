import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

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
  margin-bottom: 2.5rem;
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
  border-bottom: 2px solid #2563eb;
  padding-bottom: 0.4rem;
`;

const FAQList = styled.ul`
  margin: 0 0 1.5rem 1.5rem;
  padding: 0;
  list-style: disc inside;
`;

const PoliciesNote = styled.div`
  background: #f0f4ff;
  border: 1px solid #c7d2fe;
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  margin-top: 0.5rem;
`;

const FAQ = () => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'I have an idea but no artwork — can you help?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely. We can create a custom design from scratch or clean up artwork you already have. Design services are billed at $50/hour, and your first virtual proof is included at no charge.',
        },
      },
      {
        '@type': 'Question',
        name: 'What file types do you accept for screen printing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We recommend vector artwork (.AI, .EPS, or .PDF) for the best print quality. We also accept layered Photoshop (.PSD) files at 300 DPI or higher, sized to the final print dimensions. If your job requires specific Pantone (PMS) colours, please include them with your artwork.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is your minimum order quantity?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our minimum is 12 pieces for all screen printing, regardless of the number of colours. Orders under 12 pieces are accepted with a $20 surcharge.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is your standard turnaround time?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our standard turnaround is 5–7 business days after artwork approval and receipt of garments. During our busiest season (April through mid-November), turnaround may extend to 10–15 business days. Orders received after 12:00 PM are processed the next business day. Rush service is available for many orders — contact us before placing your order so we can confirm availability.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you ship across Canada?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We ship anywhere in Canada, and local pickup is available from our Cornwall location at 1016 First St E, Cornwall, Ontario.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you supply garments, or can I provide my own?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes to both. We carry a wide selection of quality wholesale apparel and can help you choose the right product for your project. You're also welcome to supply your own garments, provided they're new and suitable for printing. Customer-supplied items are printed at the customer's risk.",
        },
      },
      {
        '@type': 'Question',
        name: 'What brands do you carry?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We source through S&S Activewear and SanMar, giving us access to brands including Gildan, Next Level, Bella+Canvas, Comfort Colors, AS Colour, ATC, and more.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I mix sizes in one order?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Your minimum is based on the total quantity across all sizes — not per size. So an order of 12 pieces can include any combination of sizes you need.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you print on dark garments?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Dark garments require an underbase — a white layer printed first to make colours pop. This adds one additional colour to your setup cost.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many colours can you print?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We can print up to six spot colours per location using standard screen printing. For unlimited colours or photographic artwork, DTF printing is a great option — no screen setup, no colour limits.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can you match Pantone colours?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes. If your design requires specific Pantone (PMS) colours, include them with your artwork submission and we'll mix ink to match. Please note that screen printing ink on fabric may vary slightly from printed or digital colour references.",
        },
      },
      {
        '@type': 'Question',
        name: 'Can I reorder a past job?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. If we still have your artwork and screens on file, reordering is quick and can often reduce setup costs. While we frequently retain screens for a period after production, long-term storage cannot be guaranteed.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can my final quantity vary slightly?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Because screen printing is a production process, completed quantities may vary by up to 2% (or three pieces, whichever is greater). Orders are billed based on the quantity shipped. If production issues exceed this allowance, Tag Team Printing will replace or credit the affected items where applicable.',
        },
      },
    ],
  };

  return (
    <Layout>
      <SEO
        title="FAQ | Tag Team Printing Cornwall Ontario"
        description="Answers about quotes, turnaround, file setup, garments, and ordering with Tag Team Printing in Cornwall, Ontario."
        url="/faq"
        schema={faqSchema}
      />
      <FAQContainer>
        <FAQCard>
          <div
            style={{
              background: '#e0e7ff',
              border: '2px solid #2563EB',
              borderRadius: '8px',
              padding: '1.2rem 1.5rem',
              marginBottom: '2rem',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '1.05rem',
            }}
          >
            Looking for artwork and design information?{' '}
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
            for answers about file prep and creative projects.
          </div>

          <FAQTitle>Frequently Asked Questions</FAQTitle>

          <SectionTitle>Getting Started</SectionTitle>

          <p>
            <strong>I have an idea but no artwork — can you help?</strong>
            <br />
            Absolutely. We can create a custom design from scratch or clean up
            artwork you already have. Design services are billed at $50/hour,
            and your first virtual proof is included at no charge.
          </p>
          <p>
            <strong>What information do I need to start my order?</strong>
            <br />
            To get things moving, we&apos;ll need:
          </p>
          <FAQList>
            <li>Garment brand, style, and colour</li>
            <li>Sizes and quantities</li>
            <li>Print locations (front, back, left chest, etc.)</li>
            <li>Your artwork or design concept</li>
            <li>Requested due date and shipping or pickup preference</li>
          </FAQList>
          <p>
            <strong>How do I get a quote?</strong>
            <br />
            Use our <a href="/order">online order form</a> for instant pricing
            on most jobs. For custom or specialty orders,{' '}
            <a href="/contact">contact us directly</a> and we&apos;ll put
            something together for you.
          </p>

          <SectionTitle>Artwork &amp; File Setup</SectionTitle>

          <p>
            <strong>What file types do you accept?</strong>
            <br />
            We recommend vector artwork (.AI, .EPS, or .PDF) for the best print
            quality. We also accept layered Photoshop (.PSD) files at 300 DPI or
            higher, sized to the final print dimensions. If your job requires
            specific Pantone (PMS) colours, please include them with your
            artwork.
          </p>
          <p>
            <strong>Can I get a proof before printing?</strong>
            <br />
            Yes — your first virtual proof is free. Additional proofs required
            due to client changes are $5 each. A proof without a confirmed order
            is $10. All change requests must be made in writing.
          </p>

          <SectionTitle>Garments &amp; Products</SectionTitle>

          <p>
            <strong>Do you supply garments, or can I provide my own?</strong>
            <br />
            Yes to both. We offer a wide selection of quality wholesale apparel
            and can help you choose the right product for your project.
            You&apos;re also welcome to supply your own garments, provided
            they&apos;re new and suitable for printing. Customer-supplied items
            are printed at the customer&apos;s risk.
          </p>
          <p>
            <strong>What brands do you carry?</strong>
            <br />
            We source through S&amp;S Activewear and SanMar, giving us access to
            brands including Gildan, Next Level, Bella+Canvas, Comfort Colors,
            AS Colour, ATC, and more. Browse our{' '}
            <a href="/brands">brands page</a> or ask us about a specific style.
          </p>
          <p>
            <strong>Can I mix sizes in one order?</strong>
            <br />
            Yes. Your minimum is based on the total quantity across all sizes —
            not per size. An order of 12 pieces can include any combination of
            sizes you need.
          </p>
          <p>
            <strong>Do you print on dark garments?</strong>
            <br />
            Yes. Dark garments require an underbase — a white layer printed
            first to make colours pop. This adds one additional colour to your
            setup cost. We&apos;ll flag this when we review your artwork.
          </p>

          <SectionTitle>Printing Options</SectionTitle>

          <p>
            <strong>How many colours can you print?</strong>
            <br />
            We can print up to six spot colours per location with standard
            screen printing. For unlimited colours or photographic artwork, DTF
            printing is a great option — no screen setup, no colour limits.
          </p>
          <p>
            <strong>Can you match Pantone colours?</strong>
            <br />
            Yes. Include your Pantone (PMS) colour codes with your artwork
            submission and we&apos;ll mix ink to match. Keep in mind that screen
            printing ink on fabric may vary slightly from printed or digital
            colour references.
          </p>

          <SectionTitle>Ordering &amp; Turnaround</SectionTitle>

          <p>
            <strong>What&apos;s your minimum order?</strong>
            <br />
            Our minimum is 12 pieces for all screen printing, regardless of the
            number of colours. Orders under 12 pieces are accepted with a $20
            surcharge.
          </p>
          <p>
            <strong>What is your standard turnaround time?</strong>
            <br />
            Our standard turnaround is 5–7 business days after artwork approval
            and receipt of garments. During our busiest season (April through
            mid-November), turnaround may extend to 10–15 business days.
            <br />
            <br />
            Orders received after 12:00 PM are processed the next business day.
            Rush service is available for many orders — contact us before
            placing your order so we can confirm availability.
          </p>
          <p>
            <strong>Do you offer rush orders?</strong>
            <br />
            Yes, on most orders. Contact us before placing your order to confirm
            availability. Rush fees are based on your required timeline and
            added to your total. See the fees section below for details.
          </p>
          <p>
            <strong>Do you ship across Canada?</strong>
            <br />
            Yes. We ship anywhere in Canada, and local pickup is available from
            our Cornwall location at 1016 First St E. Local delivery may also be
            available — just ask.
          </p>
          <p>
            <strong>Can I reorder a past job?</strong>
            <br />
            Yes. If we still have your artwork and screens on file, reordering
            is quick and can often reduce setup costs. While we frequently
            retain screens for a period after production, long-term storage
            cannot be guaranteed. Reach out and we&apos;ll check what we have on
            file.
          </p>
          <p>
            <strong>Can my final quantity vary slightly?</strong>
            <br />
            Because screen printing is a production process, completed
            quantities may vary by up to 2% (or three pieces, whichever is
            greater). Orders are billed based on the quantity shipped. If
            production issues exceed this allowance, Tag Team Printing will
            replace or credit the affected items where applicable.
          </p>
          <p>
            <strong>What if there&apos;s an issue with my order?</strong>
            <br />
            Please inspect your order upon receipt. Any damage or production
            issues must be reported within five business days of delivery.
          </p>

          <SectionTitle>Shop Policies &amp; Additional Fees</SectionTitle>

          <PoliciesNote>
            <p
              style={{
                margin: '0 0 1rem 0',
                fontSize: '0.95rem',
                color: '#1e3a8a',
              }}
            >
              The following fees may apply to your order depending on your
              project requirements. All pricing is in CAD.
            </p>
            <FAQList style={{ marginBottom: '1rem' }}>
              <li>Screen charge: $30.00 per imprint colour</li>
              <li>Re-print setup: $20.00 per imprint colour</li>
              <li>Art charges: $50.00/hr</li>
              <li>First virtual proof: Free</li>
              <li>Additional proofs (client changes): $5.00 each</li>
              <li>Virtual proof without order: $10.00</li>
              <li>Under minimum surcharge (fewer than 12 pieces): $20.00</li>
              <li>Fold: $0.10 ea. &nbsp;|&nbsp; Fold &amp; Bag: $0.25 ea.</li>
              <li>1-colour name: $4.00 ea.</li>
              <li>1-colour number: $3.00 ea.</li>
              <li>
                Shipping insurance: $5.00 (coverage amount must be specified)
              </li>
              <li>Additional charges may apply on specialty items</li>
            </FAQList>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                color: '#1e3a8a',
              }}
            >
              Rush order fees:
            </p>
            <FAQList style={{ marginBottom: '0.5rem' }}>
              <li>5-day turnaround: +20%</li>
              <li>4-day turnaround: +30%</li>
              <li>3-day turnaround: +40%</li>
              <li>2-day turnaround: +50%</li>
            </FAQList>
            <p style={{ margin: '0', fontSize: '0.9rem', color: '#374151' }}>
              Dark garments requiring a base or flash: add 1 imprint colour per
              print location.
            </p>
          </PoliciesNote>
        </FAQCard>
      </FAQContainer>
    </Layout>
  );
};

export default FAQ;
