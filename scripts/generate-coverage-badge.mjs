// Generates a static shields.io-style SVG coverage badge from the Vitest
// v8 coverage summary, without requiring any extra npm dependency.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const summaryPath = resolve(__dirname, '../coverage/coverage-summary.json');
const outDir = resolve(__dirname, '../badges');
const outPath = resolve(outDir, 'coverage.svg');

const summary = JSON.parse(readFileSync(summaryPath, 'utf8'));
const pct = summary.total.lines.pct;
const label = 'coverage';
const value = `${pct}%`;

function colorForPct(p) {
  if (p >= 90) return '#4c1';
  if (p >= 75) return '#97ca00';
  if (p >= 60) return '#dfb317';
  if (p >= 40) return '#fe7d37';
  return '#e05d44';
}

function charWidth(text) {
  // Rough monospace-ish width estimate, matches common shields.io badges closely enough.
  return Math.round(text.length * 6.5 + 10);
}

const labelWidth = charWidth(label);
const valueWidth = charWidth(value);
const totalWidth = labelWidth + valueWidth;
const color = colorForPct(pct);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${value}">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text x="${labelWidth / 2}" y="14">${label}</text>
    <text x="${labelWidth + valueWidth / 2}" y="14">${value}</text>
  </g>
</svg>
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, svg, 'utf8');

console.log(`Coverage badge generated: ${value} -> ${outPath}`);
