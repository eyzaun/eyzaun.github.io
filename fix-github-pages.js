const fs = require('fs');
const path = require('path');

// Read the built HTML file
const htmlPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Remove type="module" attribute to avoid MIME type issues on GitHub Pages
html = html.replace(/type="module"\s+/g, '');

// Write back the modified HTML
fs.writeFileSync(htmlPath, html);

console.log('✅ Removed type="module" from built HTML file for GitHub Pages compatibility');
