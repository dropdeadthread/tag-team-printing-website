# API Contracts - Tag Team Printing

## Table of Contents

1. [get-inventory](#function-get-inventory)
2. [get-product](#function-get-product)
3. [hello](#function-hello)
4. [list-products](#function-list-products)
5. [process-payment](#function-process-payment)
6. [ss-images](#function-ss-images)
7. [streamlined-order](#function-streamlined-order)
8. [test-pricing](#function-test-pricing)
9. [test-ss-api](#function-test-ss-api)

---

## Function: get-inventory

### Endpoint

`GET /.netlify/functions/get-inventory`

### Purpose

Fetches live inventory and pricing data for a specific garment style from S&S ActiveWear API, applies retail markup pricing tiers, and returns formatted product data with in-memory caching.

### Input Contract

#### Query Parameters

| Parameter  | Type          | Required | Description                               | Example |
| ---------- | ------------- | -------- | ----------------------------------------- | ------- |
| styleCode  | string/number | Yes\*    | S&S style ID (alias for styleID)          | "64000" |
| styleID    | string/number | Yes\*    | S&S style ID                              | "64000" |
| color      | string        | No       | Filter results to single color            | "Black" |
| clearCache | string        | No       | Clear cached data for this style ("true") | "true"  |

\*Either `styleCode` OR `styleID` is required (interchangeable)

#### Environment Variables Required

- `SNS_API_USERNAME` - S&S ActiveWear API username
- `SNS_API_KEY` - S&S ActiveWear API key/password

### Output Contract

#### Success Response (200)

```json
{
  "styleID": 64000,
  "styleName": "64000",
  "brandName": "Gildan",
  "colors": [
    {
      "name": "Black",
      "hex": "#000000",
      "swatchImg": "https://www.ssactivewear.com/images/swatch/64000_fm.jpg",
      "colorFrontImage": "https://www.ssactivewear.com/images/front/64000_fm.jpg",
      "colorSideImage": "https://www.ssactivewear.com/images/side/64000_fm.jpg",
      "colorBackImage": "https://www.ssactivewear.com/images/back/64000_fm.jpg",
      "sizes": {
        "S": { "available": 1234, "price": 12.5 },
        "M": { "available": 5678, "price": 12.5 },
        "L": { "available": 3456, "price": 12.5 },
        "XL": { "available": 2345, "price": 12.5 },
        "2XL": { "available": 1234, "price": 16.5 },
        "3XL": { "available": 567, "price": 18.0 }
      }
    }
  ],
  "lastUpdated": "2025-10-22T14:23:45.678Z"
}
```

**Response Field Types:**

- `styleID`: number (parsed from query param)
- `styleName`: string
- `brandName`: string
- `colors`: array of objects
  - `name`: string
  - `hex`: string (6-char hex color or fallback "#CCCCCC")
  - `swatchImg`: string | null (full URL or null)
  - `colorFrontImage`: string | null
  - `colorSideImage`: string | null
  - `colorBackImage`: string | null
  - `sizes`: object with size keys
    - `available`: number (total qty across all warehouses)
    - `price`: number (retail price with markup applied)
- `lastUpdated`: string (ISO 8601 timestamp)

#### Error Responses

| Status | Condition                      | Response Body                                     |
| ------ | ------------------------------ | ------------------------------------------------- |
| 400    | Missing styleID/styleCode      | `{"error": "styleCode or styleID is required"}`   |
| 404    | Style not found in S&S API     | `{"error": "Style not found"}`                    |
| 500    | S&S credentials not configured | `{"error": "S&S API credentials not configured"}` |
| 502    | S&S API request failed         | `{"error": "S&S API request failed"}`             |
| 500    | Generic error                  | `{"error": "[error message]"}`                    |

**All error responses include:**

```json
{
  "error": "string"
}
```

#### Response Headers

```
Content-Type: application/json
Access-Control-Allow-Origin: *
```

### Dependencies

#### External APIs

- `GET https://api-ca.ssactivewear.com/v2/products/?styleid={styleID}`
  - Headers: Basic Auth, Accept: application/json, User-Agent: TagTeamPrinting/1.0
  - Returns: Array of product SKU objects
- `GET https://api-ca.ssactivewear.com/v2/inventory/?styleid={styleID}`
  - Headers: Basic Auth, Accept: application/json, User-Agent: TagTeamPrinting/1.0
  - Returns: Array of inventory objects with warehouse quantities

#### Cache

- In-memory Map with 15-minute TTL
- Keyed by styleID
- Cleared on cold start or explicit `clearCache=true`

### Business Logic

1. **Parameter Processing**

   - Accept either `styleCode` or `styleID` (interchangeable)
   - Support optional `color` filter
   - Support cache clearing with `clearCache=true`

2. **Cache Check**

   - Check in-memory cache first
   - Return cached data if present and not expired (< 15 min old)
   - Skip cache if `clearCache=true`

3. **API Fetch** (Parallel)

   - Fetch products and inventory simultaneously using Promise.all
   - Use Basic Auth with SNS_API_USERNAME:SNS_API_KEY
   - Target S&S Canadian API (api-ca.ssactivewear.com)

4. **Inventory Mapping**

   - Sum quantities across all warehouses for each SKU
   - Create inventoryMap: `{ sku: totalQty }`

5. **Color Structure Building**

   - Group products by colorName
   - For each color, aggregate sizes with:
     - Wholesale price + size adjustment (2XL: +$2, 3XL/4XL/5XL: +$3)
     - Retail markup calculation (tiered multiplier)
     - Inventory quantity lookup
   - Attach images (swatch, front, side, back) to each color

6. **Price Calculation** (Tiered Markup)

   - Wholesale < $4.25: 2.5x multiplier
   - Wholesale $4.25-$6.99: 2.0x multiplier
   - Wholesale >= $7.00: 1.6x multiplier
   - 2XL sizes: +$2 wholesale adjustment
   - 3XL/4XL/5XL: +$3 wholesale adjustment

7. **Size Sorting**

   - Custom order: XS, S, M, L, XL, 2XL, 3XL, 4XL, 5XL
   - Unknown sizes sorted to end (order value 99)

8. **Response Assembly**
   - Construct response object with metadata
   - Add ISO timestamp
   - Cache result
   - Return formatted JSON

### Error Conditions

| Error Path          | Trigger                            | Handling                                  |
| ------------------- | ---------------------------------- | ----------------------------------------- |
| Missing credentials | No SNS_API_USERNAME or SNS_API_KEY | Return 500 with error message             |
| Invalid styleID     | styleCode/styleID not provided     | Return 400 with error message             |
| S&S API failure     | API returns !ok status             | Return 502 with error message             |
| No products found   | Empty array from S&S               | Return 404 "Style not found"              |
| Network error       | fetch() throws                     | Catch, log, return 500 with error message |
| Parse error         | JSON parsing fails                 | Catch, log, return 500 with error message |

### Code Location

`c:\Users\Stacey\Documents\tag team printing website\tag team printing website\netlify\functions\get-inventory.js`

---

## Function: get-product

### Endpoint

`GET /.netlify/functions/get-product`

### Purpose

Retrieves basic product information for a single style from cached S&S data JSON file hosted on tagteamprints.com.

### Input Contract

#### Query Parameters

| Parameter | Type          | Required | Description  | Example |
| --------- | ------------- | -------- | ------------ | ------- |
| styleID   | string/number | Yes      | S&S style ID | "64000" |

#### Environment Variables Required

None

### Output Contract

#### Success Response (200)

```json
{
  "styleID": 64000,
  "styleCode": "64000",
  "styleName": "64000",
  "title": "Softstyle T-Shirt",
  "name": "Softstyle T-Shirt",
  "description": "4.5 oz., 100% preshrunk cotton...",
  "brand": "Gildan",
  "brandName": "Gildan",
  "categories": "21,22,23",
  "styleImage": "https://www.ssactivewear.com/images/style/64000.jpg",
  "baseCategory": "T-Shirts",
  "mill": "Gildan",
  "piecesPerCase": 72,
  "colors": []
}
```

**Response Field Types:**

- `styleID`: number
- `styleCode`: string
- `styleName`: string
- `title`: string
- `name`: string (copy of title)
- `description`: string
- `brand`: string
- `brandName`: string (copy of brand)
- `categories`: string (comma-separated category IDs)
- `styleImage`: string (URL)
- `baseCategory`: string
- `mill`: string | null
- `piecesPerCase`: number | null
- `colors`: array (always empty in this implementation)

#### Error Responses

| Status | Condition         | Response Body                                                        |
| ------ | ----------------- | -------------------------------------------------------------------- |
| 400    | Missing styleID   | `{"error": "styleID parameter is required"}`                         |
| 404    | Product not found | `{"error": "Product not found", "styleID": "64000"}`                 |
| 500    | Data fetch failed | `{"error": "Failed to fetch product", "details": "[error message]"}` |

#### Response Headers

```
Content-Type: application/json
```

### Dependencies

#### External APIs

- `GET https://tagteamprints.com/data/all_styles_raw.json`
  - No authentication required
  - Returns: Array of all S&S styles (cached/static data)

### Business Logic

1. **Validate Input**

   - Ensure styleID query parameter is provided

2. **Fetch Cached Data**

   - Fetch static JSON file from tagteamprints.com
   - Contains all S&S styles (pre-fetched data snapshot)

3. **Find Product**

   - Search array for matching styleID
   - Convert both query and data styleID to strings for comparison
   - Return 404 if no match found

4. **Transform Response**

   - Map S&S data structure to consistent API format
   - Duplicate some fields for API compatibility (name/title, brand/brandName)
   - Set colors array to empty (SKU-level data not included)

5. **Return Data**
   - Return 200 with product object

### Error Conditions

| Error Path        | Trigger                      | Handling                          |
| ----------------- | ---------------------------- | --------------------------------- |
| Missing styleID   | No styleID in query params   | Return 400 with error message     |
| Data fetch fails  | Network error or invalid URL | Return 500 with error details     |
| Product not found | No matching styleID in data  | Return 404 with error and styleID |
| JSON parse error  | Invalid JSON response        | Throw error, return 500           |

### Code Location

`c:\Users\Stacey\Documents\tag team printing website\tag team printing website\netlify\functions\get-product.js`

---

## Function: hello

### Endpoint

`GET /.netlify/functions/hello`

### Purpose

Simple test/health check function that echoes back request parameters and timestamp.

### Input Contract

#### Query Parameters

All query parameters are optional and will be echoed back in the response.

#### Environment Variables Required

None

### Output Contract

#### Success Response (200)

```json
{
  "message": "Hello from Netlify Functions!",
  "timestamp": "2025-10-22T14:23:45.678Z",
  "event": {
    "param1": "value1",
    "param2": "value2"
  }
}
```

**Response Field Types:**

- `message`: string (constant)
- `timestamp`: string (ISO 8601 timestamp)
- `event`: object | null (query string parameters or null)

#### Error Responses

None - this function always returns 200

#### Response Headers

```
Content-Type: application/json
Access-Control-Allow-Origin: *
```

### Dependencies

None

### Business Logic

1. Accept any query parameters
2. Generate current timestamp
3. Echo back query parameters and timestamp
4. Always return 200 OK

### Error Conditions

None - function has no error paths

### Code Location

`c:\Users\Stacey\Documents\tag team printing website\tag team printing website\netlify\functions\hello.js`

---

## Function: list-products

### Endpoint

`GET /.netlify/functions/list-products`

### Purpose

Lists filtered and paginated products by category, fetching from either live S&S API (if credentials available) or cached JSON fallback, with brand filtering and custom category logic.

### Input Contract

#### Query Parameters

| Parameter | Type          | Required | Description                     | Example |
| --------- | ------------- | -------- | ------------------------------- | ------- |
| category  | string/number | Yes      | S&S category ID                 | "21"    |
| limit     | number        | No       | Products per page (default: 20) | "50"    |
| page      | number        | No       | Page number (default: 1)        | "2"     |

#### Environment Variables Required

- `SNS_API_USERNAME` - S&S API username (optional, falls back to cached data)
- `SNS_API_KEY` - S&S API key (optional, falls back to cached data)

### Output Contract

#### Success Response (200)

```json
{
  "products": [
    {
      "styleID": 64000,
      "styleCode": "64000",
      "styleName": "64000",
      "title": "Softstyle T-Shirt",
      "name": "Softstyle T-Shirt",
      "description": "4.5 oz., 100% preshrunk cotton...",
      "brand": "Gildan",
      "brandName": "Gildan",
      "categories": "21,22,23",
      "styleImage": "https://www.ssactivewear.com/images/style/64000.jpg",
      "baseCategory": "T-Shirts"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 87,
    "hasMore": true,
    "productsPerPage": 20
  }
}
```

**Response Field Types:**

- `products`: array of objects
  - `styleID`: number
  - `styleCode`: string
  - `styleName`: string
  - `title`: string
  - `name`: string (copy of title)
  - `description`: string
  - `brand`: string
  - `brandName`: string (copy of brand)
  - `categories`: string (comma-separated IDs)
  - `styleImage`: string (URL)
  - `baseCategory`: string
- `pagination`: object
  - `currentPage`: number
  - `totalPages`: number
  - `totalProducts`: number
  - `hasMore`: boolean
  - `productsPerPage`: number

#### Error Responses

| Status | Condition         | Response Body                                                            |
| ------ | ----------------- | ------------------------------------------------------------------------ |
| 400    | Missing category  | `{"error": "Category parameter is required"}`                            |
| 500    | Data fetch failed | `{"error": "Failed to load product data", "details": "[error message]"}` |
| 500    | Generic error     | `{"error": "Failed to fetch products", "details": "[error message]"}`    |

#### Response Headers

```
Content-Type: application/json
```

### Dependencies

#### External APIs

Primary (if credentials available):

- `GET https://api-ca.ssactivewear.com/v2/styles/`
  - Headers: Basic Auth, Accept: application/json
  - Returns: Array of all styles

Fallback (no credentials):

- `GET https://tagteamprints.com/data/all_styles_raw.json`
  - Returns: Cached array of all styles

### Business Logic

1. **Validate Input**

   - Require category parameter
   - Parse limit (default: 20) and page (default: 1)

2. **Data Source Selection**

   - Check for SNS_API_USERNAME and SNS_API_KEY
   - If present: fetch live data from S&S API
   - If missing: fallback to cached JSON data
   - Log which data source is used

3. **Brand Filtering** (SELECTED_BRANDS)

   - Gildan
   - JERZEES
   - BELLA + CANVAS
   - Next Level
   - Hanes
   - Comfort Colors
   - Threadfast Apparel
   - M&O
   - Richardson
   - YP Classics
   - Valucap
   - Exclude: American Apparel
   - Exclude: items with `noeRetailing: true`

4. **Category Filtering**

   - **Category 21 (T-Shirts - Short Sleeve)**: Special logic
     - Include if: categories includes "21" OR baseCategory includes "T-Shirts" OR title includes "t-shirt"
     - Exclude if: categories includes "64" (tanks)
     - Exclude if: baseCategory is "T-Shirts - Long Sleeve" OR title includes "long sleeve"
     - Exclude if: title includes "tank"
   - **Category 64 (Tanks)**: Special logic
     - Include if: categories includes "64" OR baseCategory includes "Tank" OR title includes "tank"
   - **Other categories**: Simple match on category ID in comma-separated categories string

5. **Sorting**

   - Primary: brandName (alphabetical)
   - Secondary: title (alphabetical)

6. **Pagination**

   - Calculate startIndex: (page - 1) \* limit
   - Calculate endIndex: startIndex + limit
   - Slice sorted array
   - Calculate totalPages: ceil(totalProducts / limit)
   - Calculate hasMore: currentPage < totalPages

7. **Transform Response**
   - Map each product to consistent API format
   - Include pagination metadata

### Error Conditions

| Error Path                   | Trigger                  | Handling                      |
| ---------------------------- | ------------------------ | ----------------------------- |
| Missing category             | No category param        | Return 400 with error message |
| S&S API fails                | Network error or 4xx/5xx | Try fallback to cached data   |
| Fallback fails               | Cached data also fails   | Return 500 with error details |
| No credentials + no fallback | Both sources fail        | Return 500 with error details |

### Code Location

`c:\Users\Stacey\Documents\tag team printing website\tag team printing website\netlify\functions\list-products.js`

---

## Function: process-payment

### Endpoint

`POST /.netlify/functions/process-payment`

### Purpose

Processes payment transactions through Square Payments API using the Square Node SDK.

### Input Contract

#### Request Method

`POST` only (returns 405 for other methods)

#### Request Body (JSON)

```json
{
  "token": "sq0atp-...",
  "amount": 2500,
  "currency": "CAD",
  "locationId": "L123456789"
}
```

| Field      | Type   | Required | Description                                | Example            |
| ---------- | ------ | -------- | ------------------------------------------ | ------------------ |
| token      | string | Yes      | Square payment token (sourceId)            | "sq0atp-abc123..." |
| amount     | number | Yes      | Amount in cents (must be > 0)              | 2500               |
| currency   | string | No       | Currency code (default: "CAD")             | "CAD"              |
| locationId | string | No       | Square location ID (falls back to env var) | "L123..."          |

#### Environment Variables Required

- `SQUARE_ACCESS_TOKEN` - Square API access token
- `NODE_ENV` - Environment ("production" or other for sandbox)
- `GATSBY_SQUARE_LOCATION_ID` - Default Square location ID (fallback)

### Output Contract

#### Success Response (200)

```json
{
  "success": true,
  "payment": {
    "id": "payment_id_123",
    "status": "COMPLETED",
    "amountMoney": {
      "amount": 2500,
      "currency": "CAD"
    },
    "sourceType": "CARD",
    "cardDetails": {
      /* ... */
    },
    "createdAt": "2025-10-22T14:23:45.678Z",
    "updatedAt": "2025-10-22T14:23:45.678Z"
  },
  "message": "Payment processed successfully"
}
```

**Response Field Types:**

- `success`: boolean (always true on 200)
- `payment`: object (full Square payment object)
  - `id`: string
  - `status`: string (e.g., "COMPLETED", "PENDING")
  - `amountMoney`: object
    - `amount`: number (cents)
    - `currency`: string
  - Additional Square payment fields...
- `message`: string

#### Error Responses

| Status  | Condition        | Response Body                                                                       |
| ------- | ---------------- | ----------------------------------------------------------------------------------- |
| 405     | Not POST method  | `{"error": "Method Not Allowed"}`                                                   |
| 400     | Missing token    | `{"success": false, "message": "Payment token is required"}`                        |
| 400     | Invalid amount   | `{"success": false, "message": "Valid amount is required"}`                         |
| 4xx/5xx | Square API error | `{"success": false, "message": "[Square error detail]", "error": "[dev only]"}`     |
| 500     | Generic error    | `{"success": false, "message": "Payment processing failed", "error": "[dev only]"}` |

**Error Response Format:**

```json
{
  "success": false,
  "message": "string",
  "error": "string (only in development)"
}
```

#### Response Headers

```
Content-Type: application/json
```

### Dependencies

#### External APIs

- Square Payments API (via Square Node SDK)
  - `client.paymentsApi.createPayment()`
  - Environment: Production or Sandbox (based on NODE_ENV)

#### NPM Packages

- `square` - Official Square Node SDK
- `crypto` - Node.js built-in (for UUID generation)

### Business Logic

1. **Method Validation**

   - Only allow POST requests
   - Return 405 for GET, PUT, DELETE, etc.

2. **Parse Request Body**

   - Handle both string and object body
   - Extract token, amount, currency, locationId

3. **Validate Required Fields**

   - token: Must be present
   - amount: Must be present and > 0

4. **Initialize Square Client**

   - Use SQUARE_ACCESS_TOKEN from environment
   - Select environment based on NODE_ENV:
     - "production" → Environment.Production
     - Other → Environment.Sandbox

5. **Create Payment**

   - Generate idempotency key using crypto.randomUUID()
   - Call Square API with:
     - sourceId: payment token
     - amountMoney: { amount (cents), currency }
     - locationId: from request or GATSBY_SQUARE_LOCATION_ID env var
   - Amount is rounded using Math.round()

6. **Log Success**

   - Console log: paymentId, amount, status

7. **Return Response**
   - Include full payment object from Square
   - Add success flag and message

### Error Conditions

| Error Path        | Trigger                   | Handling                                     |
| ----------------- | ------------------------- | -------------------------------------------- |
| Wrong HTTP method | Not POST                  | Return 405 Method Not Allowed                |
| Missing token     | No token in body          | Return 400 with message                      |
| Invalid amount    | amount <= 0 or missing    | Return 400 with message                      |
| Square API error  | Square throws error       | Return Square's status code and error detail |
| Generic error     | Unexpected error          | Return 500 with generic message              |
| Dev mode          | NODE_ENV !== "production" | Include error stack in response              |

### Code Location

`c:\Users\Stacey\Documents\tag team printing website\tag team printing website\netlify\functions\process-payment.js`

---

## Function: ss-images

### Endpoint

`GET /.netlify/functions/ss-images`

### Purpose

Proxy/CDN function for S&S ActiveWear product images, fetching images from ssactivewear.com and serving them with CORS headers and caching.

### Input Contract

#### Query Parameters

| Parameter | Type   | Required | Description                             | Example                  |
| --------- | ------ | -------- | --------------------------------------- | ------------------------ |
| path      | string | Yes\*    | Image path relative to ssactivewear.com | "images/style/64000.jpg" |

\*Can also be passed via URL path: `/.netlify/functions/ss-images/images/style/64000.jpg`

#### URL Path Patterns

The function accepts image path in three ways:

1. Query parameter: `?path=images/style/64000.jpg`
2. URL path: `/ss-images/images/style/64000.jpg`
3. Raw URL parsing: extracts from `event.rawUrl`

#### Environment Variables Required

None

### Output Contract

#### Success Response (200)

Binary image data (base64 encoded in Netlify response)

**Response Headers:**

```
Content-Type: image/jpeg (or actual image MIME type)
Cache-Control: public, max-age=86400
Access-Control-Allow-Origin: *
```

**Response Body:**

- Binary image data (base64 encoded)
- `isBase64Encoded: true`

#### Error Responses

| Status  | Condition              | Response Body                                                                                                                                       |
| ------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400     | No image path provided | `{"error": "No image path provided", "queryParams": {...}, "path": "...", "rawUrl": "..."}`                                                         |
| 404/5xx | S&S image fetch failed | `{"error": "Failed to fetch image from SSActivewear", "status": 404, "statusText": "...", "url": "...", "imagePath": "...", "errorDetails": "..."}` |
| 500     | Generic error          | `{"error": "Internal server error", "message": "...", "stack": "[dev only]", "url": "...", "imagePath": "..."}`                                     |

#### Response Headers (Error)

```
Content-Type: application/json
Access-Control-Allow-Origin: *
```

### Dependencies

#### External APIs

- `GET https://www.ssactivewear.com/{imagePath}`
  - No authentication required
  - Returns: Binary image data (JPEG, PNG, etc.)

### Business Logic

1. **Extract Image Path** (Multiple Sources)

   - Check `event.queryStringParameters.path`
   - If missing, try URL path regex: `/\/ss-images\/(.+)/`
   - If missing, try rawUrl regex: `/\/ss-images\/([^?]+)/`
   - Log all sources for debugging

2. **Validate Path**

   - Return 400 if no path found after all attempts
   - Include debug info in error response

3. **Construct S&S URL**

   - Build full URL: `https://www.ssactivewear.com/{imagePath}`
   - Log constructed URL

4. **Fetch Image**

   - Use built-in fetch (Node 18+)
   - No authentication required
   - Log response status and headers

5. **Handle S&S Errors**

   - If !response.ok, return error with S&S status
   - Include error details from S&S response text
   - Log error for debugging

6. **Process Image**

   - Get arrayBuffer from response
   - Extract Content-Type header (default: "image/jpeg")
   - Convert to base64-encoded Buffer
   - Log image size in bytes

7. **Return Image**

   - Return 200 with binary data
   - Set Content-Type from S&S response
   - Set Cache-Control: public, max-age=86400 (24 hours)
   - Set CORS header: Access-Control-Allow-Origin: \*
   - Flag isBase64Encoded: true

8. **Error Handling**
   - Catch all errors
   - Log error details
   - Return 500 with error message
   - Include stack trace in development mode

### Error Conditions

| Error Path    | Trigger                      | Handling                          |
| ------------- | ---------------------------- | --------------------------------- |
| Missing path  | No path in query/URL/rawUrl  | Return 400 with debug info        |
| S&S 404       | Image not found on S&S       | Return 404 with S&S error details |
| S&S 5xx       | S&S server error             | Return 5xx with S&S error details |
| Network error | fetch() throws               | Return 500 with error message     |
| Invalid image | ArrayBuffer conversion fails | Return 500 with error message     |

### Code Location

`c:\Users\Stacey\Documents\tag team printing website\tag team printing website\netlify\functions\ss-images.js`

---

## Function: streamlined-order

### Endpoint

`POST /.netlify/functions/streamlined-order`

### Purpose

Processes streamlined print order submissions, generates order IDs, and syncs order data to Control Hub system for job management.

### Input Contract

#### Request Method

`POST` only (returns 405 for other methods)

#### Request Body (JSON)

```json
{
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "notes": "Rush order please"
  },
  "garment": {
    "brand": "Gildan",
    "styleName": "64000",
    "title": "Softstyle T-Shirt",
    "wholesalePrice": 5.5
  },
  "color": "Black",
  "quantity": 24,
  "printColors": 2,
  "printLocations": ["front", "back"],
  "printLocation": "front",
  "selectedInkColors": ["Black", "White"],
  "quote": {
    "garmentCostPerShirt": 12.5,
    "printingTotal": 120.0,
    "setupTotal": 50.0,
    "subtotal": 350.0,
    "totalWithTax": 395.5,
    "pricePerShirt": 16.48,
    "needsUnderbase": false,
    "screenBreakdown": "2 colors x 1 location = 2 screens"
  },
  "addOns": {
    "rushOrder": "24-hour",
    "premiumUpgrade": false,
    "extraLocations": {}
  },
  "uploadedFiles": [
    {
      "name": "logo.ai",
      "id": "google-drive-id-123"
    }
  ]
}
```

| Field                  | Type   | Required | Description              |
| ---------------------- | ------ | -------- | ------------------------ |
| customer               | object | Yes      | Customer information     |
| customer.name          | string | Yes      | Customer name            |
| customer.email         | string | Yes      | Customer email           |
| customer.phone         | string | No       | Customer phone           |
| customer.notes         | string | No       | Order notes              |
| garment                | object | Yes      | Garment information      |
| garment.brand          | string | Yes      | Brand name               |
| garment.styleName      | string | Yes      | Style code               |
| garment.title          | string | Yes      | Product title            |
| garment.wholesalePrice | number | Yes      | Wholesale price per unit |
| color                  | string | Yes      | Garment color            |
| quantity               | number | Yes      | Order quantity           |
| printColors            | number | Yes      | Number of print colors   |
| printLocations         | array  | No       | Array of print locations |
| printLocation          | string | No       | Primary print location   |
| selectedInkColors      | array  | No       | Array of ink color names |
| quote                  | object | No       | Quote/pricing breakdown  |
| addOns                 | object | No       | Order add-ons            |
| uploadedFiles          | array  | No       | Artwork files            |

#### Environment Variables Required

- `CONTROL_HUB_URL` - Control Hub API base URL (default: "http://localhost:4000")
- `CONTROL_HUB_API_KEY` - API key for Control Hub authentication

### Output Contract

#### Success Response (200)

```json
{
  "success": true,
  "orderId": "SO-1729612345678-abc123def",
  "jobId": "JOB-2025-001234",
  "controlHub": "synced",
  "preflightCheck": {
    "status": "pending",
    "checks": []
  },
  "message": "Order submitted successfully! Job created in Control Hub."
}
```

**Response Field Types:**

- `success`: boolean (always true on 200)
- `orderId`: string (format: "SO-{timestamp}-{random}")
- `jobId`: string | null (from Control Hub)
- `controlHub`: string ("synced" or "failed")
- `preflightCheck`: object | null (from Control Hub)
- `message`: string

#### Success Response (200) - Control Hub Sync Failed

```json
{
  "success": true,
  "orderId": "SO-1729612345678-abc123def",
  "jobId": null,
  "controlHub": "failed",
  "preflightCheck": null,
  "message": "Order submitted successfully! Order saved locally, Control Hub sync pending."
}
```

#### Error Responses

| Status | Condition               | Response Body                                                               |
| ------ | ----------------------- | --------------------------------------------------------------------------- |
| 405    | Not POST method         | `{"message": "Method not allowed"}`                                         |
| 400    | Missing required fields | `{"message": "Missing required fields"}`                                    |
| 500    | Processing error        | `{"success": false, "message": "Internal server error. Please try again."}` |

#### Response Headers

```
Content-Type: application/json
```

### Dependencies

#### External APIs

- `POST {CONTROL_HUB_URL}/api/webhooks/order`
  - Headers: Content-Type: application/json, x-api-key: {CONTROL_HUB_API_KEY}
  - Body: Transformed order data
  - Returns: `{ jobId, preflightCheck }`

#### Internal Functions

- `sendToControlHub(orderData, orderId)` - Async helper function

### Business Logic

1. **Method Validation**

   - Only allow POST requests
   - Return 405 for non-POST

2. **Parse Request Body**

   - Parse JSON from event.body

3. **Validate Required Fields**

   - customer.name (required)
   - customer.email (required)
   - quantity (required)
   - garment (required)

4. **Generate Order ID**

   - Format: `SO-{Date.now()}-{random9char}`
   - Example: "SO-1729612345678-abc123def"
   - Random portion: base36 alphanumeric

5. **Create Local Order Record**

   - Build complete order object with:
     - id: generated orderId
     - type: "streamlined"
     - timestamp: ISO 8601 string
     - status: "submitted"
     - customer, garment, printing, quote data
     - Calculate pricePerShirt: totalWithTax / quantity

6. **Transform Data for Control Hub**

   - Map to Control Hub schema:
     - orderId, source: "tag-team-website"
     - customer: { name, email, phone, notes }
     - garment: { brand, style, title, color, wholesalePrice }
     - printing: { quantity, colors, locations, underbase, inkColors, addOns }
     - quote: { garmentCost, printingTotal, setupTotal, subtotal, totalWithTax, pricePerShirt, screenBreakdown }
     - files: [{ filename, type, driveId }]

7. **Send to Control Hub** (async)

   - POST to Control Hub webhook endpoint
   - Include x-api-key header
   - Handle success/failure gracefully
   - Log sync status

8. **Return Response**

   - Always return 200 (order submitted locally)
   - Include Control Hub sync status
   - Include jobId if Control Hub succeeded
   - Include descriptive message

9. **Error Handling**
   - Catch all errors
   - Log error details
   - Return 500 with generic message
   - Never expose internal errors to client

### Error Conditions

| Error Path             | Trigger          | Handling                                         |
| ---------------------- | ---------------- | ------------------------------------------------ |
| Wrong HTTP method      | Not POST         | Return 405                                       |
| Missing customer.name  | Validation fails | Return 400                                       |
| Missing customer.email | Validation fails | Return 400                                       |
| Missing quantity       | Validation fails | Return 400                                       |
| Missing garment        | Validation fails | Return 400                                       |
| JSON parse error       | Invalid body     | Return 500                                       |
| Control Hub API error  | Hub returns !ok  | Log error, return success (graceful degradation) |
| Control Hub timeout    | Network error    | Log error, return success (graceful degradation) |
| Generic error          | Unexpected error | Return 500 with generic message                  |

### Code Location

`c:\Users\Stacey\Documents\tag team printing website\tag team printing website\netlify\functions\streamlined-order.js`

---

## Function: test-pricing

### Endpoint

`GET /.netlify/functions/test-pricing`

### Purpose

Test function to validate pricing calculation functions work correctly when imported from shared config.

### Input Contract

#### Query Parameters

None

#### Environment Variables Required

None

### Output Contract

#### Success Response (200)

```json
{
  "success": true,
  "test": {
    "originalWholesale": 5.5,
    "adjustedWholesale": 5.5,
    "retailPrice": "11.00",
    "priceType": "string"
  },
  "message": "Pricing functions working correctly"
}
```

**Response Field Types:**

- `success`: boolean (always true on 200)
- `test`: object
  - `originalWholesale`: number (hardcoded test value: 5.5)
  - `adjustedWholesale`: number (after size adjustment)
  - `retailPrice`: string (formatted to 2 decimals)
  - `priceType`: string (typeof retailPrice)
- `message`: string

#### Error Responses

| Status | Condition              | Response Body                                                              |
| ------ | ---------------------- | -------------------------------------------------------------------------- |
| 500    | Import/execution error | `{"success": false, "error": "[error message]", "stack": "[error stack]"}` |

#### Response Headers

```
Content-Type: application/json
Access-Control-Allow-Origin: *
```

### Dependencies

#### Internal Modules

- `../../src/config/pricing.js`
  - `sortSizesByOrder(sizesObj)`
  - `getSizeAdjustedWholesalePrice(wholesalePrice, sizeName)`
  - `calculateRetailPrice(adjustedWholesale)`

### Business Logic

1. **Import Pricing Functions**

   - Require pricing.js from src/config
   - Import all three pricing functions

2. **Run Test**

   - Test values: wholesale = 5.5, size = "M"
   - Call getSizeAdjustedWholesalePrice(5.5, "M")
   - Call calculateRetailPrice(adjustedPrice)

3. **Return Results**

   - Show original wholesale
   - Show adjusted wholesale (no adjustment for M)
   - Show retail price (string, 2 decimals)
   - Show type of retail price
   - Success message

4. **Error Handling**
   - Catch any errors
   - Return 500 with error message and stack trace

### Error Conditions

| Error Path     | Trigger                 | Handling                      |
| -------------- | ----------------------- | ----------------------------- |
| Import fails   | pricing.js not found    | Return 500 with error details |
| Function error | Pricing function throws | Return 500 with error details |

### Code Location

`c:\Users\Stacey\Documents\tag team printing website\tag team printing website\netlify\functions\test-pricing.js`

---

## Function: test-ss-api

### Endpoint

`GET /.netlify/functions/test-ss-api`

### Purpose

Minimal test function to validate S&S ActiveWear API connectivity, credentials, and response structure.

### Input Contract

#### Query Parameters

| Parameter | Type          | Required | Description                            | Example |
| --------- | ------------- | -------- | -------------------------------------- | ------- |
| styleID   | string/number | No       | S&S style ID to test (default: "4502") | "64000" |

#### Environment Variables Required

- `SNS_API_USERNAME` - S&S API username
- `SNS_API_KEY` - S&S API key

### Output Contract

#### Success Response (200)

```json
{
  "success": true,
  "styleID": "4502",
  "productsFound": 42,
  "firstProduct": {
    "styleName": "4502",
    "brandName": "Gildan",
    "wholesalePrice": 5.44,
    "sizeName": "S"
  }
}
```

**Response Field Types:**

- `success`: boolean (always true on 200)
- `styleID`: string
- `productsFound`: number (length of products array)
- `firstProduct`: object | null
  - `styleName`: string
  - `brandName`: string
  - `wholesalePrice`: number
  - `sizeName`: string

#### Error Responses

| Status | Condition           | Response Body                                                                                                               |
| ------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 500    | Missing credentials | `{"error": "S&S API credentials not configured", "debug": {"hasUsername": false, "hasApiKey": false, "usernameLength": 0}}` |
| 502    | S&S API error       | `{"error": "S&S API request failed", "debug": {"status": 401, "statusText": "Unauthorized", "url": "..."}}`                 |
| 500    | Generic error       | `{"error": "[error message]", "stack": "[error stack]"}`                                                                    |

#### Response Headers

```
Content-Type: application/json
Access-Control-Allow-Origin: *
```

### Dependencies

#### External APIs

- `GET https://api-ca.ssactivewear.com/v2/products/?styleid={styleID}`
  - Headers: Basic Auth, Accept: application/json, User-Agent: TagTeamPrinting/1.0
  - Returns: Array of product SKU objects

### Business Logic

1. **Extract Parameters**

   - Get styleID from query params (default: "4502")

2. **Validate Credentials**

   - Check SNS_API_USERNAME exists
   - Check SNS_API_KEY exists
   - Return 500 with debug info if missing

3. **Build Auth Header**

   - Create Basic Auth: `Basic ${base64(username:apiKey)}`

4. **Fetch from S&S API**

   - Call products endpoint with styleID
   - Include Accept, Authorization, User-Agent headers

5. **Check Response**

   - If !ok, return 502 with status details
   - If ok, parse JSON

6. **Return Success**

   - Count products in array
   - Extract first product details
   - Return success with data

7. **Error Handling**
   - Catch all errors
   - Return 500 with error message and stack

### Error Conditions

| Error Path          | Trigger             | Handling                          |
| ------------------- | ------------------- | --------------------------------- |
| Missing username    | No SNS_API_USERNAME | Return 500 with debug info        |
| Missing API key     | No SNS_API_KEY      | Return 500 with debug info        |
| Invalid credentials | S&S returns 401     | Return 502 with S&S error details |
| Invalid styleID     | S&S returns 404     | Return 502 with S&S error details |
| Network error       | fetch() throws      | Return 500 with error message     |
| JSON parse error    | Invalid response    | Return 500 with error message     |

### Code Location

`c:\Users\Stacey\Documents\tag team printing website\tag team printing website\netlify\functions\test-ss-api.js`

---

## Summary Statistics

| Metric                           | Count |
| -------------------------------- | ----- |
| Total Functions                  | 9     |
| GET Endpoints                    | 7     |
| POST Endpoints                   | 2     |
| Functions with External APIs     | 6     |
| Functions with Caching           | 1     |
| Functions with Auth Requirements | 4     |
| Test/Debug Functions             | 3     |
| Production Functions             | 6     |

## External API Dependencies

| API                                                  | Used By Functions                         |
| ---------------------------------------------------- | ----------------------------------------- |
| S&S ActiveWear (api-ca.ssactivewear.com)             | get-inventory, list-products, test-ss-api |
| SSActivewear Images (www.ssactivewear.com)           | ss-images                                 |
| Tag Team Prints Static Data (tagteamprints.com/data) | get-product, list-products (fallback)     |
| Square Payments API                                  | process-payment                           |
| Control Hub API (custom)                             | streamlined-order                         |

## Environment Variables Reference

| Variable                  | Required By                               | Purpose                                   |
| ------------------------- | ----------------------------------------- | ----------------------------------------- |
| SNS_API_USERNAME          | get-inventory, list-products, test-ss-api | S&S API authentication username           |
| SNS_API_KEY               | get-inventory, list-products, test-ss-api | S&S API authentication key                |
| SQUARE_ACCESS_TOKEN       | process-payment                           | Square API access token                   |
| GATSBY_SQUARE_LOCATION_ID | process-payment                           | Default Square location ID                |
| NODE_ENV                  | process-payment                           | Environment selector (production/sandbox) |
| CONTROL_HUB_URL           | streamlined-order                         | Control Hub base URL                      |
| CONTROL_HUB_API_KEY       | streamlined-order                         | Control Hub authentication key            |
