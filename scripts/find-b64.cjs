const fs = require('fs');
const path = require('path');

const target = 'UklGRsZbAABXRUJQVlA4';

function searchInDir(dir, maxDepth = 4) {
  if (maxDepth < 0) return;
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      const full = path.join(dir, item);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          searchInDir(full, maxDepth - 1);
        } else if (stat.isFile() && (item.endsWith('.jsonl') || item.endsWith('.txt') || item.endsWith('.html') || item.endsWith('.json'))) {
          const str = fs.readFileSync(full, 'utf8');
          if (str.includes(target)) {
            console.log('MATCH FOUND IN:', full, 'size:', str.length);
            const idx = str.indexOf('<!DOCTYPE html>');
            const end = str.indexOf('</html>', idx);
            if (idx !== -1 && end !== -1) {
              const html = str.substring(idx, end + 7)
                .replace(/\\\\/g, '\\')
                .replace(/\\"/g, '"')
                .replace(/\\n/g, '\n');
              fs.writeFileSync('beyond.html', html, 'utf8');
              console.log('Restored full beyond.html, length:', html.length);
              
              // Now extract the images to public/assets
              const assetsDir = path.join(__dirname, '..', 'public', 'assets');
              fs.mkdirSync(assetsDir, { recursive: true });

              // 1. herobg
              const heroBgMatch = html.match(/\.herobg\{position:absolute;inset:0;background:#0b0c0c url\((data:image\/webp;base64,[^)]+)\)/);
              if (heroBgMatch) {
                const b64 = heroBgMatch[1].replace('data:image/webp;base64,', '');
                fs.writeFileSync(path.join(assetsDir, 'hero-alley.webp'), Buffer.from(b64, 'base64'));
                console.log('Extracted hero-alley.webp, size:', fs.statSync(path.join(assetsDir, 'hero-alley.webp')).size);
              }

              // 2. model img
              const modelMatch = html.match(/class="model"[^>]*>[\s\S]*?<img src="data:image\/webp;base64,([^"]+)"/);
              if (modelMatch) {
                fs.writeFileSync(path.join(assetsDir, 'hero-model.webp'), Buffer.from(modelMatch[1], 'base64'));
                console.log('Extracted hero-model.webp, size:', fs.statSync(path.join(assetsDir, 'hero-model.webp')).size);
              }

              // 3. biker
              const bikerMatch = html.match(/biker:'data:image\/webp;base64,([^']+)'/);
              if (bikerMatch) {
                fs.writeFileSync(path.join(assetsDir, 'biker-jacket.webp'), Buffer.from(bikerMatch[1], 'base64'));
                console.log('Extracted biker-jacket.webp, size:', fs.statSync(path.join(assetsDir, 'biker-jacket.webp')).size);
              }

              // 4. bomber
              const bomberMatch = html.match(/bomber:'data:image\/webp;base64,([^']+)'/);
              if (bomberMatch) {
                fs.writeFileSync(path.join(assetsDir, 'bomber-jacket.webp'), Buffer.from(bomberMatch[1], 'base64'));
                console.log('Extracted bomber-jacket.webp, size:', fs.statSync(path.join(assetsDir, 'bomber-jacket.webp')).size);
              }

              process.exit(0);
            }
          }
        }
      } catch (e) {}
    }
  } catch (e) {}
}

searchInDir('C:\\Users\\venkata kiran\\.gemini');
