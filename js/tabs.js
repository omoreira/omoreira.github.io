// Simple accessible tabs behavior
(function(){
    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    const panels = Array.from(document.querySelectorAll('.tab-panel'));
    function activate(index){
        tabs.forEach((t,i)=>{
              const sel = i===index;
              t.classList.toggle('is-active', sel);
              t.setAttribute('aria-selected', sel? 'true':'false');
              panels[i].classList.toggle('is-hidden', !sel);
        });
            tabs[index].focus();
    }
          tabs.forEach((btn, i)=>{
            btn.addEventListener('click', ()=> activate(i));
            btn.addEventListener('keydown', (e)=>{
              if(e.key === 'ArrowRight') activate((i+1)%tabs.length);
              if(e.key === 'ArrowLeft') activate((i-1+tabs.length)%tabs.length);
            });
          });
})();