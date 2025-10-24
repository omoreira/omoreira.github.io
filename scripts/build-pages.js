#!/usr/bin/env node
// Simple static page builder: injects Markdown into content/_template.html (omlanding)
// Usage: node scripts/build-pages.js

const fs = require('fs');
const path = require('path');
let marked;
try {
  marked = require('marked');
} catch (e) {
  console.error('\nError: This script requires the "marked" package.');
  console.error('Install it with: npm install --save-dev marked\n');
  process.exit(1);
}

const templatePath = path.join(__dirname, '..', 'content', '_template.html');
const template = fs.readFileSync(templatePath, 'utf8');

const pages = [
  { out: 'modular.html', title: 'Modular Assistant Systems', md: 'modular.md', desc: 'Modular assistant systems by OM.' },
  { out: 'solarp.html', title: 'Solar Physics', md: 'solarp.md', desc: 'Solar physics reviews and notes.' },
  { out: 'dataviz.html', title: 'Data Visualization', md: 'dataviz.md', desc: 'Data visualization tools and demos.' },
  { out: 'pub.html', title: 'Academic Publications', md: 'pub.md', desc: 'Selected academic publications.' },
  { out: 'omopenskies.html', title: 'OM OpenSkies', md: 'omopenskies.md', desc: 'OM OpenSkies initiative.' },
  { out: 'samai.html', title: 'Sam AI', md: 'samai.md', desc: 'Sam AI project overview.' },
  { out: 'miagraves.html', title: 'Creative Writing', md: 'miagraves.md', desc: 'Creative writing by OM.' },
  { out: 'contact.html', title: 'Contact', md: 'contact.md', desc: 'Contact OM.' },
  { out: 'chatdemo.html', title: 'Demo Chat', md: 'chatdemo.md', desc: 'Demo chat interface.' },
  { out: 'newletter.html', title: 'Newsletter', md: 'newletter.md', desc: 'Newsletter signup and archives.' },
  { out: 'gmrkba.html', title: 'GM-RKB Assistant', md: 'gmrkba.md', desc: 'GM-RKB assistant info.' },
];

const contentDir = path.join(__dirname, '..', 'content', 'pages');
// Write generated HTML into the content/ directory (HTML pages output location)
const outDir = path.join(__dirname, '..', 'content');

function syncOverlayTemplates() {
  const rootDir = path.join(__dirname, '..');
  const targets = [
    path.join(rootDir, 'index.html'),
    path.join(rootDir, 'pages', '_template.html'),
  ];
  const overlaysDir = path.join(rootDir, 'pages', 'overlay');
  // Overlay content is authored in Markdown files
  const overlays = [
    { slug: 'ai-assistance', file: 'ai-assistance.md' },
    { slug: 'conduct', file: 'conduct.md' },
    { slug: 'privacy', file: 'privacy.md' },
    { slug: 'legal', file: 'legal.md' },
  ];

  const fragments = {};
  overlays.forEach(o => {
    const p = path.join(overlaysDir, o.file);
    try {
      const md = fs.readFileSync(p, 'utf8');
      const html = marked.parse(md);
      fragments[o.slug] = html.trim();
    } catch (e) {
      fragments[o.slug] = `<p>Coming soon.</p>`;
    }
  });

  targets.forEach(tgt => {
    let html = '';
    try { html = fs.readFileSync(tgt, 'utf8'); } catch (e) { return; }
    overlays.forEach(o => {
      const re = new RegExp(`<template\\s+id=["']overlay-tpl-${o.slug}["']\\s*>[\\s\\S]*?<\\/template>`, 'm');
      const replacement = `
  <template id="overlay-tpl-${o.slug}">
${fragments[o.slug]}
  </template>`;
      if (re.test(html)) {
        html = html.replace(re, replacement);
      }
    });
    fs.writeFileSync(tgt, html, 'utf8');
    console.log('Updated overlay templates in', path.relative(rootDir, tgt));
  });
}

for (const p of pages) {
  const mdPath = path.join(contentDir, p.md);
  let md = '';
  try {
    md = fs.readFileSync(mdPath, 'utf8');
  } catch (e) {
    md = `# ${p.title}\n\nComing soon.`;
  }
  const htmlContent = marked.parse(md);
  const html = template
    .replace(/\{\{title\}\}/g, p.title)
    .replace(/\{\{description\}\}/g, p.desc)
    .replace(/\{\{content\}\}/g, htmlContent);
  fs.writeFileSync(path.join(outDir, p.out), html, 'utf8');
  console.log('Wrote', p.out);
}

// Overlay syncing is handled by scripts/build-overlays.js
