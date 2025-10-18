const fetch = require('node-fetch');

const username = '419372';
const password = '5d49715b-56f6-433b-9b45-380862878174';
const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');
const BASE_URL = 'https://api-ca.ssactivewear.com/v2/styles/';

console.log('Testing S&S API with credentials:');
console.log('Username:', username);
console.log('Password:', password.substring(0, 8) + '...');
console.log('Basic Auth:', basicAuth.substring(0, 20) + '...');
console.log('URL:', BASE_URL);

fetch(BASE_URL, {
  headers: {
    Accept: 'application/json',
    Authorization: 'Basic ' + basicAuth,
  },
})
  .then((response) => {
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers));
    return response.json();
  })
  .then((data) => {
    console.log(
      'Response Data:',
      typeof data === 'object'
        ? JSON.stringify(data).substring(0, 200) + '...'
        : data,
    );
  })
  .catch((err) => {
    console.error('Fetch Error:', err.message);
  });
