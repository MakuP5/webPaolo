// DATOS OFICIALES DE PAOLO: completa únicamente los que él confirme.
// Ejemplo de formato: email: 'correo@dominio.com', whatsapp: '593999999999' (sin + ni espacios)
const artistContact = {
  email: '', phone: '', whatsapp: '', location: '',
  instagram: '', facebook: '', behance: '', pinterest: ''
};
function activateContactDetails(){
  const setLink=(id,label,url)=>{const el=document.getElementById(id);if(!url)return;el.href=url;el.textContent=label;el.removeAttribute('aria-disabled');el.classList.remove('footer-placeholder');if(url.startsWith('https://')){el.target='_blank';el.rel='noopener noreferrer'}};
  const email=artistContact.email.trim(),phone=artistContact.phone.trim(),whatsapp=artistContact.whatsapp.replace(/\D/g,'');
  if(email)setLink('footerEmail',email,'mailto:'+email);
  if(phone)setLink('footerPhone',phone,whatsapp?'https://wa.me/'+whatsapp:'tel:'+phone.replace(/[^+\d]/g,''));
  else if(whatsapp)setLink('footerPhone','Escribir por WhatsApp','https://wa.me/'+whatsapp);
  if(artistContact.location.trim()){document.getElementById('footerLocation').textContent=artistContact.location;document.getElementById('footerLocation').classList.remove('footer-placeholder')}
  ['instagram','facebook','behance','pinterest'].forEach(platform=>{const url=artistContact[platform].trim();if(url)setLink('social'+platform[0].toUpperCase()+platform.slice(1),platform[0].toUpperCase()+platform.slice(1)+' ↗',url)});
}
activateContactDetails();
// RUTAS DE LAS FOTOGRAFÍAS QUE YA VINCULAMOS.
// La carpeta img debe estar junto a index.html (NO dentro de css ni de js).
 // Se respeta la extensión .JPG en mayúsculas, tal como están los archivos originales.
const imagePath=(folder,n)=>`img/${folder}/IMG_${n}.JPG`;
const groupImages={
  infantil: [4012,4013,4014,4015].map(n=>imagePath('infantil',n)),
  musica: [4016].map(n=>imagePath('musica',n)),
  escultura: [4017,4018].map(n=>imagePath('escultura',n)),
  clasico: [4019,4020].map(n=>imagePath('clasico',n)),
  muralismo: [4021,4022,4023,4024,4025,4026,4027,4028].map(n=>imagePath('muralismo',n)),
  ocasional: [] // Por ahora no hay fotografías en img/ocasional.
};
// Cada tarjeta muestra una imagen real y abre la galería de su colección.
// Las fotos de cada carpeta NO se etiquetan falsamente como bocetos o etapas:
// Paolo podrá definir más adelante el orden real de su proceso creativo por obra.
const art=[];
function addCollection(folder,category,title,credit){
  const photos=groupImages[folder];
  photos.forEach((photo,i)=>art.push({
    title:photos.length===1?title:`${title} · ${String(i+1).padStart(2,'0')}`,
    category,by:credit,image:photo,images:photos,position:'center',selected:i
  }));
}
addCollection('infantil','infantil','Ilustración infantil','Archivo fotográfico · Infantil');
addCollection('musica','cover','Cover Art / Música','Archivo fotográfico · Música');
addCollection('clasico','figurativo','Arte figurativo clásico','Archivo fotográfico · Clásico');
addCollection('muralismo','ocasional','Muralismo','Archivo fotográfico · Muralismo (en ilustración ocasional)');
addCollection('escultura','escultura','Escultura','Archivo fotográfico · Escultura');

// Si una ruta local falta, se muestra un aviso sin sustituirla por otra obra.
function markMissingImage(img){
  img.onerror=()=>{img.onerror=null;img.style.opacity='.16';img.title=`No se encontró: ${img.getAttribute('src')}`;
    const parent=img.parentElement;
    if(parent&&!parent.querySelector('.image-missing')){
      const note=document.createElement('span');note.className='image-missing';
      note.textContent='Imagen no encontrada · revisa la carpeta img';parent.appendChild(note);
    }
  };
}
const heroArt=document.getElementById('heroArt'),slideNum=document.getElementById('slideNum');let heroIndex=0;const heroWorks=[art.find(w=>w.category==='cover'),art.find(w=>w.category==='figurativo'),art.find(w=>w.category==='escultura')].filter(Boolean);heroWorks.forEach((w,i)=>{const d=document.createElement('div');d.className='slide'+(i===0?' active':'');d.style.backgroundImage=`url("${w.image}")`;d.style.backgroundPosition=w.position;d.setAttribute('aria-hidden','true');heroArt.appendChild(d)});function setHero(i){heroIndex=(i+heroWorks.length)%heroWorks.length;[...heroArt.children].forEach((e,j)=>e.classList.toggle('active',heroIndex===j));slideNum.textContent=`0${heroIndex+1} / 0${heroWorks.length}`;}document.getElementById('prev').onclick=()=>setHero(heroIndex-1);document.getElementById('next').onclick=()=>setHero(heroIndex+1);if(!matchMedia('(prefers-reduced-motion: reduce)').matches){setInterval(()=>setHero(heroIndex+1),7500)}
const gallery=document.getElementById('gallery');art.forEach((w,i)=>{const card=document.createElement('article');card.className='work reveal';card.dataset.category=w.category;card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label',`Ampliar ${w.title}`);card.innerHTML=`<div class="work-image"><img src="${w.image}" alt="${w.title}, imagen de referencia" loading="lazy" style="object-position:${w.position||'center'}"></div><div class="work-title"><span>${w.title}</span><span>0${i+1}</span></div><div class="work-type">${w.by}</div>`;card.addEventListener('click',()=>openLight(i));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLight(i)}});gallery.appendChild(card);markMissingImage(card.querySelector('img'))});document.querySelectorAll('.filter').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('.filter').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn))});document.querySelectorAll('.work').forEach(card=>{card.hidden=!(btn.dataset.filter==='all'||card.dataset.category===btn.dataset.filter)})});
const modal=document.getElementById('lightbox'),lightImg=document.getElementById('lightImg');
let activeWork=0,activeStage=0,previousFocus=null;
const thumbs=document.getElementById('processThumbs');
function setProcessStage(index){
 const w=art[activeWork],photos=w.images||[w.image];
 activeStage=(index+photos.length)%photos.length;
 const photo=photos[activeStage];
 lightImg.src=photo;lightImg.className='';lightImg.alt=`${w.title} · fotografía ${activeStage+1} de ${photos.length}`;
 lightImg.style.opacity='1';markMissingImage(lightImg);
 document.getElementById('processLabel').textContent=`Fotografía ${activeStage+1} / ${photos.length}`;
 document.getElementById('processDescription').textContent='Fotografía del archivo de esta colección. Paolo podrá añadir el orden y la descripción de las etapas de creación.';
 document.getElementById('processCounter').textContent=`${activeStage+1} / ${photos.length}`;
 [...thumbs.children].forEach((b,i)=>{b.classList.toggle('selected',i===activeStage);b.setAttribute('aria-pressed',String(i===activeStage))});
}
function openLight(i){
 activeWork=i;previousFocus=document.activeElement;const w=art[i],photos=w.images||[w.image];
 document.getElementById('lightTitle').textContent=w.title;
 document.getElementById('lightDesc').textContent=w.by;
 thumbs.replaceChildren();
 photos.forEach((photo,j)=>{
   const b=document.createElement('button');b.type='button';b.className='process-thumb';
   b.setAttribute('aria-label',`Ver fotografía ${j+1} de ${photos.length}`);
   const im=document.createElement('img');im.src=photo;im.alt='';im.loading='lazy';markMissingImage(im);
   const txt=document.createElement('span');txt.textContent=`${String(j+1).padStart(2,'0')} · Vista`;
   b.append(im,txt);b.onclick=()=>setProcessStage(j);thumbs.appendChild(b);
 });
 setProcessStage(w.selected||0);modal.classList.add('open');document.body.classList.add('lock');document.getElementById('closeLightbox').focus();
}
function closeLight(){if(!modal.classList.contains('open'))return;modal.classList.remove('open');document.body.classList.remove('lock');if(previousFocus)previousFocus.focus()}
document.getElementById('processPrev').onclick=()=>setProcessStage(activeStage-1);
document.getElementById('processNext').onclick=()=>setProcessStage(activeStage+1);
document.getElementById('closeLightbox').onclick=closeLight;
modal.addEventListener('click',e=>{if(e.target===modal)closeLight()});
modal.addEventListener('keydown',e=>{if(e.key==='Tab'){const interactive=[...modal.querySelectorAll('button,a[href]')].filter(el=>el.getClientRects().length);const first=interactive[0],last=interactive[interactive.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
document.addEventListener('keydown',e=>{if(!modal.classList.contains('open'))return;if(e.key==='Escape')closeLight();if(e.key==='ArrowLeft')setProcessStage(activeStage-1);if(e.key==='ArrowRight')setProcessStage(activeStage+1)});
document.getElementById('lightContact').onclick=()=>{document.getElementById('kind').value='Ilustración por encargo';const msg=document.getElementById('message');msg.value=`Me interesa solicitar una obra inspirada en «${art[activeWork].title}».\n\n`;closeLight()};
document.querySelectorAll('[data-request]').forEach(a=>a.onclick=()=>{let type=a.dataset.request;document.getElementById('kind').value=type==='Consulta por obra original'?'Adquirir una obra':type});
const menu=document.querySelector('.menu'),nav=document.querySelector('.nav');menu.onclick=()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))};nav.querySelectorAll('a').forEach(a=>a.onclick=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')});
document.getElementById('contactForm').onsubmit=e=>{e.preventDefault();const name=document.getElementById('name').value.trim(),email=document.getElementById('email').value.trim(),kind=document.getElementById('kind').value,message=document.getElementById('message').value.trim();const subject=`Consulta para Paolo — ${kind}`;const body=`Nombre: ${name}\nCorreo: ${email}\nInterés: ${kind}\n\nMensaje:\n${message}`;document.getElementById('formStatus').textContent='Prototipo: falta configurar el email de Paolo. Se ha preparado el mensaje para copiar.';const text=`Asunto: ${subject}\n\n${body}`;if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(()=>document.getElementById('formStatus').textContent='Consulta copiada al portapapeles. Falta configurar el correo real de Paolo.').catch(()=>fallback(text))}else fallback(text)};function fallback(t){window.prompt('Copia esta consulta para enviarla a Paolo cuando configuremos su contacto:',t)};
document.getElementById('year').textContent=new Date().getFullYear();const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
