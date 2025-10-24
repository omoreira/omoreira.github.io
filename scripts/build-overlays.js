#!/usr/bin/env node
// Build overlays: render Markdown from content/overlay/*.md into inline <template> blocks

const fs = require('fs');
const path = require('path');
let marked;
try { marked = require('marked'); } catch (e) {
  console.error('\nError: This script requires the "marked" package.');
  console.error('Install it with: npm install --save-dev marked\n');
  process.exit(1);
}

const root = path.join(__dirname, '..');
const targets = [
  path.join(root, 'index.html'),
  path.join(root, 'content', '_template.html'),
];
const overlaysDir = path.join(root, 'content', 'overlay');
// Discover all .md files in content/overlay and use filename (without .md) as slug
const overlays = fs.readdirSync(overlaysDir)
  .filter(f => f.endsWith('.md'))
  .map(file => ({ slug: file.replace(/\.md$/, ''), file }));

const fragments = {};
overlays.forEach(o => {
  const p = path.join(overlaysDir, o.file);
  try {
    const md = fs.readFileSync(p, 'utf8');
    fragments[o.slug] = marked.parse(md).trim();
  } catch (e) {
    fragments[o.slug] = `<p>Coming soon.</p>`;
  }
});

targets.forEach(tgt => {
  let html;
  try { html = fs.readFileSync(tgt, 'utf8'); } catch { return; }
  overlays.forEach(o => {
    const re = new RegExp(`<template\\s+id=["']overlay-tpl-${o.slug}["']\\s*>[\\s\\S]*?<\\/template>`, 'm');
    const replacement = `\n  <template id=\"overlay-tpl-${o.slug}\">\n${fragments[o.slug]}\n  </template>`;
    if (re.test(html)) {
      html = html.replace(re, replacement);
    } else {
      // append missing template before closing body/html
      html = html.replace(/<\/body>\s*<\/html>\s*$/m, `${replacement}\n</body>\n</html>`);
    }
  });
  fs.writeFileSync(tgt, html, 'utf8');
  console.log('Updated overlay templates in', path.relative(root, tgt));
});
