# Web de Paolo — contexto de trabajo

Web de portafolio para un artista. HTML, CSS y JavaScript puro. Estilo oscuro, tipografía Helvetica.

## Categorías
- Ilustración infantil
- Cover Art
- Ilustración ocasional
- Arte figurativo clásico
- Escultura

## Funciones
Carrusel de portada, filtros de galería, ficha y minigalería por obra (boceto, composición, detalles, resultado final), biografía, encargos y contacto.

## Antes de publicar
Sustituir imágenes de referencia por fotografías autorizadas de las obras de Paolo. Completar correo, teléfono, ubicación y enlaces de redes reales. Verificar derechos/licencias de imágenes provisionales y configurar recepción efectiva de consultas.

## Desarrollo
El sitio usa rutas relativas: `index.html` enlaza `css/styles.css` y `js/script.js`. Abrir la carpeta completa en VS Code.

## Actualización V7 — Destacadas
- Filtro de inicio: Destacadas (no Todas).
- Selección de seis fotografías: una por cada una de las cinco categorías anteriores y una segunda imagen de Muralismo.
- Filtro Muralismo adicional; el material de muralismo sigue accesible también desde Ilustración ocasional.
- Título PAOLO uniforme, sin span en la L.
- Las rutas img/ permanecen locales: mantener carpeta de fotografías junto a index.html.


## V8
Animación artística en CSS + Anime.js con fallback Web Animations API. Mantener enlaces img/ y funcionalidades originales.


## V9 — Sala 3D
- Nueva sección Escultura: visor opcional Three.js con busto abstracto demo, rotación/zoom, mármol/bronce y botón de restablecer.
- Archivos nuevos: css/sculpture.css y js/sculpture.js.
- Fotos locales intactas; modelos reales se incorporan luego como GLB.


## V9 — Visor de escultura Sketchfab
- Se carga `3d/busto.glb` con GLTFLoader al seleccionar «Escultura».
- En Apple compatible, `3d/busto.usdz` ofrece vista AR Quick Look.
- La sección de Three.js está oculta fuera de Escultura.
- Falta incluir los dos modelos y completar la atribución según la licencia exacta.


## V9.3
Se usa Google model-viewer 4.4.0 con src=3d/busto.glb e ios-src=3d/busto.usdz. No cargar Three.js por separado. Sala visible bajo la galería y créditos Sketchfab pendientes.
