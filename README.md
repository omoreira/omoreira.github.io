OM Personal Website

Overview
- A responsive, static website for Olga Moreira. The landing page features an animated canvas background and a concise introduction, followed by themed sections that highlight About, Research & Development, OM OpenSkies, Sam AI, and Creative Writing.

Highlights
- Animated hero header using canvas with interactive points and lines.
- Clear, readable hero typography (Montserrat) with subtle contrast shadows.
- Double-chevron scroll cue to guide users to the next section.
- Mobile “hamburger” navigation with fixed positioning and adaptive light/dark scheme for legibility across backgrounds.
- Consistent section layout: two-column grid with media (logo + tagline + lead) and descriptive text; alternates left/right by section.
- Themed backgrounds and unified heading color across sections.
- Consistent logo sizing and placeholder blocks when a logo is not provided.
- Smooth scrolling and responsive design.

Sections
- Landing: Midnight-style hero with animated background and greeting.
- About: Warm sand background with crimson accent for the title.
- Research & Development: White background with red section title; grid for highlights.
- OM OpenSkies: Light, cool gradient background tuned for lighter logo versions.
- Sam AI: White background; tagline “Smart. Soft. Structured.” and lead text.
- Creative Writing: Sand → silver vertical gradient; space for essays and stories.

Technology
- HTML/CSS/JS only (no build step required)
- CSS: Normalize.css, custom styles in css/om-landing.css (CSS variables for themes)
- JS: Hero animation (js/om-landing.js), mobile nav behavior (js/nav.js)

Project Structure
- index.html — main landing page
- css/normalize.css — CSS reset
- css/om-landing.css — consolidated site styles (hero, sections, nav)
- js/om-landing.js — animated header canvas logic
- js/nav.js — hamburger menu toggle and adaptive color scheme
- img/ — images and logos
- fonts/ — icon and font assets used by demos/logos

Local Development
- Open index.html directly in a browser, or serve locally:
  - Python 3: python3 -m http.server 8000
  - Node: npx serve .

Deployment (GitHub Pages)
- This is a user/organization site (omoreira.github.io). Pushing to the master (or main) branch publishes the site automatically at https://omoreira.github.io.
- If a push is rejected due to divergence, rebase onto origin and push:
  - git fetch origin
  - git pull --rebase origin master
  - git push origin master

Accessibility & Performance
- Smooth scrolling enabled; titles sized responsively for readability.
- Mobile nav button stays readable on all backgrounds with an adaptive color scheme.
- Canvas animation remains active only in the hero; consider adding a prefers-reduced-motion option if needed.

Acknowledgements
- The landing page animation is adapted from Codrops: “Animated Background Headers”.
  - Article: http://tympanus.net/codrops/?p=20153
  - Demo: http://tympanus.net/Development/AnimatedHeaderBackgrounds/
- License note from Codrops: integrate or build upon it for free in personal or commercial projects. Don’t republish, redistribute or sell “as‑is”. See: http://tympanus.net/codrops/licensing/


