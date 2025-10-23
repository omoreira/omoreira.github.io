# OM Landing – Website Template (Public Demo)

[![License: CC BY-NC 4.0](https://img.shields.io/badge/license-CC--BY--NC%204.0-blue.svg)](https://creativecommons.org/licenses/by-nc/4.0/)  
[![Built with HTML/CSS/JS](https://img.shields.io/badge/Built%20with-HTML%20%2F%20CSS%20%2F%20JS-blueviolet.svg)]()  
[![Ethical Framework: Open Scientific Practice](https://img.shields.io/badge/Ethical%20Framework-Open%20Scientific%20Practice-teal.svg)](https://igdore.org/open-scientific-practices/)


This branch hosts a **public demo** of my personal website project — a modular, responsive landing page template inspired by **open science, ethical design, and inclusive outreach**.  

The **live personal site** is maintained in the [`omlanding`](../../tree/omlanding) branch.

## Overview

A responsive, static website for **Olga Moreira** featuring an animated canvas hero, clean typography, and structured themed sections.  
This version serves as an **adaptable template** that others can fork and modify for their own professional websites.

### Highlights
- Animated hero header with interactive canvas background  
- Clear, readable hero typography (Montserrat)  
- Mobile-friendly navigation with adaptive color scheme  
- Section grid layout alternating left/right content flow  
- Consistent logo sizing and smooth scrolling  

---

## Technology Stack

- **HTML / CSS / JS only** (no build step required)  
- **CSS:** Normalize.css + custom variables (`css/om-landing.css`)  
- **JS:** `om-landing.js` (animation) + `nav.js` (mobile behavior)  
- **Assets:** `/img` for images/logos, `/fonts` for icon and font assets  

### Local Development

```bash
python3 -m http.server 8000
```
or

```bash
npx serve .
```


## About This Repository

This repository is structured to support **open reuse** while protecting the integrity of my live personal site.

* **`main` branch:** this demo version (fork freely for educational or non-commercial use)
* **`omlanding` branch:** live personal website (deployed via GitHub Pages)

## Scripts and Content Workflow

This demo includes a tiny static builder to help you keep content organized without a framework.

- Build pages from Markdown (writes to `pages/*.html`):

  ```bash
  node scripts/build-pages.js
  ```

- Where to edit content:
  - Pages (Markdown): `pages/content/*.md` (e.g., `pages/content/samai.md`)
  - Overlay panels (HTML fragments): `pages/overlay/*.html` (ai-assistance, conduct, privacy, legal)

- What the build does:
  - Converts the Markdown files into HTML and injects them into the shared page template (`pages/_template.html`), writing static files to `pages/`.
  - Copies the overlay fragments into inline `<template>` blocks in both `index.html` and `pages/_template.html` so overlays work without a server or fetch.

Tip: if you prefer, add an npm script for convenience:

```jsonc
// package.json
{
  "scripts": {
    "build:pages": "node scripts/build-pages.js"
  }
}
```

Then run `npm run build:pages` whenever you update Markdown or overlay content.

## Copyright & Fair Dealing (Canada)

Except where otherwise noted, all content © **Olga Moreira, PhD**.
Fair dealing applies for *private study, research, criticism, review,* or *news reporting*, with attribution.
Please do not redistribute or sell this work as-is.

**Image & Credit Notes:**

* Hero animation inspired by [Codrops – Animated Background Headers](https://tympanus.net/codrops/2014/09/23/animated-background-headers/).
* Demo visuals are for educational illustration only.




## License

This demo is released under the **Creative Commons Attribution–NonCommercial 4.0 International (CC BY-NC 4.0)** license.

You may reuse or adapt this template for non-commercial or educational purposes with attribution:

> “Template inspired by the OM Landing project — © 2025 Olga Moreira.”



