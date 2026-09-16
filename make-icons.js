const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table & function
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function createPng(size) {
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData.writeUInt8(8, 8); // 8 bits per channel
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image data: scanline filter byte (0) + 4 bytes RGBA per pixel
  const rowSize = 1 + size * 4;
  const raw = Buffer.alloc(size * rowSize);
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.44;

  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0; // Filter None
    for (let x = 0; x < size; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Sphere with orbital ring
      // Orbit ellipse: (dx/110)^2 + (dy/45)^2 ≈ 1
      const orbitDist = Math.abs(Math.sqrt((dx * dx) / (105 * 105) + (dy * dy) / (38 * 38)) - 1);

      if (orbitDist < 0.08 && Math.abs(dy - 0.2 * dx) < 40) {
        // Orbit ring: cyan #38bdf8
        raw[pxOffset + 0] = 56;
        raw[pxOffset + 1] = 189;
        raw[pxOffset + 2] = 248;
        raw[pxOffset + 3] = 255;
      } else if (dist <= radius) {
        // Sphere body: gradient from deep indigo #1e293b to violet #6366f1
        const t = (x + y) / (size * 2);
        raw[pxOffset + 0] = Math.round(30 + t * (99 - 30));
        raw[pxOffset + 1] = Math.round(41 + t * (102 - 41));
        raw[pxOffset + 2] = Math.round(59 + t * (241 - 59));
        
        // Anti-aliasing edge
        if (radius - dist < 1.5) {
          raw[pxOffset + 3] = Math.round(255 * (radius - dist) / 1.5);
        } else {
          raw[pxOffset + 3] = 255;
        }

        // Inner glowing core
        const innerDist = Math.sqrt((x - (cx - 15)) ** 2 + (y - (cy - 15)) ** 2);
        if (innerDist < size * 0.22) {
          const it = 1 - (innerDist / (size * 0.22));
          raw[pxOffset + 0] = Math.min(255, raw[pxOffset + 0] + Math.round(120 * it));
          raw[pxOffset + 1] = Math.min(255, raw[pxOffset + 1] + Math.round(140 * it));
          raw[pxOffset + 2] = Math.min(255, raw[pxOffset + 2] + Math.round(255 * it));
        }
      } else {
        // Transparent
        raw[pxOffset + 0] = 0;
        raw[pxOffset + 1] = 0;
        raw[pxOffset + 2] = 0;
        raw[pxOffset + 3] = 0;
      }
    }
  }

  const compressed = zlib.deflateSync(raw);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

function createIcoFromPng(pngBuf) {
  // ICONDIR header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(1, 4); // 1 image

  // ICONDIRENTRY: 16 bytes
  const entry = Buffer.alloc(16);
  entry.writeUInt8(0, 0); // 256 width (0 = 256)
  entry.writeUInt8(0, 1); // 256 height (0 = 256)
  entry.writeUInt8(0, 2); // color count
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bpp
  entry.writeUInt32LE(pngBuf.length, 8); // image size
  entry.writeUInt32LE(22, 12); // image offset (6 + 16)

  return Buffer.concat([header, entry, pngBuf]);
}

const png256 = createPng(256);
const ico = createIcoFromPng(png256);

// Ensure directories exist
fs.mkdirSync('build', { recursive: true });
fs.mkdirSync('public/icons', { recursive: true });

// Write files
fs.writeFileSync('build/icon.png', png256);
fs.writeFileSync('build/icon.ico', ico);
fs.writeFileSync('build/icon.icns', png256);

fs.writeFileSync('public/icons/icon.png', png256);
fs.writeFileSync('public/icons/icon.ico', ico);
fs.writeFileSync('public/icons/icon.icns', png256);
fs.writeFileSync('public/favicon.ico', ico);

console.log('Successfully generated valid icons:');
console.log('PNG size:', png256.length, 'bytes');
console.log('ICO size:', ico.length, 'bytes');
