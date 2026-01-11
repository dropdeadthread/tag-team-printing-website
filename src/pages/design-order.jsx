import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';

const OrderContainer = styled.div`
  min-height: 100vh;
  padding: 4rem 2rem 2rem 2rem;
  position: relative;
`;

const OrderCard = styled.div`
  max-width: 1000px;
  margin: 4.5rem auto 0 auto;
  background: rgba(255, 245, 209, 0.95);
  border: 3px solid #2563eb;
  box-shadow:
    0 0 20px rgba(37, 99, 235, 0.15),
    inset 0 0 10px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 2.5rem 2rem;
`;

const OrderTitle = styled.h1`
  font-family: 'HawlersEightRough', 'Impact', 'Arial Black', sans-serif;
  color: #2563eb;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const SectionTitle = styled.h2`
  font-family: 'HawlersEightRough', 'Impact', 'Arial Black', sans-serif;
  color: #ff5050;
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #2563eb;
  border-radius: 6px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #ff5050;
    box-shadow: 0 0 0 3px rgba(255, 80, 80, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #2563eb;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: #ff5050;
    box-shadow: 0 0 0 3px rgba(255, 80, 80, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #2563eb;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #ff5050;
    box-shadow: 0 0 0 3px rgba(255, 80, 80, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  cursor: pointer;

  input[type='checkbox'] {
    margin-right: 0.75rem;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`;

const PriceDisplay = styled.div`
  background: #e0e7ff;
  border: 3px solid #2563eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
  position: sticky;
  top: 20px;
  z-index: 10;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: ${(props) => (props.isTotal ? 'none' : '1px solid #cbd5e1')};
  font-weight: ${(props) => (props.isTotal ? 'bold' : 'normal')};
  font-size: ${(props) => (props.isTotal ? '1.4rem' : '1rem')};
  color: ${(props) => (props.isTotal ? '#2563eb' : '#333')};
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  background: #ff5050;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: bold;
  font-family: 'HawlersEightRough', 'Impact', 'Arial Black', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e63946;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 80, 80, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  background: #10b981;
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  background: #ef4444;
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  margin-top: 1rem;
`;

// Base pricing catalog
const BASE_PRICES = {
  logo_simple: 150,
  logo_standard: 300,
  logo_complex: 500,
  logo_intricate: 800,
  business_card: 100,
  flyer: 150,
  brochure: 300,
  poster: 250,
  tshirt_simple: 150,
  tshirt_detailed: 350,
  tshirt_allover: 600,
  illustration_spot: 200,
  illustration_halfpage: 400,
  illustration_fullpage: 700,
  character_simple: 300,
  character_detailed: 600,
  character_scene: 1000,
  package_simple: 400,
  package_complex: 800,
};

const ADD_ONS = [
  { id: 'vector_file', name: 'Vector Source Files (AI/EPS)', price: 50 },
  { id: 'mockup_realistic', name: 'Realistic Mockup', price: 75 },
  { id: 'style_guide', name: 'Brand Style Guide', price: 150 },
  { id: 'social_media_kit', name: 'Social Media Kit (3 sizes)', price: 200 },
  { id: 'print_ready_files', name: 'Print-Ready Files Package', price: 100 },
  { id: 'color_variations', name: '3 Color Variations', price: 75 },
  { id: 'mockup_multiple', name: 'Multiple Mockups (5+)', price: 150 },
  { id: 'animation_simple', name: 'Simple Animation/GIF', price: 400 },
];

const LICENSING_OPTIONS = [
  {
    id: 'basic',
    name: 'Basic License',
    multiplier: 1.0,
    desc: 'Single use, non-transferrable',
  },
  {
    id: 'extended_merch',
    name: 'Extended Merch License',
    multiplier: 1.5,
    desc: 'Up to 500 units',
  },
  {
    id: 'full_buyout',
    name: 'Full Buyout',
    multiplier: 3.0,
    desc: 'Complete ownership transfer',
  },
];

const RUSH_OPTIONS = [
  { id: 'none', name: 'Standard (7-10 business days)', percentage: 0, flat: 0 },
  {
    id: 'rush_3_5_days',
    name: 'Rush (3-5 business days)',
    percentage: 25,
    flat: 0,
  },
  { id: 'rush_72h', name: 'Express Rush (72 hours)', percentage: 50, flat: 0 },
  { id: 'rush_same_day', name: 'Same-Day Rush', percentage: 75, flat: 200 },
];

const DesignOrderPage = () => {
  // Client Information
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');

  // Project Details
  const [projectTitle, setProjectTitle] = useState('');
  const [projectType, setProjectType] = useState('logo');
  const [baseCategory, setBaseCategory] = useState('logo_standard');
  const [description, setDescription] = useState('');
  const [designBrief, setDesignBrief] = useState('');

  // Pricing Inputs
  const [conceptsRequested, setConceptsRequested] = useState(1);
  const [revisionsPlanned, setRevisionsPlanned] = useState(2);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [licensingTier, setLicensingTier] = useState('basic');
  const [rushLevel, setRushLevel] = useState('none');

  // Form State
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Calculate pricing
  const calculatePrice = () => {
    const basePrice = BASE_PRICES[baseCategory] || 0;

    // Extra concepts (first is included)
    const extraConceptsTotal = Math.max(0, conceptsRequested - 1) * 100;

    // Extra revisions (2 included)
    const extraRevisionsTotal = Math.max(0, revisionsPlanned - 2) * 50;

    // Add-ons
    const addOnsTotal = selectedAddOns.reduce((sum, addonId) => {
      const addon = ADD_ONS.find((a) => a.id === addonId);
      return sum + (addon ? addon.price : 0);
    }, 0);

    // Design subtotal
    const designSubtotal =
      basePrice + extraConceptsTotal + extraRevisionsTotal + addOnsTotal;

    // Apply licensing multiplier
    const licensing = LICENSING_OPTIONS.find((l) => l.id === licensingTier);
    const licensedTotal = designSubtotal * (licensing?.multiplier || 1.0);

    // Apply rush fee
    const rush = RUSH_OPTIONS.find((r) => r.id === rushLevel);
    const rushFee =
      (rush?.flat || 0) + licensedTotal * ((rush?.percentage || 0) / 100);

    // Final total
    const finalTotal = licensedTotal + rushFee;

    return {
      basePrice,
      extraConceptsTotal,
      extraRevisionsTotal,
      addOnsTotal,
      designSubtotal,
      licensedTotal,
      rushFee,
      finalTotal,
      extraConceptsCount: Math.max(0, conceptsRequested - 1),
      extraRevisionsCount: Math.max(0, revisionsPlanned - 2),
    };
  };

  const pricing = calculatePrice();

  const handleAddOnToggle = (addonId) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const projectData = {
      source: 'tag-team-website',
      client: {
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        company: clientCompany,
        instagramHandle: instagramHandle || undefined,
        contactPreference: instagramHandle ? 'instagram' : 'email',
      },
      projectTitle,
      projectType,
      description,
      designBrief,
      pricingInput: {
        baseCategory,
        basePrice: pricing.basePrice,
        conceptsIncluded: 1,
        conceptsRequested,
        extraConceptRate: 100,
        revisionsIncluded: 2,
        revisionsPlanned,
        extraRevisionRate: 50,
        addOns: selectedAddOns.map((id) => {
          const addon = ADD_ONS.find((a) => a.id === id);
          return { name: addon.name, price: addon.price };
        }),
        licensingTier,
        licensingMultiplier:
          LICENSING_OPTIONS.find((l) => l.id === licensingTier)?.multiplier ||
          1.0,
        rushLevel,
        rushFeeFlat: RUSH_OPTIONS.find((r) => r.id === rushLevel)?.flat || 0,
        rushPercentage:
          RUSH_OPTIONS.find((r) => r.id === rushLevel)?.percentage || 0,
        currency: 'CAD',
      },
    };

    try {
      const response = await fetch(
        `${process.env.GATSBY_CONTROL_HUB_URL}/api/design-projects/webhooks/design-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.GATSBY_CONTROL_HUB_API_KEY || '',
          },
          body: JSON.stringify(projectData),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to submit design order');
      }

      await response.json(); // Parse response (not used currently)
      setSuccess(true);

      // Reset form
      setTimeout(() => {
        window.location.href = '/order-confirmed';
      }, 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <OrderContainer>
        <OrderCard>
          <OrderTitle>Order Custom Design</OrderTitle>
          <Subtitle>
            Professional design services from Tag Team Printing — Get a quote
            instantly!
          </Subtitle>

          {/* Price Display - Sticky */}
          <PriceDisplay>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2563eb' }}>
              Your Quote
            </h3>
            <PriceRow>
              <span>Base Price ({baseCategory.replace(/_/g, ' ')})</span>
              <span>${pricing.basePrice.toFixed(2)}</span>
            </PriceRow>
            {pricing.extraConceptsTotal > 0 && (
              <PriceRow>
                <span>Extra Concepts ({pricing.extraConceptsCount})</span>
                <span>${pricing.extraConceptsTotal.toFixed(2)}</span>
              </PriceRow>
            )}
            {pricing.extraRevisionsTotal > 0 && (
              <PriceRow>
                <span>Extra Revisions ({pricing.extraRevisionsCount})</span>
                <span>${pricing.extraRevisionsTotal.toFixed(2)}</span>
              </PriceRow>
            )}
            {pricing.addOnsTotal > 0 && (
              <PriceRow>
                <span>Add-ons ({selectedAddOns.length})</span>
                <span>${pricing.addOnsTotal.toFixed(2)}</span>
              </PriceRow>
            )}
            {licensingTier !== 'basic' && (
              <PriceRow>
                <span>
                  Licensing (
                  {LICENSING_OPTIONS.find((l) => l.id === licensingTier)?.name})
                </span>
                <span>
                  ${(pricing.licensedTotal - pricing.designSubtotal).toFixed(2)}
                </span>
              </PriceRow>
            )}
            {pricing.rushFee > 0 && (
              <PriceRow>
                <span>
                  Rush Fee ({RUSH_OPTIONS.find((r) => r.id === rushLevel)?.name}
                  )
                </span>
                <span>${pricing.rushFee.toFixed(2)}</span>
              </PriceRow>
            )}
            <PriceRow
              isTotal
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '2px solid #2563eb',
              }}
            >
              <span>TOTAL</span>
              <span>${pricing.finalTotal.toFixed(2)} CAD</span>
            </PriceRow>
          </PriceDisplay>

          <form onSubmit={handleSubmit}>
            {/* Client Information */}
            <SectionTitle>👤 Your Information</SectionTitle>

            <FormGroup>
              <Label>Full Name *</Label>
              <Input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Email *</Label>
              <Input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Company/Organization</Label>
              <Input
                type="text"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Instagram Handle (optional)</Label>
              <Input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="@yourusername"
              />
            </FormGroup>

            {/* Project Details */}
            <SectionTitle>🎨 Project Details</SectionTitle>

            <FormGroup>
              <Label>Project Title *</Label>
              <Input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g., Logo for Coffee Shop"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Project Type *</Label>
              <Select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                required
              >
                <option value="logo">Logo</option>
                <option value="branding">Branding Package</option>
                <option value="illustration">Illustration</option>
                <option value="tshirt-design">T-Shirt Design</option>
                <option value="character-design">Character Design</option>
                <option value="packaging">Packaging Design</option>
                <option value="promotional">Promotional Material</option>
                <option value="custom">Custom Project</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Design Category *</Label>
              <Select
                value={baseCategory}
                onChange={(e) => setBaseCategory(e.target.value)}
                required
              >
                <optgroup label="Logo Design">
                  <option value="logo_simple">Simple Logo - $150</option>
                  <option value="logo_standard">Standard Logo - $300</option>
                  <option value="logo_complex">Complex Logo - $500</option>
                  <option value="logo_intricate">Intricate Logo - $800</option>
                </optgroup>
                <optgroup label="Business Materials">
                  <option value="business_card">Business Card - $100</option>
                  <option value="flyer">Flyer - $150</option>
                  <option value="brochure">Brochure - $300</option>
                  <option value="poster">Poster - $250</option>
                </optgroup>
                <optgroup label="T-Shirt Design">
                  <option value="tshirt_simple">Simple T-Shirt - $150</option>
                  <option value="tshirt_detailed">
                    Detailed T-Shirt - $350
                  </option>
                  <option value="tshirt_allover">All-Over Print - $600</option>
                </optgroup>
                <optgroup label="Illustration">
                  <option value="illustration_spot">
                    Spot Illustration - $200
                  </option>
                  <option value="illustration_halfpage">
                    Half-Page Illustration - $400
                  </option>
                  <option value="illustration_fullpage">
                    Full-Page Illustration - $700
                  </option>
                </optgroup>
                <optgroup label="Character Design">
                  <option value="character_simple">
                    Simple Character - $300
                  </option>
                  <option value="character_detailed">
                    Detailed Character - $600
                  </option>
                  <option value="character_scene">
                    Character with Scene - $1000
                  </option>
                </optgroup>
                <optgroup label="Packaging">
                  <option value="package_simple">
                    Simple Packaging - $400
                  </option>
                  <option value="package_complex">
                    Complex Packaging - $800
                  </option>
                </optgroup>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Brief Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Quick overview of your project..."
              />
            </FormGroup>

            <FormGroup>
              <Label>Detailed Design Brief</Label>
              <Textarea
                value={designBrief}
                onChange={(e) => setDesignBrief(e.target.value)}
                placeholder="Tell us about your vision, target audience, style preferences, colors, inspiration..."
                style={{ minHeight: '150px' }}
              />
            </FormGroup>

            {/* Concepts & Revisions */}
            <SectionTitle>✏️ Concepts & Revisions</SectionTitle>

            <FormGroup>
              <Label>Number of Initial Concepts (first concept included)</Label>
              <Select
                value={conceptsRequested}
                onChange={(e) => setConceptsRequested(parseInt(e.target.value))}
              >
                <option value="1">1 Concept (Included)</option>
                <option value="2">2 Concepts (+$100)</option>
                <option value="3">3 Concepts (+$200)</option>
                <option value="4">4 Concepts (+$300)</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Number of Revisions (2 included)</Label>
              <Select
                value={revisionsPlanned}
                onChange={(e) => setRevisionsPlanned(parseInt(e.target.value))}
              >
                <option value="2">2 Revisions (Included)</option>
                <option value="3">3 Revisions (+$50)</option>
                <option value="4">4 Revisions (+$100)</option>
                <option value="5">5 Revisions (+$150)</option>
                <option value="6">Unlimited (+$200)</option>
              </Select>
            </FormGroup>

            {/* Add-Ons */}
            <SectionTitle>➕ Add-Ons</SectionTitle>
            <CheckboxGroup>
              {ADD_ONS.map((addon) => (
                <CheckboxLabel key={addon.id}>
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(addon.id)}
                    onChange={() => handleAddOnToggle(addon.id)}
                  />
                  <span>
                    {addon.name} (+${addon.price})
                  </span>
                </CheckboxLabel>
              ))}
            </CheckboxGroup>

            {/* Licensing */}
            <SectionTitle>📜 Licensing</SectionTitle>
            <FormGroup>
              <Select
                value={licensingTier}
                onChange={(e) => setLicensingTier(e.target.value)}
              >
                {LICENSING_OPTIONS.map((license) => (
                  <option key={license.id} value={license.id}>
                    {license.name} - {license.desc} (×{license.multiplier})
                  </option>
                ))}
              </Select>
            </FormGroup>

            {/* Rush Options */}
            <SectionTitle>⚡ Turnaround Time</SectionTitle>
            <FormGroup>
              <Select
                value={rushLevel}
                onChange={(e) => setRushLevel(e.target.value)}
              >
                {RUSH_OPTIONS.map((rush) => (
                  <option key={rush.id} value={rush.id}>
                    {rush.name}
                    {rush.percentage > 0 && ` (+${rush.percentage}%)`}
                    {rush.flat > 0 && ` (+$${rush.flat})`}
                  </option>
                ))}
              </Select>
            </FormGroup>

            {/* Submit */}
            <SubmitButton type="submit" disabled={submitting}>
              {submitting
                ? 'Submitting...'
                : `Submit Order - $${pricing.finalTotal.toFixed(2)} CAD`}
            </SubmitButton>

            {success && (
              <SuccessMessage>
                ✅ Order submitted successfully! Redirecting to confirmation...
              </SuccessMessage>
            )}

            {error && <ErrorMessage>❌ {error}</ErrorMessage>}
          </form>
        </OrderCard>
      </OrderContainer>
    </Layout>
  );
};

export default DesignOrderPage;
