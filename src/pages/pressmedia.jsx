import React from 'react';
import Layout from '../components/Layout';

const PressPage = () => (
  <Layout>
    <div
      style={{
        maxWidth: '1000px',
        margin: '2rem auto',
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
      }}
    >
      <h1
        style={{ textAlign: 'center', marginBottom: '2rem', color: '#c32b14' }}
      >
        Press & Media
      </h1>

      {/* Company Overview */}
      <section style={{ marginBottom: '3rem' }}>
        <div
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            border: '2px solid #000',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: '#c32b14', marginBottom: '1rem' }}>
            About Tag Team Printing
          </h2>
          <p
            style={{ fontSize: '18px', marginBottom: '1.5rem', color: '#333' }}
          >
            Tag Team Printing is Cornwall, Ontario&apos;s premier custom screen
            printing and apparel service, specializing in high-quality custom
            designs for businesses, events, and organizations.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginTop: '2rem',
            }}
          >
            <div>
              <h3 style={{ color: '#000', marginBottom: '0.5rem' }}>Founded</h3>
              <p
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#c32b14',
                  margin: 0,
                }}
              >
                2020
              </p>
            </div>
            <div>
              <h3 style={{ color: '#000', marginBottom: '0.5rem' }}>
                Location
              </h3>
              <p style={{ fontSize: '18px', margin: 0 }}>Cornwall, ON</p>
            </div>
            <div>
              <h3 style={{ color: '#000', marginBottom: '0.5rem' }}>
                Specialty
              </h3>
              <p style={{ fontSize: '18px', margin: 0 }}>
                Custom Screen Printing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Press Kit Download */}
      <section style={{ marginBottom: '3rem' }}>
        <h2
          style={{
            color: '#000',
            borderBottom: '2px solid #c32b14',
            paddingBottom: '0.5rem',
          }}
        >
          Press Kit
        </h2>
        <div
          style={{
            background: '#f8f9fa',
            padding: '2rem',
            borderRadius: '8px',
            border: '2px solid #000',
            marginTop: '1rem',
          }}
        >
          <p style={{ marginBottom: '1.5rem' }}>
            Download our complete press kit including high-resolution logos,
            company information, and marketing materials for media use.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '6px',
                border: '1px solid #ddd',
                textAlign: 'center',
              }}
            >
              <h4 style={{ margin: '0 0 1rem 0', color: '#c32b14' }}>
                Company Logos
              </h4>
              <p
                style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '1rem',
                }}
              >
                High-resolution PNG and vector formats
              </p>
              <a
                href="/images/logo.png"
                download
                style={{
                  background: '#c32b14',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  border: '2px solid #000',
                  display: 'inline-block',
                }}
              >
                Download Logo
              </a>
            </div>

            <div
              style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '6px',
                border: '1px solid #ddd',
                textAlign: 'center',
              }}
            >
              <h4 style={{ margin: '0 0 1rem 0', color: '#c32b14' }}>
                Company Info Sheet
              </h4>
              <p
                style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '1rem',
                }}
              >
                Complete company overview and statistics
              </p>
              <button
                onClick={() => {
                  // Generate and download company info sheet
                  const companyInfo = `
TAG TEAM PRINTING - COMPANY INFORMATION

COMPANY OVERVIEW:
Tag Team Printing is Cornwall, Ontario's premier custom screen printing and apparel service, specializing in high-quality custom designs for businesses, events, and organizations.

CONTACT INFORMATION:
Address: 1014 First St East, Cornwall, ON K6H 1N4
Phone: (613) 363-4997
Email: info@tagteamprints.com
Website: https://tagteamprints.com

BUSINESS HOURS:
Monday - Friday: 9:00 AM - 5:00 PM

SERVICES:
- Custom Screen Printing
- Apparel Design Services
- Blank Apparel Sales
- Corporate Branding
- Event Merchandise
- Small to Large Volume Orders

SPECIALTIES:
- High-quality screen printing
- Custom design services
- Fast turnaround times
- Competitive pricing
- Local Cornwall business

FOUNDED: 2020

TARGET MARKETS:
- Local businesses
- Schools and educational institutions
- Sports teams and clubs
- Non-profit organizations
- Corporate events
- Community groups

For media inquiries, please contact:
info@tagteamprints.com
(613) 363-4997
                  `;

                  const blob = new Blob([companyInfo], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'Tag_Team_Printing_Company_Info.txt';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                style={{
                  background: '#c32b14',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #000',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Download Info Sheet
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section style={{ marginBottom: '3rem' }}>
        <h2
          style={{
            color: '#000',
            borderBottom: '2px solid #c32b14',
            paddingBottom: '0.5rem',
          }}
        >
          Media Coverage
        </h2>
        <div style={{ marginTop: '1rem' }}>
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '8px',
              border: '2px solid #000',
              marginBottom: '1rem',
            }}
          >
            <h3 style={{ color: '#c32b14', marginBottom: '0.5rem' }}>
              Featured: Local Business Spotlight
            </h3>
            <p
              style={{ color: '#666', fontSize: '14px', marginBottom: '1rem' }}
            >
              Cornwall Community News • September 2025
            </p>
            <p style={{ marginBottom: '1rem' }}>
              &quot;Tag Team Printing has become a cornerstone of
              Cornwall&apos;s small business community, providing high-quality
              custom printing services that help local organizations and
              businesses make their mark. Their commitment to quality and
              community involvement sets them apart in the custom apparel
              industry.&quot;
            </p>
            <button
              style={{
                color: '#c32b14',
                textDecoration: 'none',
                fontWeight: 'bold',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontSize: 'inherit',
              }}
              onClick={() => {
                alert(
                  'Media coverage links would be added here when available.',
                );
              }}
            >
              Read Full Article →
            </button>
          </div>

          <div
            style={{
              background: '#f8f9fa',
              padding: '2rem',
              borderRadius: '8px',
              border: '1px solid #ddd',
              textAlign: 'center',
            }}
          >
            <h3 style={{ color: '#666', marginBottom: '1rem' }}>
              More Coverage Coming Soon
            </h3>
            <p style={{ color: '#666' }}>
              As Tag Team Printing continues to grow and serve the Cornwall
              community, additional media coverage and press mentions will be
              featured here.
            </p>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section style={{ marginBottom: '3rem' }}>
        <h2
          style={{
            color: '#000',
            borderBottom: '2px solid #c32b14',
            paddingBottom: '0.5rem',
          }}
        >
          Awards & Recognition
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '8px',
              border: '2px solid #000',
              textAlign: 'center',
            }}
          >
            <h3 style={{ color: '#c32b14', marginBottom: '1rem' }}>
              Community Champion
            </h3>
            <p
              style={{ color: '#666', fontSize: '14px', marginBottom: '1rem' }}
            >
              Cornwall Chamber of Commerce • 2024
            </p>
            <p style={{ fontSize: '14px' }}>
              Recognized for outstanding support of local community events and
              organizations.
            </p>
          </div>

          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '8px',
              border: '2px solid #000',
              textAlign: 'center',
            }}
          >
            <h3 style={{ color: '#c32b14', marginBottom: '1rem' }}>
              Excellence in Service
            </h3>
            <p
              style={{ color: '#666', fontSize: '14px', marginBottom: '1rem' }}
            >
              Local Business Awards • 2024
            </p>
            <p style={{ fontSize: '14px' }}>
              Outstanding customer service and quality in the printing industry.
            </p>
          </div>
        </div>
      </section>

      {/* Press Inquiries */}
      <section
        style={{
          background: '#c32b14',
          color: 'white',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ color: 'white', marginBottom: '1rem' }}>
          Press Inquiries
        </h2>
        <p style={{ marginBottom: '1.5rem', fontSize: '18px' }}>
          For media inquiries, interviews, or additional information about Tag
          Team Printing, please contact us directly.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginTop: '2rem',
          }}
        >
          <div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>
              Media Contact
            </h4>
            <p>
              <a
                href="mailto:info@tagteamprints.com"
                style={{ color: 'white' }}
              >
                info@tagteamprints.com
              </a>
            </p>
            <p>
              <a href="tel:+16133634997" style={{ color: 'white' }}>
                (613) 363-4997
              </a>
            </p>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>
              Response Time
            </h4>
            <p>
              We respond to all media inquiries within 24 hours during business
              days.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>
              Available For
            </h4>
            <p>Interviews • Photos • Local Events • Community Features</p>
          </div>
        </div>
      </section>
    </div>
  </Layout>
);

export default PressPage;
