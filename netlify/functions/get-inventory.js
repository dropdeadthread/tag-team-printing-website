// Emergency fallback get-inventory function  
exports.handler = async (event) => {
  const { styleID } = event.queryStringParameters || {};
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      styleID: parseInt(styleID) || 0,
      styleName: `Style ${styleID}`,
      sizes: {
        S: { price: 14.61, available: 10 },
        M: { price: 14.61, available: 10 },
        L: { price: 14.61, available: 10 },
        XL: { price: 14.61, available: 10 },
      },
      colors: [],
      source: 'fallback',
    }),
  };
};
