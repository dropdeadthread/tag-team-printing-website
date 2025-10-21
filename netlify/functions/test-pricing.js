// Simple test function to check if pricing imports work
import {
  sortSizesByOrder,
  getSizeAdjustedWholesalePrice,
  calculateRetailPrice,
} from '../../src/config/pricing.js';

export const handler = async (event) => {
  try {
    // Test the pricing functions
    const testWholesale = 5.5;
    const testSize = 'M';

    const adjustedPrice = getSizeAdjustedWholesalePrice(
      testWholesale,
      testSize,
    );
    const retailPrice = calculateRetailPrice(adjustedPrice);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        test: {
          originalWholesale: testWholesale,
          adjustedWholesale: adjustedPrice,
          retailPrice: retailPrice,
          priceType: typeof retailPrice,
        },
        message: 'Pricing functions working correctly',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
      }),
    };
  }
};
