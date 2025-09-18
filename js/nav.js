document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('site-menu');
  var root = document.documentElement;
  var header = document.getElementById('large-header');

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
