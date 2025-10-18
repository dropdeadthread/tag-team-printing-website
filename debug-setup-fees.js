const calculatePrintQuote = require('./src/helpers/calculatePrintQuote');

// Test the exact scenario from the screenshot:
// 50 red tees, white underbase + yellow ink
const testScenario = {
  quantity: 50,
  selectedGarment: {
    color: 'red',
    basePrice: 6.25, // from screenshot showing $6.25 per shirt
  },
  colors: ['white', 'yellow'], // white underbase + yellow ink
  hasUnderbase: true,
};

console.log('=== DEBUGGING SETUP FEE CALCULATION ===');
console.log('Test scenario:', testScenario);

try {
  const quote = calculatePrintQuote(
    testScenario.quantity,
    testScenario.selectedGarment,
    testScenario.colors,
    testScenario.hasUnderbase,
  );

  console.log('\n=== QUOTE RESULTS ===');
  console.log('Setup Total:', quote.setupTotal);
  console.log('Setup Fees (after waiver):', quote.setupTotal - 30);
  console.log('Printing Cost:', quote.printingCost);
  console.log('Garment Cost:', quote.garmentCost);
  console.log('Subtotal:', quote.subtotal);
  console.log('Full Quote Object:', JSON.stringify(quote, null, 2));
} catch (error) {
  console.error('Error calculating quote:', error);
}
