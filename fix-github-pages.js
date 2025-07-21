const fs = require('fs');
const path = require('path');

// Read the built HTML file
const htmlPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Remove type="module" attribute to avoid MIME type issues on GitHub Pages
html = html.replace(/type="module"\s+/g, '');

// Look for the JavaScript file (should be app.txt)
const distPath = path.join(__dirname, 'dist');
const files = fs.readdirSync(distPath);
const jsFile = files.find(file => file.endsWith('.txt') && file.startsWith('app'));

if (jsFile) {
  // Add script to end of body with .txt extension
  html = html.replace(/<\/body>/, `    <script defer crossorigin src="/${jsFile}"></script>\n  </body>`);
  console.log(`✅ Added script tag for ${jsFile}`);
} else {
  console.log('❌ No .txt JavaScript file found');
}

// Write back the modified HTML
fs.writeFileSync(htmlPath, html);

console.log('✅ Fixed GitHub Pages compatibility with .txt extension');
