#!/usr/bin/env node
// Simple static page builder: injects Markdown into pages/_template.html
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

const templatePath = path.join(__dirname, '..', 'pages', '_template.html');
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

const contentDir = path.join(__dirname, '..', 'pages', 'content');
const outDir = path.join(__dirname, '..');

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

