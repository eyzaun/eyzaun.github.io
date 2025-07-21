const fs = require('fs');
const path = require('path');

// Read the built HTML file
const htmlPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Remove type="module" attribute and all existing script tags
html = html.replace(/type="module"\s+/g, '');
html = html.replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g, '');

// Look for the JavaScript file (should be app.js)
const distPath = path.join(__dirname, 'dist');
const files = fs.readdirSync(distPath);
const jsFile = files.find(file => file.endsWith('.js') && file.startsWith('app'));

if (jsFile) {
  // Add single script tag at end of body with relative path
  html = html.replace(/<\/body>/, `    <script defer crossorigin src="./${jsFile}"></script>\n  </body>`);
  console.log(`✅ Added script tag for ${jsFile}`);
} else {
  console.log('❌ No .js JavaScript file found');
  console.log('Available files:', files);
}

// Add .nojekyll file to prevent Jekyll processing
const nojekyllPath = path.join(__dirname, 'dist', '.nojekyll');
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, '');
  console.log('✅ Added .nojekyll file');
}

// Write back the modified HTML
fs.writeFileSync(htmlPath, html);

console.log('✅ Fixed GitHub Pages compatibility with UMD format and relative paths');