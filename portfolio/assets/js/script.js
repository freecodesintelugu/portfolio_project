document.addEventListener('DOMContentLoaded',function(){
  // year
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = y;

  // mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  navToggle && navToggle.addEventListener('click',()=>{
    if(nav.style.display === 'flex') nav.style.display='none'; else nav.style.display='flex';
  });

  // smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target){
          target.scrollIntoView({behavior:'smooth',block:'start'});
        }
        // close mobile nav
        if(window.innerWidth<=800 && nav) nav.style.display='none';
      }
    })
  })

  // reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
      }
    })
  },{threshold:0.12});
  revealEls.forEach(el=>obs.observe(el));
});
