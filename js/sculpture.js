/* PAOLO V9.3 — Controles para el componente oficial Google <model-viewer>.
   Sin importaciones manuales de Three.js ni OrbitControls. */
(() => {
  const section = document.getElementById('sala-escultura');
  const model = document.getElementById('bustoPaolo');
  const viewport = document.getElementById('sculptureViewport');
  const status = document.getElementById('sculptureStatus');
  const spin = document.getElementById('sculptureSpin');
  const reset = document.getElementById('sculptureReset');
  if (!section || !model || !viewport) return;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let ready = false;
  function tell(message) { if (status) status.textContent = message; }
  function pauseRotate() { model.removeAttribute('auto-rotate'); spin?.setAttribute('aria-pressed', 'false'); if (spin) spin.innerHTML = 'Activar rotación <span aria-hidden="true">↻</span>'; }
  function startRotate() { if (reduceMotion.matches) return; model.setAttribute('auto-rotate',''); spin?.setAttribute('aria-pressed','true'); if (spin) spin.innerHTML = 'Pausar rotación <span aria-hidden="true">Ⅱ</span>'; }
  if (reduceMotion.matches) pauseRotate(); else startRotate();
  model.addEventListener('load', () => { ready = true; viewport.classList.remove('is-error'); viewport.classList.add('is-ready'); tell('Busto cargado correctamente. Arrastra para girarlo.'); });
  model.addEventListener('error', e => { ready = false; viewport.classList.add('is-error'); viewport.classList.remove('is-ready'); tell('Error al cargar busto.glb. Comprueba la consola, el formato del modelo y la conexión WebGL.'); console.error('[PAOLO model-viewer] Error de carga del modelo', e); });
  spin?.addEventListener('click', () => { if (!ready) {tell('El modelo todavía no está listo.');return;} model.hasAttribute('auto-rotate') ? pauseRotate() : startRotate(); });
  reset?.addEventListener('click', () => {
    if (!ready) {tell('Espera a que el modelo termine de cargar.');return;}
    model.cameraOrbit = 'auto auto auto'; model.cameraTarget = 'auto auto auto'; model.fieldOfView = 'auto';
    if (typeof model.jumpCameraToGoal === 'function') model.jumpCameraToGoal();
  });
  const scrollToRoom = () => section.scrollIntoView({behavior:reduceMotion.matches?'auto':'smooth',block:'start'});
  document.getElementById('navEscultura')?.addEventListener('click',event => {event.preventDefault();scrollToRoom();});
  document.addEventListener('paolo:filter-change', event => { if (event.detail?.category === 'escultura') scrollToRoom(); });
  customElements.whenDefined('model-viewer').catch(()=>{});
  window.setTimeout(() => { if (!customElements.get('model-viewer')) { viewport.classList.add('is-error'); tell('No se cargó Google model-viewer. Revisa la conexión a Internet o el bloqueo del CDN.'); } }, 9000);
})();
