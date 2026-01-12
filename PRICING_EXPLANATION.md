# Pricing Display Explanation

## Two Different Pricing Systems

The website displays prices in two different contexts:

### 1. Product Catalog Pages (`/products/*`)

**What's shown:** Wholesale garment cost only
**Example:** "from $8.50"
**What it includes:**

- Just the blank garment price from S&S ActiveWear
- NO printing costs
- NO setup fees
- NO tax

**Purpose:** Allows customers to compare garment options and see base costs before customization.

### 2. Quick Order Page (`/order`)

**What's shown:** Complete print job quote
**Example:** $500.00 for 24 shirts
**What it includes:**

- Garment costs (24 × $8.50 = $204)
- Setup fees ($30 per screen × number of locations)
- Per-shirt print costs ($1-2 per color depending on garment type)
- 13% tax

**Purpose:** Provides complete pricing for a finished print job.

## Why the Difference?

The product pages show **starting prices** for the blank garments only. This helps customers:

1. Compare garment options side-by-side
2. Understand base costs before adding printing
3. Make decisions about garment quality vs. budget

The quick order form shows **complete quotes** because:

1. Printing costs vary by design complexity (color count, locations)
2. Setup fees depend on the specific job requirements
3. Customers need an accurate total before ordering

## Pricing Breakdown Example

**Scenario:** 24 Gildan t-shirts with 2-color front print

### Product Page Display:

- **Garment:** $8.50 each

### Quick Order Quote:

- **Garments:** 24 × $8.50 = $204.00
- **Setup fees:** 2 screens × $30 = $60.00
- **Print costs:** 24 shirts × $2.50/shirt = $60.00
- **Subtotal:** $324.00
- **Tax (13%):** $42.12
- **Total:** $366.12

## How Setup Fees Work

Setup fees are charged per screen per location:

- **Screens needed:** Determined by ink colors + underbase (if needed)
  - 1 color on light garment = 1 screen
  - 1 color on dark garment = 1-2 screens (depending on ink color)
  - Multi-color prints = 1 screen per color (+ underbase if needed)
- **Locations:** Front, back, sleeves, etc. (each location has its own setup)
- **Cost:** $30 per screen per location

**Example:**

- 3-color front print + 1-color back print on dark garment
- Front: 3 colors + 1 underbase = 4 screens × $30 = $120
- Back: 1 color + 1 underbase = 2 screens × $30 = $60
- Total setup: $180

## Per-Shirt Print Costs

- **First color (light garment):** $1.00
- **First color (dark garment):** $2.00 (includes underbase)
- **Additional colors:** $1.50-$1.75 each
- **Premium inks:** $1.75 per color

## Minimum Orders

Minimums increase with color count:

- 1 color: 15 pieces minimum
- 2 colors: 20 pieces minimum
- 3 colors: 30 pieces minimum
- 4 colors: 40 pieces minimum
- 5+ colors: 50+ pieces minimum

## Rush Order Pricing

Rush orders add percentage premiums to subtotal:

- 5-day rush: +20%
- 4-day rush: +30%
- 3-day rush: +50%
- 2-day rush: +100%

---

**Last Updated:** January 12, 2026
**See also:** `/src/helpers/calculatePrintQuote.js` for complete pricing logic
