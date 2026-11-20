document.addEventListener('DOMContentLoaded', function(){
  var tip;
  function createTip(){
    tip = document.createElement('div');
    tip.className = 'omtip';
    tip.innerHTML = '<div class="omtip__panel"></div><div class="omtip__arrow"></div>';
    document.body.appendChild(tip);
  }
  function showTipFor(anchor){
    if (!tip) createTip();
    var slug = anchor.getAttribute('data-omlink');
    if (!slug) return;
    var tpl = document.getElementById('omlink-tpl-' + slug);
    var panel = tip.querySelector('.omtip__panel');
    if (tpl && panel){ panel.innerHTML = tpl.innerHTML; } else { panel.innerHTML = '<p>…</p>'; }
    tip.style.display = 'block';
    positionTip(anchor);
  }
  function positionTip(anchor){
    var rect = anchor.getBoundingClientRect();
    var panel = tip.querySelector('.omtip__panel');
    var arrow = tip.querySelector('.omtip__arrow');
    var top = window.scrollY + rect.bottom + 10; // below link
    var left = window.scrollX + Math.max(10, rect.left - 20);
    tip.style.top = top + 'px';
    tip.style.left = left + 'px';
    arrow.style.top = '-7px';
    arrow.style.left = '18px';
  }
  function hideTip(){ if (tip) tip.style.display = 'none'; }

  document.addEventListener('mouseover', function(e){
    var a = e.target.closest('a[data-omlink]');
    if (a) showTipFor(a);
  });
  document.addEventListener('mouseout', function(e){
    var a = e.target.closest('a[data-omlink]');
    if (a) hideTip();
  });
  document.addEventListener('focusin', function(e){
    var a = e.target.closest('a[data-omlink]');
    if (a) showTipFor(a);
  });
  document.addEventListener('focusout', function(e){
    var a = e.target.closest('a[data-omlink]');
    if (a) hideTip();
  });
});

