document.addEventListener('DOMContentLoaded', function () {
  var toggles = Array.prototype.slice.call(document.querySelectorAll('.nav-toggle'));
  var menu = document.getElementById('site-menu');
  var root = document.documentElement;
  var header = document.getElementById('large-header') || document.getElementById('page-header');
  var overlay = document.getElementById('site-overlay');
  var overlayBody = document.getElementById('overlay-body');
  var overlayClose = overlay ? overlay.querySelector('.overlay__close') : null;
  var lastFocus = null;
  var credToggle = document.querySelector('.cred-toggle');
  var credPanel = document.getElementById('cred-panel');
  var credClose = credPanel ? credPanel.querySelector('.cred-panel__close') : null;
  var hasMenu = toggles.length > 0 && menu;
  var heroVisible = true;

  function openMenu() {
    if (!hasMenu) return;
    menu.hidden = false;
    toggles.forEach(function (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
    });
    root.classList.add('nav-open');
  }

  function closeMenu() {
    if (!hasMenu) return;
    menu.hidden = true;
    toggles.forEach(function (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    });
    root.classList.remove('nav-open');
  }

  function toggleMenu() {
    if (!hasMenu) return;
    var expanded = !menu.hidden;
    if (expanded) closeMenu(); else openMenu();
  }

  if (hasMenu) {
    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        toggleMenu();
      });
    });

    menu.addEventListener('click', function (e) {
      if (e.target && e.target.closest('a')) {
        closeMenu();
      }
    });

    document.addEventListener('click', function (e) {
      var clickedToggle = toggles.some(function (toggle) { return toggle.contains(e.target); });
      if (!menu.hidden && !menu.contains(e.target) && !clickedToggle) closeMenu();
    });
  }

  function openCred() {
    if (!credToggle || !credPanel) return;
    credPanel.hidden = false;
    credToggle.setAttribute('aria-expanded', 'true');
    credToggle.setAttribute('aria-label', 'Hide academic verification details');
    root.classList.add('cred-open');
    root.classList.remove('cred-fade');
  }

  function closeCred() {
    if (!credToggle || !credPanel) return;
    credPanel.hidden = true;
    credToggle.setAttribute('aria-expanded', 'false');
    credToggle.setAttribute('aria-label', 'Show academic verification details');
    root.classList.remove('cred-open');
    refreshCredFade();
  }

  function toggleCred() {
    if (!credToggle || !credPanel) return;
    var expanded = credToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) closeCred(); else openCred();
  }

  if (credToggle && credPanel) {
    credToggle.addEventListener('click', function(e){
      e.preventDefault();
      toggleCred();
    });
  }
  if (credClose) {
    credClose.addEventListener('click', function(e){
      e.preventDefault();
      closeCred();
    });
  }

  function refreshCredFade() {
    if (credPanel && !credPanel.hidden) {
      root.classList.remove('cred-fade');
      return;
    }
    var fade = !heroVisible;
    root.classList.toggle('cred-fade', fade);
  }

  function autoCloseCredIfFaded() {
    if (!heroVisible && credPanel && !credPanel.hidden) {
      closeCred();
    }
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
      if (overlay && !overlay.hasAttribute('hidden')) closeOverlay();
      if (credPanel && !credPanel.hidden) closeCred();
    }
  });

  // Use scroll position for a consistent post-hero bar on browsers with or without IntersectionObserver.
  function updateScrollChrome() {
    var heroBottom = header ? header.getBoundingClientRect().bottom : 0;
    heroVisible = !!header && heroBottom > (window.innerHeight * 0.25);
    root.classList.toggle('nav-scheme-light', !heroVisible);
    refreshCredFade();
    autoCloseCredIfFaded();
  }

  var scrollChromeQueued = false;
  var requestFrame = window.requestAnimationFrame || function (callback) { return window.setTimeout(callback, 16); };
  function queueScrollChromeUpdate() {
    if (scrollChromeQueued) return;
    scrollChromeQueued = true;
    requestFrame(function () {
      scrollChromeQueued = false;
      updateScrollChrome();
    });
  }

  updateScrollChrome();
  window.addEventListener('scroll', queueScrollChromeUpdate, false);
  window.addEventListener('resize', queueScrollChromeUpdate);

  // Blur-up header: mark header as loaded after window load to fade overlay
  window.addEventListener('load', function(){
    if (header) header.classList.add('bg-loaded');
  });

  // Overlay routing (works on index and pages/*)
  function isOverlayPath(href) {
    if (!href) return false;
    var m = href.match(/^\/([a-z0-9\-]+)$/i);
    if (m && document.getElementById('overlay-tpl-' + m[1])) return true;
    if (/^\/(?:credits-website-design|credits-illustrations|ai-assistance)$/.test(href) && document.getElementById('overlay-tpl-credits')) return true;
    if (/^\/(?:standards|conduct|privacy|legal)$/.test(href) && document.getElementById('overlay-tpl-credits')) return true;
    // Accept either spelling for compatibility
    return /^(\/ai-assistance|\/conduct|\/privacy|\/legal|\/(?:newletter|newsletter))$/.test(href);
  }
  function tpl(slug){
    // Legacy credit URLs now open the combined credits overlay.
    if (/^(?:credits-website-design|credits-illustrations|ai-assistance)$/.test(slug)) {
      return document.getElementById('overlay-tpl-credits');
    }
    // Standards URLs now open the same combined credits and standards overlay.
    if (/^(?:standards|conduct|privacy|legal)$/.test(slug)) {
      return document.getElementById('overlay-tpl-credits');
    }
    // Support alias: newsletter (correct spelling) maps to legacy template id 'newletter'
    return document.getElementById('overlay-tpl-' + slug) ||
           (slug === 'newsletter' ? document.getElementById('overlay-tpl-newletter') : null);
  }
  function initOverlayContent(slug){
    if (!overlayBody) return;
    // Newsletter AJAX submission (inline success)
    var nl = overlayBody.querySelector('.nl-form');
    if (nl) {
      nl.addEventListener('submit', function(e){
        e.preventDefault();
        var fd = new FormData(nl);
        var action = nl.getAttribute('action') || '';
        fetch(action, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } })
          .then(function(r){ if (!r.ok) throw new Error('HTTP '+r.status); return r.json().catch(function(){ return {}; }); })
          .then(function(){
            overlayBody.innerHTML = '<div class="nl-success" style="max-width:640px;margin:0 auto;text-align:center">\
              <h3>Thanks for subscribing!</h3>\
              <p>You\'re on the list. We\'ll be in touch soon.</p>\
            </div>';
            overlayBody.focus();
          })
          .catch(function(){
            var note = overlayBody.querySelector('.note');
            if (note) { note.textContent = 'Hmm, something went wrong. Please try again in a minute.'; }
          });
      }, { once: true });
    }
  }

  function openOverlay(slug, title){
    if (!overlay) return;
    var isFullPageOverlay = /^(?:credits|credits-website-design|credits-illustrations|ai-assistance|standards|conduct|privacy|legal|contact|book-a-meeting)$/.test(slug);
    lastFocus = document.activeElement;
    document.documentElement.classList.add('overlay-open');
    document.body.classList.add('overlay-open');
    overlay.classList.toggle('overlay--full-page', isFullPageOverlay);
    overlay.setAttribute('aria-labelledby', isFullPageOverlay ? 'overlay-content-title' : 'overlay-title');
    overlay.removeAttribute('hidden');
    var t = document.getElementById('overlay-title');
    if (t) t.textContent = title || 'Information';
    if (overlayBody){
      var fallback = {
        'ai-assistance': '<h3>AI Assistance Disclosure</h3><p>We use human-in-the-loop AI tools to draft and refine content. All work is reviewed by a human for accuracy and tone.</p>',
        'conduct': '<h3>Open Scientific Practice</h3><p>We aim for kindness, clarity, and inclusion. Harassment, discrimination, and abuse are not tolerated.</p>',
        'privacy': '<h3>Privacy & Terms</h3><p>No invasive tracking. Minimal analytics and local-first principles.</p>',
        'legal': '<h3>Copyright & Fair Dealing</h3><p>Fair dealing (Canada) applies with attribution. Please don\'t redistribute wholesale.</p>'
      };
      var template = tpl(slug);
      overlayBody.innerHTML = template ? template.innerHTML : (fallback[slug] || '<p>Coming soon.</p>');
      // If no explicit title was provided, pull from first heading in content
      if (t && !title) {
        var heading = overlayBody.querySelector('h3, h2, h1');
        if (heading && heading.textContent) {
          t.textContent = heading.textContent.trim();
        }
      }
      overlayBody.focus();
      initOverlayContent(slug);
    }
  }
  function closeOverlay(){
    if (!overlay) return;
    overlay.setAttribute('hidden','');
    overlay.classList.remove('overlay--full-page');
    overlay.setAttribute('aria-labelledby', 'overlay-title');
    document.documentElement.classList.remove('overlay-open');
    document.body.classList.remove('overlay-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (overlayClose){ overlayClose.addEventListener('click', closeOverlay); }
  if (overlay){ overlay.addEventListener('click', function(e){ if (e.target === overlay) closeOverlay(); }); }

  document.addEventListener('click', function(e){
    if (!credPanel || credPanel.hidden) return;
    var withinPanel = credPanel.contains(e.target);
    var withinToggle = credToggle && credToggle.contains(e.target);
    if (!withinPanel && !withinToggle) closeCred();
  });

  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (isOverlayPath(href)){
      e.preventDefault();
      var slug = href.replace(/^\//,'');
      var titles = {
        // Standards
        'ai-assistance':'Credits',
        'conduct':'Credits',
        'privacy':'Credits',
        'legal':'Credits',
        // Newsletter
        'newletter':'Subscribe to our Newsletter',
        'newsletter':'Subscribe to our Newsletter',
        // Articles
        'articles-science-outreach':'Science Outreach',
        'articles-solar-physics':'Solar Physics',
        'articles-writing':'Creative Writing',
        'articles-how-tos':'How‑Tos',
        // Credits
        'credits':'Credits',
        'credits-website-design':'Credits',
        'credits-illustrations':'Credits',
        'contact':'Contact',
        'book-a-meeting':'Book a Meeting',
        'credits-animations':'Animations',
        'credits-om-credentials':'OM Credentials',
        // Standards
        'standards':'Credits',
        // Labs
        'labs-modularity':'Modularity',
        'labs-decentralization':'Decentralization',
        'labs-ai-tools':'AI Tools',
        'labs-open-source':'Open‑Source'
      };
      openOverlay(slug, titles[slug]);
    }
  });

  // Active link highlighting based on sections in view
  var links = hasMenu ? Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]')) : [];
  var sections = hasMenu ? links
      .map(function(a){
        try { return document.querySelector(a.getAttribute('href')); } catch(e) { return null; }
      })
      .filter(function(el){ return !!el; }) : [];

  function setActive(id) {
    links.forEach(function(a){
      var isActive = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', isActive);
      if (isActive) { a.setAttribute('aria-current', 'location'); }
      else { a.removeAttribute('aria-current'); }
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var activeId = null;
    var sectionObserver = new IntersectionObserver(function(entries){
      // Pick the most visible section
      var visible = entries
        .filter(function(e){ return e.isIntersecting; })
        .sort(function(a,b){ return b.intersectionRatio - a.intersectionRatio; });
      if (visible[0]) {
        var id = visible[0].target.id;
        if (id !== activeId) { activeId = id; setActive(id); }
      }
    }, { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] });

    sections.forEach(function(sec){ sectionObserver.observe(sec); });
  }
});
