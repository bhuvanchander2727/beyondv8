const fs = require('fs');
const path = require('path');
const https = require('https');

const assetsDir = path.join(__dirname, '..', 'public', 'assets');
const fontsDir = path.join(assetsDir, 'fonts');

fs.mkdirSync(fontsDir, { recursive: true });

// Function to download file
function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

async function fetchFontCss(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function setup() {
  console.log('Fetching Outfit font woff2...');
  try {
    const css = await fetchFontCss('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600;700&display=swap');
    // Extract font urls
    const matches = [...css.matchAll(/src:\s*url\((https:[^)]+\.woff2)\)/g)];
    console.log(`Found ${matches.length} font files`);
    
    // We will download woff2 files and create local fonts.css
    let localCss = css;
    for (let i = 0; i < matches.length; i++) {
      const url = matches[i][1];
      const filename = `outfit-${i}.woff2`;
      const dest = path.join(fontsDir, filename);
      console.log(`Downloading ${filename}...`);
      await download(url, dest);
      localCss = localCss.replace(url, `/assets/fonts/${filename}`);
    }
    fs.writeFileSync(path.join(fontsDir, 'outfit.css'), localCss);
    console.log('Fonts downloaded successfully');
  } catch (err) {
    console.error('Font fetch error:', err.message);
  }
}

setup();
