const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\venkata kiran\\.gemini\\antigravity-ide\\brain\\aa9332f3-e968-453b-b801-f0132ed06314\\.system_generated\\logs\\transcript_full.jsonl';
console.log('Reading log...');
const data = fs.readFileSync(logPath, 'utf8');
const needle = '<!DOCTYPE html>';
const idx = data.indexOf(needle);
console.log('Index:', idx);
if (idx !== -1) {
  // Find the closing </html>
  const endIdx = data.indexOf('</html>', idx);
  if (endIdx !== -1) {
    const raw = data.substring(idx, endIdx + 7);
    // Unescape if needed
    const unescaped = raw.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    fs.writeFileSync('beyond.html', unescaped, 'utf8');
    console.log('Wrote beyond.html with length:', unescaped.length);

    // Extract images
    const assetsDir = path.join(__dirname, '..', 'public', 'assets');
    fs.mkdirSync(assetsDir, { recursive: true });

    // 1. herobg
    const heroBgMatch = unescaped.match(/\.herobg\{position:absolute;inset:0;background:#0b0c0c url\((data:image\/webp;base64,[^)]+)\)/);
    if (heroBgMatch) {
      const b64 = heroBgMatch[1].replace('data:image/webp;base64,', '');
      fs.writeFileSync(path.join(assetsDir, 'hero-alley.webp'), Buffer.from(b64, 'base64'));
      console.log('Extracted hero-alley.webp, size:', fs.statSync(path.join(assetsDir, 'hero-alley.webp')).size);
    } else {
      console.log('heroBgMatch not found');
    }

    // 2. model img
    const modelMatch = unescaped.match(/class="model"[^>]*>.*?<img src="data:image\/webp;base64,([^"]+)"/s);
    if (modelMatch) {
      fs.writeFileSync(path.join(assetsDir, 'hero-model.webp'), Buffer.from(modelMatch[1], 'base64'));
      console.log('Extracted hero-model.webp, size:', fs.statSync(path.join(assetsDir, 'hero-model.webp')).size);
    } else {
      console.log('modelMatch not found');
    }

    // 3. biker
    const bikerMatch = unescaped.match(/biker:'data:image\/webp;base64,([^']+)'/);
    if (bikerMatch) {
      fs.writeFileSync(path.join(assetsDir, 'biker-jacket.webp'), Buffer.from(bikerMatch[1], 'base64'));
      console.log('Extracted biker-jacket.webp, size:', fs.statSync(path.join(assetsDir, 'biker-jacket.webp')).size);
    } else {
      console.log('bikerMatch not found');
    }

    // 4. bomber
    const bomberMatch = unescaped.match(/bomber:'data:image\/webp;base64,([^']+)'/);
    if (bomberMatch) {
      fs.writeFileSync(path.join(assetsDir, 'bomber-jacket.webp'), Buffer.from(bomberMatch[1], 'base64'));
      console.log('Extracted bomber-jacket.webp, size:', fs.statSync(path.join(assetsDir, 'bomber-jacket.webp')).size);
    } else {
      console.log('bomberMatch not found');
    }
  }
}
