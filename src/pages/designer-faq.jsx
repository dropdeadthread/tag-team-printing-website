import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'gatsby';

const DesignerFAQ = () => {
  return (
    <Layout>
      <div
        style={{
          backgroundImage: 'url(/images/website-blank-ripped-comic-page.png)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          padding: '4rem 2rem',
          color: '#f5f5f5',
          fontFamily: "'Bebas Neue', 'Impact', sans-serif",
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            textAlign: 'center',
            marginBottom: '2rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            borderBottom: '4px solid #222',
            display: 'inline-block',
            paddingBottom: '0.5rem',
          }}
        >
          Designer FAQ
        </h1>

        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            backgroundColor: 'rgba(10, 10, 10, 0.85)',
            padding: '2rem',
            border: '2px solid #111',
            boxShadow: '0 0 20px rgba(0,0,0,0.6)',
          }}
        >
          {/* QUOTES & PRICING */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#0070d1' }}>
              How do I get a quote?
            </h2>
            <p>
              The fastest way to get an accurate quote is to fill out our{' '}
              <Link
                to="/contact"
                style={{ color: '#0070d1', fontWeight: 'bold' }}
              >
                contact form
              </Link>{' '}
              with your design details, garment choices, and quantities. For
              custom projects outside standard products, you can also email us
              directly.
            </p>
            <Link
              to="/contact"
              style={{
                display: 'inline-block',
                backgroundColor: '#0070d1',
                color: '#fff',
                padding: '0.6rem 1.2rem',
                fontWeight: 'bold',
                marginTop: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Get a Quote
            </Link>
          </section>

          {/* DESIGN SERVICES */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#0070d1' }}>
              Do you offer design help?
            </h2>
            <p>
              Absolutely. Whether you need your existing artwork prepped for
              print or want a full custom design from scratch, our in-house
              designers can help. Technical file prep starts{' '}
              <strong>at $25/hr</strong>, while full creative projects start{' '}
              <strong>at $50/hr</strong>.
            </p>
          </section>

          {/* TURNAROUND */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#0070d1' }}>
              What&apos;s your turnaround time?
            </h2>
            <p>
              Standard production time is typically{' '}
              <strong>5–7 business days</strong> after art approval and
              receiving garments. During peak seasons (April–November),
              turnaround can extend to <strong>10–15 business days</strong>.
            </p>
          </section>

          {/* FILE SUBMISSION */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#0070d1' }}>
              What file formats do you accept?
            </h2>
            <p>
              For best results, send vector files: <code>.AI</code>,{' '}
              <code>.EPS</code>, or <code>.PDF</code> with text converted to
              outlines. For raster designs, send layered <code>.PSD</code> files
              at 300 DPI at actual print size.
            </p>
          </section>

          {/* REPEAT CLIENT DISCOUNTS */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#0070d1' }}>
              Do you offer discounts for repeat clients?
            </h2>
            <p>
              Yes — and we&apos;re upfront about it. We&apos;d rather you know
              what the relationship looks like so you can decide where your
              print budget goes. Clients who order consistently earn a standing
              rate, applied automatically after a few orders. No signup. No
              monthly fee. No penalty for a slow season.
            </p>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '1rem',
                fontSize: '0.95rem',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '2px solid #0070d1',
                    textAlign: 'left',
                  }}
                >
                  <th style={{ padding: '0.4rem 0.8rem' }}>
                    Ordering frequency
                  </th>
                  <th style={{ padding: '0.4rem 0.8rem' }}>Standing rate</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '0.4rem 0.8rem' }}>
                    Occasional — 2–3 orders/year
                  </td>
                  <td style={{ padding: '0.4rem 0.8rem' }}>
                    10% off setup fees on repeat designs
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '0.4rem 0.8rem' }}>
                    Regular — quarterly or more
                  </td>
                  <td style={{ padding: '0.4rem 0.8rem' }}>
                    10% off setup + 5% off per-piece pricing
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.4rem 0.8rem' }}>
                    Volume — 100+ pieces/run, recurring
                  </td>
                  <td style={{ padding: '0.4rem 0.8rem' }}>
                    Contract rate, quoted per project
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              style={{
                marginTop: '1rem',
                fontSize: '0.9rem',
                color: '#bbb',
                fontFamily: 'sans-serif',
              }}
            >
              This is what your year looks like if you order at this pace — not
              a subscription, not a contract. Order when you have work. The rate
              reflects the relationship.
            </p>
          </section>

          {/* SCREEN REORDERS */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#0070d1' }}>
              Do I pay setup fees every time I reorder?
            </h2>
            <p>
              No. We keep your screens on file. Reorders of the same design
              within <strong>12 months</strong> carry no setup charge — just
              per-piece print cost plus garments. After 12 months a reduced
              re-burn fee may apply if the screen needs re-coating, but
              we&apos;ll always confirm before charging anything new.
            </p>
          </section>

          {/* CONTRACTS */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#0070d1' }}>
              Do you require contracts or minimum commitments?
            </h2>
            <p>
              No. We don&apos;t require contracts or lock-in commitments for
              loyalty pricing. If you order consistently, we recognize it and
              price accordingly. If you need a written contract rate for your
              own budgeting or procurement process, we can put one together —
              but it&apos;s your call, never a requirement.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              Volume contract pricing for corporate clients with recurring
              minimum-order commitments is available and quoted on request.
              These are volume rates based on order size and predictability —
              we&apos;ll explain how they differ from loyalty pricing clearly
              before you decide.
            </p>
          </section>

          {/* COLOUR MATCHING */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#0070d1' }}>
              Can you match my exact colours?
            </h2>
            <p>
              We always aim to get as close as possible to what you hand us.
              That said, screen printing has real process limitations worth
              knowing upfront:
            </p>
            <ul
              style={{
                marginTop: '0.75rem',
                paddingLeft: '1.5rem',
                lineHeight: '1.9',
                fontFamily: 'sans-serif',
                fontSize: '0.95rem',
              }}
            >
              <li>
                <strong>Stock inks:</strong> We carry a full range of standard
                ink colours and will match as closely as possible at no extra
                charge.
              </li>
              <li>
                <strong>Custom/Pantone mixing:</strong> Exact Pantone or
                brand-colour matching is available as an add-on — ask when
                quoting.
              </li>
              <li>
                <strong>Gradients and blending:</strong> These require halftone
                simulation in screen printing. We&apos;ll flag any design
                elements that will be affected and confirm with you before going
                to press.
              </li>
              <li>
                <strong>Garment colour:</strong> Ink appearance shifts depending
                on the garment colour beneath it. We&apos;ll advise on underbase
                requirements if your design needs it.
              </li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              We&apos;d rather have the conversation upfront than surprise you
              at pickup. If something in your design will print differently than
              it looks on screen, we&apos;ll tell you before we burn a screen.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default DesignerFAQ;
