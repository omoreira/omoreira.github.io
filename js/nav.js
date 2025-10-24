document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('site-menu');
  var root = document.documentElement;
  var header = document.getElementById('large-header') || document.getElementById('page-header');
  var overlay = document.getElementById('site-overlay');
  var overlayBody = document.getElementById('overlay-body');
  var overlayClose = overlay ? overlay.querySelector('.overlay__close') : null;
  var lastFocus = null;
  var backTop = document.querySelector('.back-to-top');
  var nextBtn = document.querySelector('.next-section');
  var orderedSections = [
    document.getElementById('large-header'),
    document.getElementById('about'),
    document.getElementById('projects'),
    document.getElementById('dataviz'),
    document.getElementById('openskies'),
    document.getElementById('sam'),
    document.getElementById('writing'),
    document.getElementById('closing-band')
  ].filter(Boolean);
  // Next scroll excludes footer only; allows navigating into closing-band but not from it
  var orderedNext = [
    document.getElementById('large-header'),
    document.getElementById('about'),
    document.getElementById('projects'),
    document.getElementById('dataviz'),
    document.getElementById('openskies'),
    document.getElementById('sam'),
    document.getElementById('writing'),
    document.getElementById('closing-band')
  ].filter(Boolean);

  if (!toggle || !menu) return;

  function openMenu() {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    root.classList.add('nav-open');
  }

  function closeMenu() {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    root.classList.remove('nav-open');
  }

  function toggleMenu() {
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded) closeMenu(); else openMenu();
  }

  toggle.addEventListener('click', function (e) {
    e.preventDefault();
    toggleMenu();
  });

  menu.addEventListener('click', function (e) {
    if (e.target && e.target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
      if (overlay && !overlay.hasAttribute('hidden')) closeOverlay();
    }
  });

  // Set initial nav scheme (assume dark over hero)
  root.classList.remove('nav-scheme-light');

  // Toggle nav color scheme based on whether hero header is in view
  if (header && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          root.classList.remove('nav-scheme-light');
        } else {
          root.classList.add('nav-scheme-light');
        }
      });
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    io.observe(header);
  } else {
    // Fallback: switch to light scheme after first scroll past viewport height
    window.addEventListener('scroll', function(){
      var y = window.scrollY || window.pageYOffset;
      if (y > (window.innerHeight * 0.5)) {
        root.classList.add('nav-scheme-light');
      } else {
        root.classList.remove('nav-scheme-light');
      }
    });
  }

  // Back to top visibility
  function updateBackTop() {
    if (!backTop) return;
    var y = window.scrollY || window.pageYOffset;
    // Visibility
    if (y > (window.innerHeight * 0.75)) {
      backTop.classList.add('visible');
    } else {
      backTop.classList.remove('visible');
    }

    // Mode: when in or past the closing band (or near page bottom), make it jump to top
    var toTop = false;
    if (orderedSections.length) {
      var tops = orderedSections.map(function (el) {
        var r = el.getBoundingClientRect();
        return r.top + (window.scrollY || window.pageYOffset || 0);
      });
      var closingIdx = tops.length - 1; // closing-band is last in our list
      var tolerance = 4;
      // If scrolled past closing-band top, or near document bottom
      var atOrPastClosing = y + tolerance >= tops[closingIdx];
      var nearBottom = (y + window.innerHeight) >= (document.documentElement.scrollHeight - 2);
      toTop = atOrPastClosing || nearBottom;
    }
    backTop.classList.toggle('to-top', toTop);
    backTop.setAttribute('aria-label', toTop ? 'Back to top' : 'Previous section');
  }
  updateBackTop();
  window.addEventListener('scroll', updateBackTop, { passive: true });

  // Blur-up header: mark header as loaded after window load to fade overlay
  window.addEventListener('load', function(){
    if (header) header.classList.add('bg-loaded');
  });

  // Overlay routing (works on index and pages/*)
  function isOverlayPath(href) {
    if (!href) return false;
    var m = href.match(/^\/([a-z0-9\-]+)$/i);
    if (m && document.getElementById('overlay-tpl-' + m[1])) return true;
    return /^(\/ai-assistance|\/conduct|\/privacy|\/legal|\/newletter)$/.test(href);
  }
  function tpl(slug){ return document.getElementById('overlay-tpl-' + slug); }
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
    lastFocus = document.activeElement;
    document.documentElement.classList.add('overlay-open');
    document.body.classList.add('overlay-open');
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
      overlayBody.focus();
      initOverlayContent(slug);
    }
  }
  function closeOverlay(){
    if (!overlay) return;
    overlay.setAttribute('hidden','');
    document.documentElement.classList.remove('overlay-open');
    document.body.classList.remove('overlay-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (overlayClose){ overlayClose.addEventListener('click', closeOverlay); }
  if (overlay){ overlay.addEventListener('click', function(e){ if (e.target === overlay) closeOverlay(); }); }

  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (isOverlayPath(href)){
      e.preventDefault();
      var slug = href.replace(/^\//,'');
      var titles = { 'ai-assistance':'AI Assistance Disclosure','conduct':'Open Scientific Practice','privacy':'Privacy & Terms','legal':'Copyright & Fair Dealing', 'newletter':'Subscribe to our Newsletter'};
      openOverlay(slug, titles[slug]);
    }
  });

  function updateNextBtn() {
    if (!nextBtn || !orderedNext.length) return;
    var y = window.scrollY || window.pageYOffset || 0;
    // Compute tops
    var tops = orderedNext.map(function (el) {
      var r = el.getBoundingClientRect();
      return r.top + (window.scrollY || window.pageYOffset || 0);
    });
    // Find current index (last whose top <= y + tolerance)
    var tolerance = 4;
    var currentIdx = 0;
    for (var i = 0; i < tops.length; i++) {
      if (tops[i] <= y + tolerance) currentIdx = i;
    }
    var atFirst = currentIdx === 0;            // first is hero
    var atLast = currentIdx >= tops.length - 1; // last is closing-band
    if (atLast || atFirst) {
      nextBtn.classList.remove('visible');
    } else {
      nextBtn.classList.add('visible');
    }
  }
  updateNextBtn();
  window.addEventListener('scroll', updateNextBtn, { passive: true });

  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      if (!orderedNext.length) return;
      e.preventDefault();
      var y = window.scrollY || window.pageYOffset || 0;
      var tops = orderedNext.map(function (el) {
        var r = el.getBoundingClientRect();
        return r.top + (window.scrollY || window.pageYOffset || 0);
      });
      var tolerance = 4;
      var currentIdx = 0;
      for (var i = 0; i < tops.length; i++) {
        if (tops[i] <= y + tolerance) currentIdx = i;
      }
      var targetIdx = Math.min(orderedNext.length - 1, currentIdx + 1);
      var targetEl = orderedNext[targetIdx];
      if (targetEl && typeof targetEl.scrollIntoView === 'function') {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (tops[targetIdx] !== undefined) {
        window.scrollTo({ top: tops[targetIdx], behavior: 'smooth' });
      }
    });
  }

  // Back-to-top: scroll to previous section instead of absolute top
  if (backTop) {
    backTop.addEventListener('click', function (e) {
      // If no sections, fallback to default behavior
      if (!orderedSections.length) return;
      e.preventDefault();

      var currentY = window.scrollY || window.pageYOffset || 0;
      // Compute absolute tops for each section
      var tops = orderedSections.map(function (el) {
        var rect = el.getBoundingClientRect();
        return rect.top + (window.scrollY || window.pageYOffset || 0);
      });

      // Find current section index as the last whose top <= currentY + tolerance
      var tolerance = 4;
      var currentIdx = 0;
      for (var i = 0; i < tops.length; i++) {
        if (tops[i] <= currentY + tolerance) currentIdx = i;
      }
      var closingIdx = tops.length - 1;
      var toTop = backTop.classList.contains('to-top') || currentIdx >= closingIdx;
      var targetIdx = toTop ? 0 : Math.max(0, currentIdx - 1);

      // Smooth scroll to target section
      var targetEl = orderedSections[targetIdx];
      if (targetEl && typeof targetEl.scrollIntoView === 'function') {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (tops[targetIdx] !== undefined) {
        window.scrollTo({ top: tops[targetIdx], behavior: 'smooth' });
      }
    });
  }

  // Active link highlighting based on sections in view
  var links = Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]'));
  var sections = links
    .map(function(a){
      try { return document.querySelector(a.getAttribute('href')); } catch(e) { return null; }
    })
    .filter(function(el){ return !!el; });

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
