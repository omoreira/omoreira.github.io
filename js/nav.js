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
});
