const fs = require('fs');
const https = require('https');

async function getBase64Font(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
    }).on('error', reject);
  });
}

async function main() {
  // We use direct TTF links for simplicity (woff2 works too if encoded right)
  // These are Google Fonts URLs for TTF
  // Lora: https://fonts.gstatic.com/s/lora/v35/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkqg.ttf
  // Caveat: https://fonts.gstatic.com/s/caveat/v18/Wnz6HAc5bAfYB2Q7Yj82ciQzpxo.ttf
  
  const caveatBase64 = await getBase64Font('https://fonts.gstatic.com/s/caveat/v18/Wnz6HAc5bAfYB2Q7Yj82ciQzpxo.ttf');
  const loraBase64 = await getBase64Font('https://fonts.gstatic.com/s/lora/v35/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkqg.ttf');

  const svgContent = `<svg width="800" height="250" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'Caveat';
        src: url(data:font/ttf;base64,${caveatBase64}) format('truetype');
      }
      @font-face {
        font-family: 'Lora';
        src: url(data:font/ttf;base64,${loraBase64}) format('truetype');
      }
      .title { font-family: 'Caveat', cursive; font-size: 64px; fill: #fbf9f4; }
      .subtitle { font-family: 'Lora', serif; font-size: 24px; fill: #FFCBDD; }
    </style>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3E000C" />
      <stop offset="33%" stop-color="#7C0B2B" />
      <stop offset="66%" stop-color="#D10000" />
      <stop offset="100%" stop-color="#FB4B4E" />
    </linearGradient>
  </defs>
  
  <!-- Background with waving effect on bottom -->
  <path d="M0,0 L800,0 L800,200 Q700,250 500,220 T200,200 Q100,190 0,220 Z" fill="url(#grad1)" />
  
  <text x="400" y="110" dominant-baseline="middle" text-anchor="middle" class="title">Hola, soy Cecilia! 👋</text>
  <text x="400" y="170" dominant-baseline="middle" text-anchor="middle" class="subtitle">Full Stack Web Developer | UX/UI | IA Enthusiast</text>
</svg>`;

  fs.writeFileSync('header.svg', svgContent);
  console.log('header.svg created.');
}

main();
