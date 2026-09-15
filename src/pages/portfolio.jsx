import React, { useState } from 'react';
import { Link } from 'gatsby';
import Layout from '../components/Layout';

const seoProps = {
  title: 'Portfolio — Tag Team Printing',
  description:
    'Screen printing, custom apparel, embroidery, and DTF work by Tag Team Printing in Cornwall, ON. Bands, breweries, events, corporate — we print it.',
  keywords: [
    'screen printing portfolio',
    'custom apparel cornwall ontario',
    'band merch printing',
    'corporate shirts',
    'event printing',
  ],
};

// ─── Portfolio entries ────────────────────────────────────────────────────────
// To add a job: export a JPG/PNG from your PSD, drop into /static/images/portfolio/ttp/
// then add an entry here.
const JOBS = [
  // ── Ready to populate — exported images go in /static/images/portfolio/ttp/ ──
  // {
  //   slug: '88-acres',
  //   title: '88 Acres — Band Tee',
  //   category: 'Band Merch',
  //   quantity: '48 pcs',
  //   colors: '2 colour front',
  //   garment: 'Gildan 5000',
  //   tags: ['punk', 'band', 'screen print'],
  //   img: '/images/portfolio/ttp/88-acres.jpg',
  // },
  // {
  //   slug: 'cedar-lake',
  //   title: 'Cedar Lake — Event Shirt',
  //   category: 'Events',
  //   quantity: '72 pcs',
  //   colors: '1 colour front',
  //   garment: 'Gildan 64000',
  //   tags: ['event', 'screen print'],
  //   img: '/images/portfolio/ttp/cedar-lake.jpg',
  // },
  // {
  //   slug: 'curea',
  //   title: 'CUREA — Corporate Branded Apparel',
  //   category: 'Corporate',
  //   quantity: '36 pcs',
  //   colors: '2 colour',
  //   garment: 'Next Level 6210',
  //   tags: ['corporate', 'logo', 'screen print'],
  //   img: '/images/portfolio/ttp/curea.jpg',
  // },
];

// Categories for filter — keep even when no jobs exist yet so structure is ready
const ALL_CATS = [
  'All',
  'Band Merch',
  'Corporate',
  'Events',
  'Brewery',
  'Schools',
  'Fundraiser',
];

// What we do — shown as feature cards when no portfolio photos exist yet
const CAPABILITIES = [
  {
    title: 'Screen Printing',
    icon: '🖨',
    desc: 'Water-based and plastisol inks. Spot colour, halftone, simulated process. Up to 6 colours per location. Minimums from 24 pieces.',
  },
  {
    title: 'DTF (Direct-to-Film)',
    icon: '🎨',
    desc: 'No minimum orders. Full colour photo-quality transfers on any garment, including polyester and dark fabrics. Great for small runs and complex art.',
  },
  {
    title: 'Embroidery',
    icon: '🪡',
    desc: 'Hats, polos, bags, workwear. Logo digitising included. Clean professional finish for corporate and branded apparel.',
  },
  {
    title: 'Bulk Apparel',
    icon: '📦',
    desc: 'Wholesale blanks from Gildan, Bella+Canvas, AS Colour, Next Level, District, and more via S&S Activewear. Best pricing on volume.',
  },
  {
    title: 'Rush Orders',
    icon: '⚡',
    desc: '48-72 hour turnaround available on select jobs. Reach out before ordering to confirm availability.',
  },
  {
    title: 'Design Services',
    icon: '✏️',
    desc: 'Full in-house design by Stacey Forrester. Logo work, apparel graphics, colour separation, artwork prep — we take it from concept to print-ready.',
  },
];

const INDUSTRIES = [
  {
    name: 'Bands & Musicians',
    blurb: 'Tour merch, fan shirts, limited runs. We know the scene.',
  },
  {
    name: 'Breweries & Bars',
    blurb:
      'Branded polos, event tees, staff uniforms, pint glasses — we do it all.',
  },
  {
    name: 'Schools & Teams',
    blurb: 'Grad shirts, team jerseys, spirit wear, fundraiser runs.',
  },
  {
    name: 'Corporate & Business',
    blurb: 'Staff uniforms, branded merch, trade show swag, client gifts.',
  },
  {
    name: 'Events & Festivals',
    blurb: 'Volunteer shirts, participant tees, sponsor branding.',
  },
  {
    name: 'Community & Non-Profit',
    blurb: 'Fundraiser tees, awareness campaigns, charity runs.',
  },
];

const redLine = {
  color: '#000',
  borderBottom: '2px solid #c32b14',
  paddingBottom: '0.5rem',
  marginBottom: '1.5rem',
};

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? JOBS
      : JOBS.filter((j) => j.category === activeCategory);

  return (
    <Layout seoProps={seoProps}>
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '3rem 1.5rem',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              color: '#c32b14',
              marginBottom: '0.75rem',
            }}
          >
            Our Work
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#444',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            10+ years of custom screen printing, apparel, embroidery, and DTF
            from Cornwall, Ontario. Bands, breweries, schools, corporates,
            events — if it needs a logo on it, we print it.
          </p>
        </div>

        {/* What We Do */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={redLine}>What We Do</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                style={{
                  border: '2px solid #000',
                  borderRadius: '6px',
                  padding: '1.5rem',
                  background: '#fff',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  {cap.icon}
                </div>
                <h3
                  style={{
                    margin: '0 0 0.5rem',
                    color: '#c32b14',
                    fontSize: '1rem',
                  }}
                >
                  {cap.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: '#555',
                    lineHeight: 1.6,
                  }}
                >
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Portfolio Gallery */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={redLine}>Print Work</h2>

          {/* Category filter */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '2rem',
            }}
          >
            {ALL_CATS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '7px 16px',
                  border: '2px solid #000',
                  background: activeCategory === cat ? '#c32b14' : '#fff',
                  color: activeCategory === cat ? '#fff' : '#000',
                  fontFamily: 'inherit',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {filtered.map((job) => (
                <div
                  key={job.slug}
                  style={{
                    border: '2px solid #000',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    background: '#fff',
                  }}
                >
                  <img
                    src={job.img}
                    alt={job.title}
                    style={{
                      width: '100%',
                      height: '260px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    loading="lazy"
                  />
                  <div style={{ padding: '1rem' }}>
                    <h3
                      style={{
                        margin: '0 0 0.4rem',
                        fontSize: '1rem',
                        color: '#000',
                      }}
                    >
                      {job.title}
                    </h3>
                    {job.quantity && (
                      <p
                        style={{
                          margin: '0 0 0.25rem',
                          fontSize: '0.8rem',
                          color: '#666',
                        }}
                      >
                        {job.quantity} · {job.colors} · {job.garment}
                      </p>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '4px',
                        marginTop: '0.5rem',
                      }}
                    >
                      {job.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: '0.7rem',
                            border: '1px solid #ccc',
                            borderRadius: '2px',
                            padding: '1px 5px',
                            color: '#666',
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                border: '2px dashed #ccc',
                borderRadius: '8px',
                padding: '3rem',
                textAlign: 'center',
                background: '#fafafa',
              }}
            >
              <p
                style={{
                  fontSize: '1rem',
                  color: '#666',
                  marginBottom: '0.5rem',
                }}
              >
                Client print photos coming soon.
              </p>
              <p style={{ fontSize: '0.9rem', color: '#999', margin: 0 }}>
                In the meantime — place an order and become part of the
                portfolio.
              </p>
            </div>
          )}
        </section>

        {/* Industries Served */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={redLine}>Who We Print For</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            {INDUSTRIES.map((ind) => (
              <div
                key={ind.name}
                style={{
                  borderLeft: '4px solid #c32b14',
                  paddingLeft: '1rem',
                  paddingTop: '0.25rem',
                  paddingBottom: '0.25rem',
                }}
              >
                <strong
                  style={{
                    display: 'block',
                    marginBottom: '0.25rem',
                    color: '#000',
                  }}
                >
                  {ind.name}
                </strong>
                <span style={{ fontSize: '0.9rem', color: '#555' }}>
                  {ind.blurb}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            background: '#000',
            color: '#fff',
            borderRadius: '8px',
            padding: '2.5rem',
            textAlign: 'center',
          }}
        >
          <h2
            style={{ margin: '0 0 0.75rem', color: '#fff', fontSize: '1.8rem' }}
          >
            Ready to Print?
          </h2>
          <p
            style={{
              margin: '0 0 1.5rem',
              color: '#ccc',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            Get a quote in minutes. No minimums on DTF. Competitive pricing on
            screen print runs of 24+.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/order"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: '#c32b14',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                borderRadius: '4px',
              }}
            >
              Get a Quote
            </Link>
            <Link
              to="/contact"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: '#fff',
                color: '#000',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                borderRadius: '4px',
              }}
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
