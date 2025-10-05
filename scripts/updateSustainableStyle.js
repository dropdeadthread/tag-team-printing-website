const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/all_styles_raw.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const sustainableKeywords = [
  'sustainable',
  'recycled',
  'organic',
  'bci cotton',
  'gots',
  'grs',
  'oeko-tex',
  'socially conscious',
  'sustainable materials',
  'sustainable manufacturing'
];

const updated = data.map(item => {
  if (!item.description) return item;
  const desc = item.description.toLowerCase();
  const isSustainable = sustainableKeywords.some(keyword => desc.includes(keyword));
  return { ...item, sustainableStyle: isSustainable };
});

const filtered = updated.filter(item => item.styleID && item.title && item.brandName);
fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));
console.log('Updated sustainableStyle flags!');