/* PAOLO V8 — Animaciones progresivas y respetuosas con el movimiento reducido.
   Anime.js v4 aporta las interpolaciones; la Web Animations API funciona de respaldo.
   No cambia el listado de obras ni las rutas img/ del script original. */
(()=>{
  'use strict';
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const prefersLessData=!!(navigator.connection && navigator.connection.saveData);
  const hasAnime=()=>!!(window.anime && typeof window.anime.animate==='function');
  function motion(nodes, properties, duration=700, delay=0){
    const elements=Array.from(nodes||[]).filter(Boolean);
    if(!elements.length) return;
    elements.forEach((el,i)=>{
      const offset=delay+(i*75);
      if(hasAnime()){
        try{
          const props={duration,delay:offset,ease:'outCubic'};
          if(properties.opacity) props.opacity={from:properties.opacity[0],to:properties.opacity[1]};
          if(properties.translateY) props.y={from:properties.translateY[0],to:properties.translateY[1]};
          if(properties.scale) props.scale={from:properties.scale[0],to:properties.scale[1]};
          window.anime.animate(el,props);
          return;
        }catch(err){console.debug('Anime.js no disponible; se usa animación nativa',err)}
      }
      const from={opacity:properties.opacity?.[0]??1,transform:`translateY(${properties.translateY?.[0]??0}px) scale(${properties.scale?.[0]??1})`};
      const to={opacity:properties.opacity?.[1]??1,transform:`translateY(${properties.translateY?.[1]??0}px) scale(${properties.scale?.[1]??1})`};
      el.animate([from,to],{duration,delay:offset,easing:'cubic-bezier(.18,.7,.2,1)',fill:'both'});
    });
  }
  // Titular dividido por letras. aria-label evita que los lectores de pantalla deletreen.
  const title=document.querySelector('.hero h1');
  if(title && !title.querySelector('.hero-letter')){
    const label=title.textContent.trim();
    title.setAttribute('aria-label',label);
    title.innerHTML='';
    for(const letter of label){
      const span=document.createElement('span');span.className='hero-letter';span.textContent=letter;span.setAttribute('aria-hidden','true');title.appendChild(span);
    }
    // La cortina inicial cubre la preparación de las letras.
    motion(title.querySelectorAll('.hero-letter'),{opacity:[0,1],translateY:[46,0]},1050,650);
    motion(document.querySelectorAll('.hero-copy .eyebrow,.hero-copy .hero-sub,.hero-copy .hero-actions,.hero-ornament'),{opacity:[0,1],translateY:[24,0]},900,1300);
  }
  // Nueva selección: una sola fotografía por disciplina en Destacadas (con muralismo).
  function enterVisibleCards(){
    const cards=document.querySelectorAll('#gallery .work:not([hidden])');
    // Evita animaciones demasiado largas en colecciones muy grandes.
    if(cards.length>0 && cards.length<=30){
      cards.forEach(el=>el.classList.add('visible'));
      motion(cards,{opacity:[0,1],translateY:[28,0]},550,50);
    }else cards.forEach(el=>el.classList.add('visible'));
  }
  // El script principal crea las tarjetas y configura los filtros antes de cargar este archivo.
  enterVisibleCards();
  const filters=document.querySelector('.filters');
  let filterTimer;
  document.addEventListener('paolo:filter-change',()=>{
    if(filters){filters.classList.remove('is-changing');void filters.offsetWidth;filters.classList.add('is-changing');
      clearTimeout(filterTimer);filterTimer=setTimeout(()=>filters.classList.remove('is-changing'),700)}
    enterVisibleCards();
  });
  const stage=document.querySelector('.process-stage');
  let stageTimer;
  document.addEventListener('paolo:stage-change',()=>{
    if(!stage) return;
    stage.classList.remove('is-changing');void stage.offsetWidth;stage.classList.add('is-changing');
    clearTimeout(stageTimer);stageTimer=setTimeout(()=>stage.classList.remove('is-changing'),620);
    const img=document.getElementById('lightImg');
    if(img) motion([img],{opacity:[.65,1],scale:[.98,1]},430,0);
  });
  // Efecto discreto de aparición en secciones adicionales.
  if(!prefersLessData && 'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(({target,isIntersecting})=>{
        if(!isIntersecting)return;
        if(!target.dataset.paoloAnimated){target.dataset.paoloAnimated='yes';motion([target],{opacity:[0,1],translateY:[18,0]},800,0)}
        observer.unobserve(target);
      });
    },{threshold:.13});
    document.querySelectorAll('.manifesto-art,.contact > div').forEach(el=>observer.observe(el));
  }
})();
