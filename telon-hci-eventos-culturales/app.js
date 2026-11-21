/* Telón · prototipo funcional. Sin dependencias externas. */
(function () {
  'use strict';

  /* ---------- Datos de ejemplo ---------- */
  var CATS = {
    musica: 'Conciertos', teatro: 'Teatro', expo: 'Exposiciones',
    cine: 'Cine', danza: 'Danza', letras: 'Literatura'
  };
  var DISTRITOS = ['Arganzuela', 'Centro', 'Chamberí', 'Lavapiés', 'Retiro'];
  // Oferta de prototipo: viaje en Metro con billete QR, válido en toda la red, por persona
  var METRO = 1.5;
  function eur(x) { return (Math.round(x * 100) % 100 === 0 ? String(Math.round(x)) : x.toFixed(2).replace('.', ',')) + ' €'; }

  // d = días a partir de hoy, para que el prototipo siempre muestre eventos futuros
  var EVENTOS = [
    { id: 1, img: 'img/e1.jpg', t: 'Noches de jazz en la azotea', cat: 'musica', d: 0, h: '20:30', lugar: 'Sala Aurora', distrito: 'Lavapiés', km: 1.2, precio: 14, acc: true,
      desc: 'Un cuarteto local repasa los grandes estándares del jazz en una terraza con vistas a los tejados del barrio. Aforo reducido y sonido acústico.' },
    { id: 2, img: 'img/e2.jpg', t: 'La casa de Bernarda Alba', cat: 'teatro', d: 1, h: '19:00', lugar: 'Teatro del Arenal', distrito: 'Centro', km: 0.8, precio: 22, acc: true,
      desc: 'Nueva puesta en escena del clásico de Federico García Lorca, con una escenografía mínima que deja todo el peso en las intérpretes. Duración: 1 h 40 min sin descanso.' },
    { id: 3, img: 'img/e3.jpg', t: 'Luz y territorio: fotografía contemporánea', cat: 'expo', d: 0, h: '10:00', lugar: 'Centro de Arte La Ribera', distrito: 'Arganzuela', km: 2.4, precio: 0, acc: true,
      desc: 'Catorce fotógrafas y fotógrafos retratan la transformación del paisaje en la península. Visitas guiadas gratuitas los sábados a las 12:00.' },
    { id: 4, img: 'img/e4.jpg', t: 'Cine mudo con piano en directo', cat: 'cine', d: 2, h: '21:00', lugar: 'Cine Estudio Norte', distrito: 'Chamberí', km: 3.1, precio: 7, acc: false,
      desc: 'Proyección de tres cortometrajes de los años veinte acompañados por un pianista que improvisa la banda sonora en la sala.' },
    { id: 5, img: 'img/e5.jpg', t: 'Flamenco joven: nuevas voces', cat: 'danza', d: 5, h: '20:00', lugar: 'Tablao El Candil', distrito: 'Lavapiés', km: 1.5, precio: 18, acc: false,
      desc: 'Bailaoras y cantaores menores de treinta años presentan sus propuestas en un formato íntimo de cuarenta localidades.' },
    { id: 6, img: 'img/e6.jpg', t: 'Club de lectura: novela gráfica', cat: 'letras', d: 3, h: '18:30', lugar: 'Biblioteca del Retiro', distrito: 'Retiro', km: 2.0, precio: 0, acc: true,
      desc: 'Sesión abierta para comentar una novela gráfica elegida por los asistentes. No hace falta haber venido antes; la biblioteca presta ejemplares.' },
    { id: 7, img: 'img/e7.jpg', t: 'Vivaldi a la luz de las velas', cat: 'musica', d: 6, h: '20:00', lugar: 'Iglesia de San Telmo', distrito: 'Centro', km: 0.5, precio: 25, acc: true,
      desc: 'Una orquesta de cámara interpreta Las cuatro estaciones en una nave iluminada únicamente con velas. Asientos sin numerar.' },
    { id: 8, img: 'img/e8.jpg', t: 'Microteatro: cinco obras en una noche', cat: 'teatro', d: 6, h: '21:30', lugar: 'Espacio Trastienda', distrito: 'Chamberí', km: 3.4, precio: 12, acc: false,
      desc: 'Cinco piezas de quince minutos para quince espectadores cada una. La entrada da acceso a todas las salas en el orden que prefieras.' },
    { id: 9, img: 'img/e9.jpg', t: 'Cerámica viva: taller y exposición', cat: 'expo', d: 8, h: '11:00', lugar: 'Mercado de Artesanos', distrito: 'Arganzuela', km: 2.8, precio: 5, acc: true,
      desc: 'Muestra de ceramistas de la región con demostraciones de torno durante toda la mañana. El taller práctico incluye los materiales.' },
    { id: 10, img: 'img/e10.jpg', t: 'Poesía en el parque', cat: 'letras', d: 7, h: '12:00', lugar: 'Templete del Retiro', distrito: 'Retiro', km: 1.9, precio: 0, acc: true,
      desc: 'Recital al aire libre con micrófono abierto en la segunda parte. Trae tu propio poema o ven solo a escuchar.' },
    { id: 11, img: 'img/e11.jpg', t: 'Cuerpos en tránsito', cat: 'danza', d: 12, h: '20:30', lugar: 'Teatro del Arenal', distrito: 'Centro', km: 0.8, precio: 16, acc: true,
      desc: 'Pieza de danza contemporánea para seis intérpretes sobre el movimiento en la ciudad. Coloquio con la compañía al terminar.' },
    { id: 12, img: 'img/e12.jpg', t: 'Indie al aire libre: bandas locales', cat: 'musica', d: 13, h: '17:00', lugar: 'Explanada del Río', distrito: 'Arganzuela', km: 4.6, precio: 0, acc: true,
      desc: 'Seis bandas emergentes de la ciudad en un escenario junto al río. Zona de césped, puestos de comida y espacio infantil.' }
  ];

  /* ---------- Estado ---------- */
  var HOY = new Date(); HOY.setHours(0, 0, 0, 0);
  var filtrosVacios = function () {
    return { q: '', cats: [], fecha: 'todas', desde: '', hasta: '', distrito: '', dist: 0, gratis: false, acc: false };
  };
  var estado = { f: filtrosVacios(), guardados: [], reservas: [] };

  function cargar() {
    try {
      var g = localStorage.getItem('telon.guardados');
      var r = localStorage.getItem('telon.reservas');
      // Primera visita: datos de ejemplo para que «Mi lista» no aparezca vacía en el prototipo
      estado.guardados = g ? JSON.parse(g) : [2, 3, 7];
      estado.reservas = r ? JSON.parse(r) : [{ id: 2, n: 2, metro: true }];
    } catch (e) {
      estado.guardados = [2, 3, 7];
      estado.reservas = [{ id: 2, n: 2, metro: true }];
    }
  }
  function persistir() {
    try {
      localStorage.setItem('telon.guardados', JSON.stringify(estado.guardados));
      localStorage.setItem('telon.reservas', JSON.stringify(estado.reservas));
    } catch (e) { /* almacenamiento no disponible: el estado vive solo en memoria */ }
  }

  /* ---------- Utilidades ---------- */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function fechaDe(e) { var d = new Date(HOY); d.setDate(d.getDate() + e.d); return d; }
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function fechaTexto(e, largo) {
    var d = fechaDe(e);
    var rel = e.d === 0 ? 'Hoy' : e.d === 1 ? 'Mañana' : null;
    var txt = d.toLocaleDateString('es-ES', largo ? { weekday: 'long', day: 'numeric', month: 'long' } : { weekday: 'short', day: 'numeric', month: 'short' });
    txt = txt.charAt(0).toUpperCase() + txt.slice(1);
    return (rel ? rel + ', ' + txt.toLowerCase() : txt);
  }
  function diaNum(e) { return fechaDe(e).getDate(); }
  function mesCorto(e) { return fechaDe(e).toLocaleDateString('es-ES', { month: 'short' }).replace('.', ''); }
  function diaCorto(e) {
    if (e.d === 0) return 'Hoy'; if (e.d === 1) return 'Mañana';
    var t = fechaDe(e).toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  function km(e) { return String(e.km).replace('.', ','); }
  function motivo(cat) { return '<span class="motivo" aria-hidden="true">' + icono(cat, 160) + '</span>'; }
  function precioTexto(p) { return p === 0 ? 'Gratis' : p + ' €'; }
  function evento(id) { for (var i = 0; i < EVENTOS.length; i++) if (EVENTOS[i].id === id) return EVENTOS[i]; return null; }
  function reservaDe(id) { for (var i = 0; i < estado.reservas.length; i++) if (estado.reservas[i].id === id) return estado.reservas[i]; return null; }
  function estaGuardado(id) { return estado.guardados.indexOf(id) !== -1; }
  function plural(n, uno, varios) { return n + ' ' + (n === 1 ? uno : varios); }

  var ICONOS = {
    musica: '<path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="6" cy="18" r="3" fill="currentColor"/><circle cx="17" cy="16" r="3" fill="currentColor"/>',
    teatro: '<path d="M4 4h16v7a8 8 0 0 1-16 0z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 9h2M14 9h2M9 14c2 1.5 4 1.5 6 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
    expo: '<rect x="3" y="4" width="18" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 15l5-5 4 4 3-3 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 21h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    cine: '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 9l5 3-5 3z" fill="currentColor"/>',
    danza: '<circle cx="13" cy="4" r="2" fill="currentColor"/><path d="M5 9l8-1 6-4M13 8l-1 6 5 6M12 14l-6 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    letras: '<path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 6v13" stroke="currentColor" stroke-width="2"/>',
    fecha: '<rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    lugar: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="9.500" r="2.500" fill="currentColor"/>',
    precio: '<path d="M3 9a2 2 0 0 0 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a2 2 0 0 1 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 6v12" stroke="currentColor" stroke-width="2" stroke-dasharray="2 2"/>',
    acc: '<circle cx="12" cy="4" r="2" fill="currentColor"/><path d="M5 8l7 1 7-1M12 9v5l-3 7M12 14l3 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    guardar: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    ok: '<path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" stroke-width="2.500" stroke-linecap="round" stroke-linejoin="round"/>',
    filtros: '<path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    metro: '<rect x="5" y="3" width="14" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 11h14M9 21l2-4M15 21l-2-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="14" r="1.2" fill="currentColor"/><circle cx="15" cy="14" r="1.2" fill="currentColor"/>',
    qr: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'
  };
  function icono(n, tam) { tam = tam || 20; return '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="' + tam + '" height="' + tam + '">' + ICONOS[n] + '</svg>'; }

  /* ---------- Filtrado ---------- */
  function finDeSemana() {
    var dia = HOY.getDay(), ini = new Date(HOY), fin = new Date(HOY);
    if (dia === 0) { /* domingo: solo hoy */ }
    else { ini.setDate(HOY.getDate() + (6 - dia)); fin = new Date(ini); fin.setDate(ini.getDate() + 1); }
    return [iso(ini), iso(fin)];
  }
  function coincide(e) {
    var f = estado.f, dia = iso(fechaDe(e));
    if (f.q && norm(e.t + ' ' + e.lugar + ' ' + e.distrito + ' ' + CATS[e.cat]).indexOf(norm(f.q.trim())) === -1) return false;
    if (f.cats.length && f.cats.indexOf(e.cat) === -1) return false;
    if (f.fecha === 'hoy' && e.d !== 0) return false;
    if (f.fecha === 'finde') { var fs = finDeSemana(); if (dia < fs[0] || dia > fs[1]) return false; }
    if (f.fecha === 'semana' && e.d > 6) return false;
    if (f.fecha === 'rango') { if (f.desde && dia < f.desde) return false; if (f.hasta && dia > f.hasta) return false; }
    if (f.distrito && e.distrito !== f.distrito) return false;
    if (f.dist && e.km > f.dist) return false;
    if (f.gratis && e.precio > 0) return false;
    if (f.acc && !e.acc) return false;
    return true;
  }
  function resultados() { return EVENTOS.filter(coincide).sort(function (a, b) { return a.d - b.d || a.h.localeCompare(b.h); }); }
  function numFiltros() {
    var f = estado.f;
    return f.cats.length + (f.fecha !== 'todas' ? 1 : 0) + (f.distrito ? 1 : 0) + (f.dist ? 1 : 0) + (f.gratis ? 1 : 0) + (f.acc ? 1 : 0) + (f.q.trim() ? 1 : 0);
  }

  /* ---------- Componentes ---------- */
  function botonGuardarIcono(e) {
    var on = estaGuardado(e.id);
    return '<button type="button" class="guardar-icono" data-accion="guardar" data-id="' + e.id + '" aria-pressed="' + on + '" aria-label="Guardar «' + esc(e.t) + '» en mi lista">' + icono('guardar', 22) + '</button>';
  }
  function tarjeta(e) {
    return '<li><article class="tarjeta cat-' + e.cat + '">' +
      '<div class="foto"><img src="' + e.img + '" alt="" loading="lazy" onerror="this.parentNode.remove()"></div>' + motivo(e.cat) +
      '<p class="cat">' + CATS[e.cat] + '</p>' +
      '<p class="fecha-g"><time datetime="' + iso(fechaDe(e)) + 'T' + e.h + '">' +
        '<span class="oculto-visual">' + fechaTexto(e) + ', ' + e.h + ' h</span>' +
        '<span class="dia" aria-hidden="true">' + diaNum(e) + '</span>' +
        '<span class="resto" aria-hidden="true">' + diaCorto(e) + ' · ' + mesCorto(e) + '<br>' + e.h + ' h</span></time></p>' +
      '<h3><a href="#/evento/' + e.id + '">' + esc(e.t) + '</a></h3>' +
      '<p class="pie-tarjeta"><span class="lugar">' + esc(e.lugar) + ' · a ' + km(e) + ' km</span><span class="precio">' + precioTexto(e.precio) + '</span></p>' +
      botonGuardarIcono(e) +
    '</article></li>';
  }

  function formularioFiltros(conTexto) {
    var f = estado.f, h = '<form class="filtros" id="filtros" novalidate>';
    if (conTexto) {
      h += '<div class="campo"><label for="f-q">Nombre del evento o lugar</label>' +
        '<input type="search" id="f-q" name="q" value="' + esc(f.q) + '" placeholder="Por ejemplo: jazz, teatro, Retiro" autocomplete="off"></div>';
    }
    h += '<fieldset><legend>¿Qué?</legend><div class="opciones">';
    Object.keys(CATS).forEach(function (k) {
      h += '<label class="opcion"><input type="checkbox" name="cat" value="' + k + '"' + (f.cats.indexOf(k) !== -1 ? ' checked' : '') + '>' + CATS[k] + '</label>';
    });
    h += '</div></fieldset>';

    h += '<fieldset><legend>¿Cuándo?</legend><div class="opciones">';
    [['todas', 'Cualquier fecha'], ['hoy', 'Hoy'], ['finde', 'Este fin de semana'], ['semana', 'Próximos 7 días'], ['rango', 'Elegir fechas']].forEach(function (o) {
      h += '<label class="opcion"><input type="radio" name="fecha" value="' + o[0] + '"' + (f.fecha === o[0] ? ' checked' : '') + '>' + o[1] + '</label>';
    });
    h += '</div><div class="rango" id="f-rango"' + (f.fecha === 'rango' ? '' : ' hidden') + '>' +
      '<div class="campo"><label for="f-desde">Desde</label><input type="date" id="f-desde" name="desde" value="' + f.desde + '"></div>' +
      '<div class="campo"><label for="f-hasta">Hasta</label><input type="date" id="f-hasta" name="hasta" value="' + f.hasta + '"></div></div></fieldset>';

    h += '<fieldset><legend>¿Dónde?</legend>' +
      '<div class="campo"><label for="f-distrito">Distrito</label><select id="f-distrito" name="distrito"><option value="">Todos los distritos</option>';
    DISTRITOS.forEach(function (d) { h += '<option' + (f.distrito === d ? ' selected' : '') + '>' + d + '</option>'; });
    h += '</select></div>' +
      '<div class="campo"><label for="f-dist">Distancia máxima</label><select id="f-dist" name="dist">';
    [[0, 'Cualquier distancia'], [1, 'Hasta 1 km'], [3, 'Hasta 3 km'], [5, 'Hasta 5 km']].forEach(function (o) {
      h += '<option value="' + o[0] + '"' + (f.dist === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
    });
    h += '</select></div></fieldset>';

    h += '<fieldset><legend>Y además</legend>' +
      '<label class="opcion"><input type="checkbox" name="gratis"' + (f.gratis ? ' checked' : '') + '>Solo eventos gratuitos</label>' +
      '<label class="opcion"><input type="checkbox" name="acc"' + (f.acc ? ' checked' : '') + '>Accesible en silla de ruedas</label></fieldset>';
    return h + '</form>';
  }

  /* ---------- Vistas ---------- */
  function vistaInicio() {
    var d = evento(7);
    var chips = Object.keys(CATS).map(function (k) {
      return '<button type="button" class="chip cat-' + k + '" data-accion="chip" data-cat="' + k + '" aria-pressed="' + (estado.f.cats.indexOf(k) !== -1) + '"><span class="tic" aria-hidden="true">✓</span>' + CATS[k] + '</button>';
    }).join('');
    return '<section class="hero">' +
        '<p class="donde">' + icono('lugar', 18) + 'Madrid centro</p>' +
        '<h1 tabindex="-1">Cultura cerca de ti</h1>' +
        '<p class="entradilla">Conciertos, teatro, exposiciones y mucho más a menos de 5 km. Encuentra tu plan, guárdalo y reserva tu entrada.</p>' +
        '<form class="buscador" role="search" id="buscador">' +
          '<label for="q">Buscar por nombre o lugar</label>' +
          '<div class="buscador-fila"><input type="search" id="q" name="q" value="' + esc(estado.f.q) + '" placeholder="Jazz, teatro, Retiro…" autocomplete="off">' +
          '<a class="btn sec enlace-filtros" href="#/filtros">' + icono('filtros') + 'Filtros<span id="n-filtros"></span></a></div>' +
        '</form>' +
        '<div class="chips" role="group" aria-label="Filtrar por categoría">' + chips + '</div>' +
      '</section>' +
      '<section class="destacado" aria-labelledby="h-dest"><h2 id="h-dest">Destacado de la semana</h2>' +
        '<article class="destacado-cartel con-foto cat-' + d.cat + '" style="background-image:linear-gradient(180deg, rgba(12,15,14,.10) 0%, rgba(12,15,14,.74) 100%), url(\'' + d.img + '\')">' + motivo(d.cat) +
          '<p class="cuando"><time datetime="' + iso(fechaDe(d)) + 'T' + d.h + '">' + fechaTexto(d, true) + ' · ' + d.h + ' h</time></p>' +
          '<h3><a href="#/evento/' + d.id + '">' + esc(d.t) + '</a></h3>' +
          '<p class="lugar">' + CATS[d.cat] + ' · ' + esc(d.lugar) + ' · <span class="precio">' + precioTexto(d.precio) + '</span></p>' +
          '<span class="ver" aria-hidden="true">Ver evento →</span>' +
        '</article></section>' +
      '<div class="disposicion">' +
        '<aside class="lateral" aria-labelledby="h-filtros"><h2 id="h-filtros">Filtros</h2>' + formularioFiltros(false) +
          '<p style="margin-top:.5rem"><button type="button" class="btn-txt" data-accion="borrar">Borrar filtros</button></p></aside>' +
        '<section aria-labelledby="h-res">' +
          '<div class="res-cab"><h2 id="h-res">Próximos eventos</h2><p id="cuenta" role="status"></p></div>' +
          '<div id="lista"></div>' +
        '</section>' +
      '</div>';
  }
  function pintarResultados() {
    var r = resultados(), n = numFiltros(), caja = $('#lista');
    if (!caja) return;
    $('#cuenta').textContent = plural(r.length, 'evento', 'eventos') + (n ? ' · ' + plural(n, 'filtro activo', 'filtros activos') : '');
    var nf = $('#n-filtros'); if (nf) nf.textContent = n ? ' (' + n + ')' : '';
    caja.innerHTML = r.length
      ? '<ul class="rejilla">' + r.map(tarjeta).join('') + '</ul>'
      : '<div class="vacio"><h3>No hay eventos con estos filtros</h3><p>Prueba a ampliar la distancia, cambiar la fecha o quitar alguna categoría.</p><button type="button" class="btn" data-accion="borrar">Borrar filtros</button></div>';
  }

  function vistaFiltros() {
    return '<div class="pagina-filtros">' +
      '<a class="volver" href="#/"><span aria-hidden="true">←</span> Volver al listado</a>' +
      '<h1 tabindex="-1">Buscar y filtrar</h1>' +
      '<p class="intro">Combina los filtros que necesites. El número de resultados se actualiza al momento.</p>' +
      formularioFiltros(true) +
      '<div class="filtros-pie">' +
        '<button type="button" class="btn-txt" data-accion="borrar">Borrar filtros</button>' +
        '<a class="btn" href="#/" id="ver-res"></a>' +
      '</div>' +
      '<p class="oculto-visual" role="status" id="cuenta-f"></p>' +
    '</div>';
  }
  function pintarCuentaFiltros() {
    var b = $('#ver-res'); if (!b) return;
    var n = resultados().length;
    b.textContent = n ? 'Ver ' + plural(n, 'evento', 'eventos') : 'Sin resultados';
    $('#cuenta-f').textContent = n ? plural(n, 'evento coincide', 'eventos coinciden') + ' con los filtros' : 'Ningún evento coincide con los filtros';
  }

  function bloqueAcciones(e) {
    var r = reservaDe(e.id), on = estaGuardado(e.id), verbo = e.precio === 0 ? 'Inscribirme' : 'Reservar entradas';
    var h = '';
    if (r) {
      h += '<p class="reservado">' + icono('ok', 22) + '<span>' + (e.precio === 0 ? 'Inscripción confirmada' : 'Reserva confirmada') + ': ' + plural(r.n, 'entrada', 'entradas') + (r.metro ? ' y ' + plural(r.n, 'viaje de Metro', 'viajes de Metro') : '') + '. <a href="#/lista">Ver en mi lista</a></span></p>';
      if (r.metro) h += '<button type="button" class="btn sec" data-accion="qr" data-id="' + e.id + '">' + icono('qr') + 'Ver billete QR de Metro</button>';
    } else {
      h += '<button type="button" class="btn" data-accion="reservar" data-id="' + e.id + '">' + verbo + '</button>';
    }
    h += '<button type="button" class="btn sec" data-accion="guardar" data-id="' + e.id + '" data-texto="1" aria-pressed="' + on + '">' + icono('guardar') + '<span>' + (on ? 'Guardado en mi lista' : 'Guardar en mi lista') + '</span></button>';
    return h;
  }
  function vistaDetalle(e) {
    return '<article class="detalle cat-' + e.cat + '">' +
      '<header class="detalle-cab con-foto" style="background-image:linear-gradient(180deg, rgba(12,15,14,.22) 0%, rgba(12,15,14,.82) 92%), url(\'' + e.img + '\')">' + motivo(e.cat) +
        '<a class="volver" href="#/"><span aria-hidden="true">←</span> Volver al listado</a>' +
        '<p class="cat">' + CATS[e.cat] + '</p>' +
        '<h1 tabindex="-1">' + esc(e.t) + '</h1>' +
        '<p class="cuando"><time datetime="' + iso(fechaDe(e)) + 'T' + e.h + '">' + fechaTexto(e, true) + ' · ' + e.h + ' h</time> · ' + esc(e.lugar) + '</p>' +
      '</header>' +
      '<div class="detalle-cuerpo"><div class="detalle-lado">' +
        '<div class="acciones" id="acciones">' + bloqueAcciones(e) + '</div>' +
        '<dl class="datos">' +
          '<div>' + icono('fecha', 24) + '<dt>Fecha y hora</dt><dd>' + fechaTexto(e, true) + '<small>' + e.h + ' h</small></dd></div>' +
          '<div>' + icono('lugar', 24) + '<dt>Lugar</dt><dd>' + esc(e.lugar) + '<small>' + e.distrito + ' · a ' + km(e) + ' km</small></dd></div>' +
          '<div>' + icono('precio', 24) + '<dt>Precio</dt><dd>' + (e.precio === 0 ? 'Gratis<small>Con inscripción previa</small>' : e.precio + ' €<small>Por entrada</small>') + '</dd></div>' +
          '<div>' + icono('metro', 24) + '<dt>Cómo llegar en Metro</dt><dd>Viaje en Metro por ' + eur(METRO) + '<small>Oferta por persona en toda la red, con billete QR. Se añade al reservar.</small></dd></div>' +
          '<div>' + icono('acc', 24) + '<dt>Accesibilidad</dt><dd>' + (e.acc ? 'Accesible en silla de ruedas<small>Entrada a nivel y aseo adaptado</small>' : 'Acceso con escaleras<small>Sin entrada adaptada</small>') + '</dd></div>' +
        '</dl>' +
      '</div>' +
      '<div class="descripcion"><h2>Sobre el evento</h2><p>' + esc(e.desc) + '</p>' +
        '<h2>Cómo llegar</h2><p>' + esc(e.lugar) + ' está en el distrito de ' + e.distrito + ', a ' + km(e) + ' km de tu ubicación (unos ' + Math.round(e.km * 13) + ' minutos a pie).</p></div>' +
      '</div></article>';
  }

  function vistaLista() {
    var g = estado.guardados.map(evento).filter(Boolean).sort(function (a, b) { return a.d - b.d; });
    var r = estado.reservas.filter(function (x) { return evento(x.id); });
    var h = '<h1 tabindex="-1">Mi lista</h1>' +
      '<div class="perfil"><span class="avatar" aria-hidden="true">N</span><p><strong>Nerea Ibarra</strong>' +
      plural(g.length, 'evento guardado', 'eventos guardados') + ' · ' + plural(r.length, 'reserva', 'reservas') + '</p></div>';

    h += '<section class="bloque-lista" aria-labelledby="h-res-l"><h2 id="h-res-l" tabindex="-1">Mis reservas</h2>';
    if (r.length) {
      h += '<ul class="filas">' + r.map(function (x) {
        var e = evento(x.id);
        return '<li class="fila cat-' + e.cat + '"><span class="mini" aria-hidden="true"><b>' + diaNum(e) + '</b>' + mesCorto(e) + '</span>' +
          '<div class="fila-txt"><h3><a href="#/evento/' + e.id + '">' + esc(e.t) + '</a></h3><p class="meta">' + fechaTexto(e) + ' · ' + e.h + ' · ' + esc(e.lugar) + '</p></div>' +
          '<div class="fila-acc"><span class="entradas">' + plural(x.n, 'entrada', 'entradas') + ((x.n * e.precio + (x.metro ? x.n * METRO : 0)) ? ' · ' + eur(x.n * e.precio + (x.metro ? x.n * METRO : 0)) : ' · Gratis') + '</span>' +
          (x.metro ? '<span class="metro-tag">' + icono('metro', 16) + plural(x.n, 'viaje', 'viajes') + ' de Metro</span><button type="button" class="btn-txt" data-accion="qr" data-id="' + e.id + '">Ver QR<span class="oculto-visual"> del billete de Metro de «' + esc(e.t) + '»</span></button>' : '') +
          '<button type="button" class="btn-txt peligro" data-accion="cancelar" data-id="' + e.id + '">Cancelar reserva<span class="oculto-visual"> de «' + esc(e.t) + '»</span></button></div></li>';
      }).join('') + '</ul>';
    } else {
      h += '<div class="vacio"><p>Todavía no tienes reservas. Cuando reserves entradas aparecerán aquí.</p></div>';
    }
    h += '</section>';

    h += '<section class="bloque-lista" aria-labelledby="h-gua"><h2 id="h-gua" tabindex="-1">Eventos guardados</h2>';
    if (g.length) {
      h += '<ul class="filas">' + g.map(function (e) {
        return '<li class="fila cat-' + e.cat + '"><span class="mini" aria-hidden="true"><b>' + diaNum(e) + '</b>' + mesCorto(e) + '</span>' +
          '<div class="fila-txt"><h3><a href="#/evento/' + e.id + '">' + esc(e.t) + '</a></h3><p class="meta">' + fechaTexto(e) + ' · ' + e.h + ' · ' + esc(e.lugar) + '</p></div>' +
          '<div class="fila-acc"><span class="precio' + (e.precio === 0 ? ' gratis' : '') + '">' + precioTexto(e.precio) + '</span>' +
          '<button type="button" class="btn-txt" data-accion="quitar" data-id="' + e.id + '">Quitar de la lista<span class="oculto-visual">: «' + esc(e.t) + '»</span></button></div></li>';
      }).join('') + '</ul>';
    } else {
      h += '<div class="vacio"><p>Aún no has guardado ningún evento. Pulsa el marcador de cualquier evento para tenerlo a mano.</p><a class="btn" href="#/">Explorar eventos</a></div>';
    }
    return h + '</section>';
  }

  /* ---------- Enrutado ---------- */
  var principal = $('#contenido'), primeraCarga = true;
  function ruta() {
    var p = (location.hash || '#/').replace(/^#/, '').split('/').filter(Boolean);
    var vista = 'inicio', titulo = 'Eventos culturales cerca de ti', e = null;
    if (p[0] === 'filtros') { vista = 'filtros'; titulo = 'Buscar y filtrar'; }
    else if (p[0] === 'lista') { vista = 'lista'; titulo = 'Mi lista'; }
    else if (p[0] === 'evento' && (e = evento(Number(p[1])))) { vista = 'detalle'; titulo = e.t; }

    principal.innerHTML = vista === 'filtros' ? vistaFiltros() : vista === 'lista' ? vistaLista() : vista === 'detalle' ? vistaDetalle(e) : vistaInicio();
    if (vista === 'inicio') pintarResultados();
    if (vista === 'filtros') pintarCuentaFiltros();

    document.title = titulo + ' · Telón';
    $$('.nav a').forEach(function (a) {
      var activo = a.getAttribute('data-nav') === (vista === 'detalle' ? 'inicio' : vista);
      if (activo && vista !== 'detalle') a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (!primeraCarga) {
      window.scrollTo(0, 0);
      var h1 = $('h1', principal); if (h1) h1.focus({ preventScroll: true });
    }
    primeraCarga = false;
    if (vista === 'detalle' && p[2] === 'reservar' && !reservaDe(e.id)) abrirReserva(e);
  }

  /* ---------- Avisos ---------- */
  var aviso = $('#aviso'), temporizador;
  function avisar(texto) {
    aviso.textContent = texto; aviso.classList.add('visible');
    clearTimeout(temporizador);
    temporizador = setTimeout(function () { aviso.classList.remove('visible'); }, 4000);
  }

  /* ---------- Acciones ---------- */
  function alternarGuardado(id) {
    var e = evento(id), i = estado.guardados.indexOf(id);
    if (i === -1) { estado.guardados.push(id); avisar('Guardado en tu lista: ' + e.t); }
    else { estado.guardados.splice(i, 1); avisar('Quitado de tu lista: ' + e.t); }
    persistir();
    $$('[data-accion="guardar"][data-id="' + id + '"]').forEach(function (b) {
      var on = estaGuardado(id);
      b.setAttribute('aria-pressed', on);
      if (b.hasAttribute('data-texto')) $('span', b).textContent = on ? 'Guardado en mi lista' : 'Guardar en mi lista';
    });
  }
  function leerFormulario(form) {
    var f = estado.f, d = new FormData(form);
    if (form.elements.q) f.q = form.elements.q.value;
    f.cats = d.getAll('cat');
    f.fecha = d.get('fecha') || 'todas';
    f.desde = d.get('desde') || ''; f.hasta = d.get('hasta') || '';
    f.distrito = d.get('distrito') || '';
    f.dist = Number(d.get('dist')) || 0;
    f.gratis = d.has('gratis'); f.acc = d.has('acc');
    var rango = $('#f-rango'); if (rango) rango.hidden = f.fecha !== 'rango';
  }
  function sincronizarControles() {
    $$('.chip').forEach(function (c) { c.setAttribute('aria-pressed', estado.f.cats.indexOf(c.getAttribute('data-cat')) !== -1); });
    $$('#filtros input[name="cat"]').forEach(function (c) { c.checked = estado.f.cats.indexOf(c.value) !== -1; });
  }

  var dlg = $('#dlg');
  function abrirReserva(e) {
    var gratis = e.precio === 0;
    dlg.innerHTML = '<form method="dialog" id="f-reserva">' +
      '<h2 id="dlg-t">' + (gratis ? 'Inscripción' : 'Reservar entradas') + '</h2>' +
      '<p class="sub">' + esc(e.t) + '<br>' + fechaTexto(e, true) + ' · ' + e.h + ' h</p>' +
      '<label for="n-entradas">Número de entradas (máximo 6)</label>' +
      '<div class="contador" style="margin-top:.375rem">' +
        '<button type="button" data-paso="-1" aria-label="Quitar una entrada">−</button>' +
        '<input type="number" id="n-entradas" min="1" max="6" value="2" inputmode="numeric">' +
        '<button type="button" data-paso="1" aria-label="Añadir una entrada">+</button></div>' +
      '<div class="metro-oferta"><label class="opcion" for="metro"><input type="checkbox" id="metro" name="metro">' +
        '<span><b>Añadir viaje en Metro de Madrid</b><small>Billete con código QR, válido en toda la red. Oferta: ' + eur(METRO) + ' por persona.</small></span></label></div>' +
      '<p class="desglose" id="desglose"></p>' +
      '<p class="total"><span>Total</span><strong id="total" aria-live="polite"></strong></p>' +
      '<div class="dlg-acc"><button type="submit" class="btn" value="ok">Confirmar ' + (gratis ? 'inscripción' : 'reserva') + '</button>' +
      '<button type="submit" class="btn sec" value="cancelar" formnovalidate>Cancelar</button></div></form>';
    var campo = $('#n-entradas', dlg), total = $('#total', dlg);
    function n() { return Math.min(6, Math.max(1, parseInt(campo.value, 10) || 1)); }
    var metro = $('#metro', dlg), desglose = $('#desglose', dlg);
    function pintar() {
      var ent = gratis ? 0 : n() * e.precio, mt = metro.checked ? n() * METRO : 0;
      total.textContent = (ent + mt) === 0 ? 'Gratis' : eur(ent + mt);
      desglose.textContent = metro.checked
        ? (gratis ? 'Inscripción gratuita' : plural(n(), 'entrada', 'entradas') + ': ' + eur(ent)) + ' + ' + plural(n(), 'viaje de Metro', 'viajes de Metro') + ': ' + eur(mt)
        : '';
    }
    metro.onchange = pintar;
    dlg.onclick = function (ev) {
      var b = ev.target.closest('[data-paso]');
      if (b) { campo.value = Math.min(6, Math.max(1, n() + Number(b.getAttribute('data-paso')))); pintar(); }
    };
    campo.oninput = pintar;
    dlg.onclose = function () {
      if (dlg.returnValue !== 'ok') return;
      var cant = n();
      var conMetro = metro.checked;
      estado.reservas.push({ id: e.id, n: cant, metro: conMetro }); persistir();
      avisar((gratis ? 'Inscripción confirmada: ' : 'Reserva confirmada: ') + plural(cant, 'entrada', 'entradas') + (conMetro ? ' y viaje de Metro con QR' : '') + ' para ' + e.t);
      var caja = $('#acciones');
      if (caja) { caja.innerHTML = bloqueAcciones(e); var enlace = $('a', caja); if (enlace) enlace.focus(); }
    };
    pintar();
    dlg.returnValue = '';
    dlg.showModal();
  }

  // Billete de Metro con código QR (código de ejemplo: no es válido en el Metro real)
  function abrirQR(id) {
    var e = evento(id), r = reservaDe(id); if (!e || !r || !r.metro) return;
    var codigo = 'MT-' + String((id * 7919 + r.n * 104729) % 100000).padStart(5, '0');
    var svg = '';
    try {
      var qr = qrcode(0, 'M');
      qr.addData('TELON|PROTOTIPO|METRO|' + codigo + '|' + r.n + 'P');
      qr.make();
      svg = qr.createSvgTag({ cellSize: 6, margin: 0, scalable: true });
    } catch (err) { svg = ''; }
    dlg.innerHTML = '<form method="dialog">' +
      '<h2 id="dlg-t">Billete de Metro</h2>' +
      '<p class="sub">' + plural(r.n, 'viaje', 'viajes') + ' en toda la red de Metro de Madrid<br>Para ir a: ' + esc(e.t) + ' · ' + fechaTexto(e) + ', ' + e.h + ' h</p>' +
      '<div class="qr-caja" role="img" aria-label="Código QR del billete de Metro para ' + plural(r.n, 'persona', 'personas') + '. Código de respaldo: ' + codigo + '">' + (svg || '<p>No se pudo generar el código QR.</p>') + '</div>' +
      '<p class="codigo">' + codigo + '</p>' +
      '<p class="sub">Acerca este código al lector de los tornos. Sube el brillo de la pantalla si no se lee.</p>' +
      '<p class="aviso-proto">Prototipo: código de ejemplo, no válido en el Metro real.</p>' +
      '<div class="dlg-acc"><button type="submit" class="btn">Cerrar</button></div></form>';
    dlg.onclick = null; dlg.onclose = null;
    dlg.returnValue = '';
    dlg.showModal();
  }

  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-accion]'); if (!b) return;
    var accion = b.getAttribute('data-accion'), id = Number(b.getAttribute('data-id'));
    if (accion === 'guardar') alternarGuardado(id);
    else if (accion === 'chip') {
      var c = b.getAttribute('data-cat'), i = estado.f.cats.indexOf(c);
      if (i === -1) estado.f.cats.push(c); else estado.f.cats.splice(i, 1);
      sincronizarControles(); pintarResultados();
    }
    else if (accion === 'borrar') {
      estado.f = filtrosVacios(); ruta();
      avisar('Filtros borrados');
      var h1 = $('h1', principal); if (h1) h1.focus({ preventScroll: true });
    }
    else if (accion === 'reservar') abrirReserva(evento(id));
    else if (accion === 'qr') abrirQR(id);
    else if (accion === 'quitar' || accion === 'cancelar') {
      var e = evento(id);
      if (accion === 'quitar') { estado.guardados = estado.guardados.filter(function (x) { return x !== id; }); avisar('Quitado de tu lista: ' + e.t); }
      else { estado.reservas = estado.reservas.filter(function (x) { return x.id !== id; }); avisar('Reserva cancelada: ' + e.t); }
      persistir();
      principal.innerHTML = vistaLista();
      // El botón pulsado ya no existe: el foco pasa al título de su sección
      $(accion === 'quitar' ? '#h-gua' : '#h-res-l').focus();
    }
  });
  principal.addEventListener('input', function (ev) {
    var form = ev.target.closest('#filtros');
    if (form) { leerFormulario(form); sincronizarControles(); pintarResultados(); pintarCuentaFiltros(); }
    else if (ev.target.id === 'q') { estado.f.q = ev.target.value; pintarResultados(); }
  });
  principal.addEventListener('submit', function (ev) {
    if (ev.target.id === 'buscador' || ev.target.id === 'filtros') {
      ev.preventDefault();
      if (ev.target.id === 'filtros') location.hash = '#/';
      else { var h = $('#h-res'); if (h) h.scrollIntoView(); }
    }
  });

  cargar();
  window.addEventListener('hashchange', ruta);
  ruta();
})();
