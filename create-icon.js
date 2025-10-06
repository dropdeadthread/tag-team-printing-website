// Quick script to create a simple PNG icon for the manifest
const fs = require('fs');
const path = require('path');

// Create a simple SVG that we can convert
const svgContent = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#c32b14"/>
  <text x="256" y="280" font-family="Arial, sans-serif" font-size="120" font-weight="bold" text-anchor="middle" fill="white">TTP</text>
</svg>
`;

// Save as SVG first
fs.writeFileSync('static/images/manifest-icon.svg', svgContent);

console.log('Created simple manifest icon as SVG');
console.log('You can convert this to PNG using an online converter or image editor');