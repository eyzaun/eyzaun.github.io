const fs = require('fs');
const path = require('path');

// Read the built HTML file
const htmlPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Remove type="module" attribute to avoid MIME type issues on GitHub Pages
html = html.replace(/type="module"\s+/g, '');

// Move script to end of body and add defer for better loading
html = html.replace(/<script([^>]*crossorigin[^>]*)><\/script>/g, function(match, attributes) {
  return '';
});

// Add script to end of body with defer
html = html.replace(/<\/body>/, function(match) {
  const scriptMatch = html.match(/<script[^>]*src="([^"]*)"[^>]*>/);
  if (scriptMatch) {
    return `    <script defer crossorigin src="${scriptMatch[1]}"></script>\n  </body>`;
  }
  return match;
});

// Write back the modified HTML
fs.writeFileSync(htmlPath, html);

console.log('✅ Fixed GitHub Pages compatibility: removed type="module" and moved script to body');
