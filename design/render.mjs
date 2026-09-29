// Renders the design sources into public/. Run via the command in design/README.md.
// Runs from a temp dir next to puppeteer-core, so paths are relative to the working directory (repo root).
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const root = process.cwd();
const jobs = [
  { src: 'design/og-image.html', out: 'public/og-image.png', width: 1200, height: 630 },
  {
    src: 'design/apple-touch-icon.svg',
    out: 'public/apple-touch-icon.png',
    width: 180,
    height: 180,
  },
  { src: 'design/favicon.svg', out: 'public/favicon.ico', width: 32, height: 32, ico: true },
];

// A Vista+ ICO may embed PNG data directly: 6-byte header + one 16-byte entry + the PNG.
function pngToIco(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  header.writeUInt8(size % 256, 6);
  header.writeUInt8(size % 256, 7);
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18); // image data offset
  return Buffer.concat([header, png]);
}

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium-browser', // zenika/alpine-chrome; its CHROME_PATH env is a directory
  args: ['--no-sandbox', '--disable-gpu'],
});
const page = await browser.newPage();
for (const job of jobs) {
  await page.setViewport({ width: job.width, height: job.height, deviceScaleFactor: 1 });
  const file = path.join(root, job.src);
  if (job.src.endsWith('.svg')) {
    // Wrap the SVG so it fills the viewport exactly.
    const svg = fs.readFileSync(file, 'utf8');
    await page.setContent(
      `<style>*{margin:0}svg{display:block;width:100vw;height:100vh}</style>${svg}`,
    );
  } else {
    await page.goto(`file://${file}`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
  }
  const png = Buffer.from(await page.screenshot({ omitBackground: true }));
  fs.writeFileSync(path.join(root, job.out), job.ico ? pngToIco(png, job.width) : png);
  console.log(`${job.out} (${job.width}×${job.height})`);
}
await browser.close();
