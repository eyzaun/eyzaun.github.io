const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Ensure type="module" is present for ES modules
if (!html.includes('type="module"')) {
    html = html.replace(/<script crossorigin/g, '<script type="module" crossorigin');
}

fs.writeFileSync(htmlPath, html);
console.log('Ensured type="module" is present in HTML');
