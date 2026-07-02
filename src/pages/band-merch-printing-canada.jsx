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
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Custom Band Merch Printing Canada',
    description:
      'Custom screen-printed band merchandise for Canadian bands and independent artists. Tour shirts, hoodies, concert merch, and musician apparel with a 12-piece minimum and fast turnaround. Based in Cornwall, Ontario.',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Tag Team Printing',
      url: 'https://tagteamprints.com',
      telephone: '+1-613-363-4997',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1016 First St E',
        addressLocality: 'Cornwall',
        addressRegion: 'ON',
        postalCode: 'K6H 1N4',
        addressCountry: 'CA',
      },
    },
    areaServed: { '@type': 'Country', name: 'Canada' },
    serviceType: 'Band Merchandise Screen Printing',
    url: 'https://tagteamprints.com/band-merch-printing-canada',
    offers: {
      '@type': 'Offer',
      description:
        'Custom band merch printing — 12-piece minimum, free quotes, ships anywhere in Canada.',
      priceCurrency: 'CAD',
      seller: { '@type': 'LocalBusiness', name: 'Tag Team Printing' },
    },
  };

  return (
    <Layout>
      <SEO
        title="Custom Band Merch Printing in Canada | Screen Printing for Bands & Artists"
        description="Custom screen-printed merch for Canadian bands, tours, and independent artists. Tour shirts, hoodies, festival merchandise, and more — 12-piece minimum, fast turnaround, ships anywhere in Canada."
        url="/band-merch-printing-canada"
        keywords="band merch printing Canada, tour shirts, custom band merchandise, concert merch printing, musician apparel, screen printing Canada, tour merchandise"
        schema={schema}
      />
      <PageContainer>
        <ContentCard>
          <PageTitle>Custom Band Merch Printing in Canada</PageTitle>

          <p>
            Whether you're printing concert merchandise for your first local
            show, a cross-Canada tour, or your next album release, Tag Team
            Printing helps bands create merch that looks great, sells well, and
            arrives on time. We print custom band shirts and musician apparel
            for independent artists across Canada — with a 12-piece minimum and
            a standard one-week turnaround.
          </p>

          <h2>Why Bands Choose Tag Team Printing</h2>
          <ul>
            <li>
              Low 12-piece minimums — perfect for local shows and independent
              artists
            </li>
            <li>Fast turnaround when tour dates are approaching</li>
            <li>
              Durable prints that hold up to life on the road and nights on
              stage
            </li>
            <li>
              Full-colour artwork, multi-colour designs, and specialty inks
            </li>
            <li>We ship concert merchandise anywhere in Canada</li>
            <li>
              Design help available if your artwork isn't print-ready — see our{' '}
              <a href="/design-services">design services</a>
            </li>
          </ul>

          <h2>We're Musicians Too</h2>
          <p>
            Unlike most commercial print shops, Tag Team Printing is run by
            people who actually play shows, book bands, and design posters.
            Through <strong>Split Toe Records</strong>, we've worked directly
            with independent artists and understand the realities of selling
            band merch at a show — keeping costs down, nailing the artwork, and
            making a tour deadline. That experience shapes how we approach every
            order.
          </p>
          <p>
            Stacey Case has spent over 20 years in the Ontario music scene,
            designing flyers and artwork for bands across Cornwall and London
            and playing shows across the province. That background isn't a
            marketing line — it's why we take band orders seriously and
            understand what's actually at stake when your merch needs to be at
            the venue by Friday.
          </p>

          <h2>What We Print for Bands</h2>
          <p>
            We can put your artwork on almost any garment. Popular choices for
            touring artists and concert merchandise include:
          </p>
          <ul>
            <li>Tour shirts and custom band tees</li>
            <li>Album release shirts and limited edition runs</li>
            <li>Hoodies and crew necks</li>
            <li>Long sleeves</li>
            <li>Festival merchandise</li>
            <li>VIP or limited merch drops</li>
            <li>Tote bags</li>
            <li>Hats</li>
          </ul>
          <p>
            We use{' '}
            <a href="/screen-printing-cornwall-ontario">screen printing</a> for
            most band merch orders — it's durable, cost-effective at volume, and
            gives you crisp, vibrant results under stage lights. For full-colour
            artwork, photo prints, or smaller runs without screen setup,{' '}
            <a href="/dtf-printing-canada">DTF printing</a> is a great option
            with no colour limits. Not sure which is right for your design?{' '}
            <a href="/contact">Ask us</a>.
          </p>

          <h2>From Idea to Merch Table</h2>
          <ol>
            <li>
              Send us your artwork — or we'll help you create or clean it up.
            </li>
            <li>Approve your digital proof.</li>
            <li>We print your order.</li>
            <li>Pick it up in Cornwall or ship it anywhere in Canada.</li>
          </ol>

          <h2>Band Merch FAQ</h2>

          <h3>Can you print tour merch on a tight deadline?</h3>
          <p>
            Yes. Whether you're heading out for a weekend run or a cross-country
            tour, we can produce musician apparel that arrives on schedule. Give
            us your hard deadline upfront and we'll tell you whether rush
            service is needed.
          </p>

          <h3>Can you ship directly to our rehearsal space or a tour stop?</h3>
          <p>
            Yes. We ship anywhere in Canada — rehearsal space, home address, or
            wherever you need it. Just let us know your timeline when you order.
          </p>

          <h3>Can you help with merch design?</h3>
          <p>
            Yes. We can build something from scratch or clean up artwork that
            isn't quite print-ready. Design is billed at $50/hr and your first
            proof is always free. See our{' '}
            <a href="/design-services">design services page</a> for more.
          </p>

          <h3>What garments are most popular for bands?</h3>
          <p>Most bands go for:</p>
          <ul>
            <li>Heavyweight or vintage-style tees</li>
            <li>Hoodies</li>
            <li>Long sleeves</li>
            <li>Tote bags</li>
          </ul>
          <p>
            Browse our <a href="/brands">brands page</a> to see what we carry,
            or ask us for a recommendation based on your budget and look.
          </p>

          <h3>What's the minimum order for band merch?</h3>
          <p>
            12 pieces for{' '}
            <a href="/screen-printing-cornwall-ontario">screen printing</a>, any
            combination of sizes. For smaller runs,{' '}
            <a href="/dtf-printing-canada">DTF printing</a> has no minimum.
          </p>

          <h3>Can I reorder later?</h3>
          <p>
            Yes. Once your artwork is on file, reordering is straightforward and
            setup costs may be reduced if we still have your screens. Reach out
            and we'll check what's on file.
          </p>

          <h3>What's your standard turnaround?</h3>
          <p>
            One week after artwork approval and receipt of garments. Rush
            service is available on most orders — contact us before placing your
            order to confirm availability. See our <a href="/faq">FAQ</a> for
            rush fee details.
          </p>

          <CTABox>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
              Ready to get your merch made?
            </p>
            <CTALink href="/order">Get a Free Quote</CTALink>
          </CTABox>
        </ContentCard>
      </PageContainer>
    </Layout>
  );
};

export default BandMerchPrintingCanada;
