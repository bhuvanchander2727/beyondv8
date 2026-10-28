const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'assets');
fs.mkdirSync(outDir, { recursive: true });

// Read the base64 from a helper file or write directly
console.log('Preparing image writer');
