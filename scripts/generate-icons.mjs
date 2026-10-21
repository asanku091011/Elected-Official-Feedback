// Draws the original Civic app icon as plain PNG files, with no image editor
// and no third-party artwork. Run with: node scripts/generate-icons.mjs
//
// The mark is a speech bubble with three dots: a message, ready to be read.

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const NAVY = [27, 42, 74, 255]; // #1B2A4A
const AMBER = [232, 160, 32, 255]; // #E8A020
const NAVY_DOT = [27, 42, 74, 255];
const TRANSPARENT = [0, 0, 0, 0];

// ---- PNG encoding -------------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function encodePng(width, height, rgba) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bit depth
  header[9] = 6; // color type: RGBA
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0; // no filter
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---- Shape helpers ------------------------------------------------------

function inRoundedRect(x, y, left, top, width, height, radius) {
  if (x < left || x > left + width || y < top || y > top + height) return false;
  const nearLeft = x < left + radius;
  const nearRight = x > left + width - radius;
  const nearTop = y < top + radius;
  const nearBottom = y > top + height - radius;
  if ((nearLeft || nearRight) && (nearTop || nearBottom)) {
    const cx = nearLeft ? left + radius : left + width - radius;
    const cy = nearTop ? top + radius : top + height - radius;
    return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;
  }
  return true;
}

function inTriangle(x, y, [ax, ay], [bx, by], [cx, cy]) {
  const d1 = (x - bx) * (ay - by) - (ax - bx) * (y - by);
  const d2 = (x - cx) * (by - cy) - (bx - cx) * (y - cy);
  const d3 = (x - ax) * (cy - ay) - (cx - ax) * (y - ay);
  const hasNegative = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPositive = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNegative && hasPositive);
}

function inCircle(x, y, cx, cy, r) {
  return (x - cx) ** 2 + (y - cy) ** 2 <= r ** 2;
}

// ---- Drawing ------------------------------------------------------------

const SHAPES = {
  bubble: (x, y) => inRoundedRect(x, y, 240, 268, 544, 356, 96),
  tail: (x, y) => inTriangle(x, y, [376, 600], [352, 762], [536, 616]),
  dot1: (x, y) => inCircle(x, y, 398, 446, 30),
  dot2: (x, y) => inCircle(x, y, 512, 446, 30),
  dot3: (x, y) => inCircle(x, y, 626, 446, 30),
};

// scale < 1 keeps the mark inside Android's adaptive icon safe zone.
function colorAt(x, y, background, scale = 1) {
  const px = 512 + (x - 512) * scale;
  const py = 512 + (y - 512) * scale;

  if (SHAPES.dot1(px, py) || SHAPES.dot2(px, py) || SHAPES.dot3(px, py)) {
    return NAVY_DOT;
  }
  if (SHAPES.bubble(px, py) || SHAPES.tail(px, py)) {
    return AMBER;
  }
  return background;
}

function render(size, background, scale = 1) {
  const supersample = 3;
  const big = size * supersample;
  const out = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < supersample; sy += 1) {
        for (let sx = 0; sx < supersample; sx += 1) {
          const px = ((x * supersample + sx + 0.5) / big) * 1024;
          const py = ((y * supersample + sy + 0.5) / big) * 1024;
          const [cr, cg, cb, ca] = colorAt(px, py, background, scale);
          r += cr;
          g += cg;
          b += cb;
          a += ca;
        }
      }
      const samples = supersample * supersample;
      const offset = (y * size + x) * 4;
      out[offset] = Math.round(r / samples);
      out[offset + 1] = Math.round(g / samples);
      out[offset + 2] = Math.round(b / samples);
      out[offset + 3] = Math.round(a / samples);
    }
  }

  return encodePng(size, size, out);
}

const target = path.join(process.cwd(), 'assets');
fs.mkdirSync(target, { recursive: true });

fs.writeFileSync(path.join(target, 'icon.png'), render(1024, NAVY));
fs.writeFileSync(path.join(target, 'adaptive-icon.png'), render(1024, TRANSPARENT, 0.68));
fs.writeFileSync(path.join(target, 'favicon.png'), render(64, NAVY));

console.log('Wrote assets/icon.png, assets/adaptive-icon.png, assets/favicon.png');
