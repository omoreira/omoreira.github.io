#!/usr/bin/env node
// Build om-links: render Markdown from content/omlinks/*.md into inline <template id="omlink-tpl-...">

const fs = require('fs');
const path = require('path');
let marked;
try { marked = require('marked'); } catch (e) {
  console.error('\nError: This script requires the "marked" package.');
  console.error('Install it with: npm install --save-dev marked\n');
  process.exit(1);
}

const root = path.join(__dirname, '..');
const targets = [ path.join(root, 'index.html'), path.join(root, 'content', '_template.html') ];
const dir = path.join(root, 'content', 'omlinks');
if (!fs.existsSync(dir)) process.exit(0);

const items = fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(file => ({ slug: file.replace(/\.md$/, ''), file }));
const fragments = {};
items.forEach(o => {
  const p = path.join(dir, o.file);
  const md = fs.readFileSync(p,'utf8');
  fragments[o.slug] = marked.parse(md).trim();
});

targets.forEach(tgt => {
  let html = fs.readFileSync(tgt, 'utf8');
  items.forEach(o => {
    const re = new RegExp(`<template\\s+id=["']omlink-tpl-${o.slug}["']\\s*>[\\s\\S]*?<\\/template>`, 'm');
    const replacement = `\n  <template id=\"omlink-tpl-${o.slug}\">\n${fragments[o.slug]}\n  </template>`;
    if (re.test(html)) html = html.replace(re, replacement);
    else html = html.replace(/<\/body>\s*<\/html>\s*$/m, `${replacement}\n</body>\n</html>`);
  });
  fs.writeFileSync(tgt, html, 'utf8');
  console.log('Updated om-links templates in', path.relative(root, tgt));
});

