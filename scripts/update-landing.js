#!/usr/bin/env node
// Update landing (index.html) sections from Markdown under content/landing

const fs = require('fs');
const path = require('path');
let marked;
try { marked = require('marked'); } catch (e) {
  console.error('\nError: This script requires the "marked" package.');
  console.error('Install it with: npm install --save-dev marked\n');
  process.exit(1);
}

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const slugs = ['about','projects','dataviz','openskies','sam','writing'];
const titles = {
  about: 'About Me',
  projects: 'Research & Development',
  dataviz: 'Data Visualization Tools',
  openskies: 'OM OpenSkies Initiative',
  sam: 'Sam AI',
  writing: 'Creative Writing'
};
const landDir = path.join(root, 'content', 'landing');

function replaceSectionContent(doc, id, contentHtml){
  // Replace the inner HTML of <div class="section-content"> inside section#id
  const re = new RegExp(
    `(<section[^>]*id=\"${id}\"[\\s\\S]*?<div class=\\\"section-content\\\">)([\\s\\S]*?)(</div>\\s*</div>\\s*</section>)`
  );
  if (!re.test(doc)) {
    console.warn('Could not locate section-content for', id);
    return doc;
  }
  return doc.replace(re, `$1\n${contentHtml}\n$3`);
}

slugs.forEach(slug => {
  const mdPath = path.join(landDir, `${slug}.md`);
  let md = '';
  try { md = fs.readFileSync(mdPath,'utf8'); } catch (e) { md = `# ${slug}\n\nComing soon.`; }
  let sectionHtml = marked.parse(md).trim();
  // If MD starts with a top heading, strip it to avoid duplicate titles
  sectionHtml = sectionHtml.replace(/^<h[12][^>]*>.*?<\/h[12]>\s*/i, '');
  const composed = `<h2>${titles[slug] || slug}</h2>\n${sectionHtml}`;
  html = replaceSectionContent(html, slug, composed);
});

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Updated index.html sections from content/landing');
