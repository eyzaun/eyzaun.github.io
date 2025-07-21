const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Remove type="module" from script tags
html = html.replace(/type="module"\s+/g, '');

fs.writeFileSync(htmlPath, html);
console.log('Removed type="module" from index.html');
