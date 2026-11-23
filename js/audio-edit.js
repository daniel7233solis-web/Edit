/* EDIT · Música y efectos a partir de los MP3 provistos por Iris.
 * La música empieza por decisión del usuario y se puede apagar.
 * Los efectos cortos acompañan clics e interacciones sin cambiar p5.js. */
(() => {
  const nav = document.querySelector('.encabezado .navegacion');
  if (!nav) return;
  const tracks = {
    inicio: 'audio/musica de inicio.mp3',
    casa: 'audio/musica de casa.mp3',
    minijuego: 'audio/musica de mini juego.mp3'
  };
  const effects = {
    click: 'audio/click.mp3',
    entrar: 'audio/click para crear jugar e inicio.mp3',
    correcto: 'audio/respuesta correcta minijuego.mp3',
    error: 'audio/error mini juego.mp3',
    mascota: 'audio/risita mascota.mp3',
    bano: 'audio/sonido baño.mp3',
    comida: 'audio/sonido comida.mp3'
  };
  const audio = new Audio();
  audio.loop = true;
  audio.preload = 'none';
  audio.volume = .22;
  let activo = false;
  let actual = '';
  let boton;
  const esJuego = location.pathname.endsWith('/escenario.html');
  const esTrivia = location.pathname.endsWith('/trivia.html');
  const inicial = esJuego ? 'casa' : esTrivia ? 'minijuego' : 'inicio';
  let audioHabilitado = false;
  let teleConSonido = false;

  function efecto(nombre, volumen = .22) {
    const ruta = effects[nombre];
    if (!ruta) return;
    try {
      const a = new Audio(encodeURI(ruta));
      a.volume = volumen;
      a.play().catch(() => {});
      a.addEventListener('ended', () => { a.src = ''; }, { once: true });
    } catch (_) { /* Audio no permitido: los botones funcionan igual. */ }
  }
  function guardarPreferencia(v) {
    try { sessionStorage.setItem('edit_musica', v ? 'si' : 'no'); } catch (_) {}
  }
  function pistaNecesaria() {
    const dlg = document.getElementById('dialogoJuego');
    const ficha = document.getElementById('dialogoEdificio');
    if (esJuego && (dlg?.open || ficha?.open ||
        (typeof lugarActual !== 'undefined' && lugarActual === 'mapa'))) {
      return 'minijuego';
    }
    return inicial;
  }
  function elegirPista() {
    const pista = pistaNecesaria();
    if (actual === pista) return;
    actual = pista;
    audio.pause();
    audio.src = encodeURI(tracks[pista]);
    if (activo && !teleConSonido) audio.play().catch(() => actualizarBoton());
  }
  function actualizarBoton() {
    const suena = !audio.paused && !teleConSonido;
    boton.classList.toggle('musica-activa', suena);
    boton.setAttribute('aria-pressed', String(suena));
    boton.setAttribute('aria-label', suena ? 'Silenciar música' : 'Activar música');
    boton.title = suena ? 'Silenciar música' : 'Activar música';
    boton.textContent = suena ? '♫' : '♪';
  }
  async function cambiarMusica() {
    if (!activo) {
      activo = true;
      audioHabilitado = true;
      guardarPreferencia(true);
      if (!teleConSonido) {
        try { await audio.play(); } catch (_) { activo = false; guardarPreferencia(false); }
      }
    } else {
      activo = false;
      audio.pause();
      guardarPreferencia(false);
    }
    actualizarBoton();
  }
  boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'control-musica';
  boton.setAttribute('aria-label', 'Activar música');
  nav.appendChild(boton);
  elegirPista();
  actualizarBoton();
  boton.addEventListener('click', cambiarMusica);
  audio.addEventListener('play', actualizarBoton);
  audio.addEventListener('pause', actualizarBoton);

  try { activo = sessionStorage.getItem('edit_musica') === 'si'; } catch (_) {}
  if (activo) {
    // Puede bloquearse la reproducción automática después de navegar.
    // Si ocurre, se reintenta al siguiente gesto real del usuario.
    if (!teleConSonido) audio.play().catch(() => actualizarBoton());
    document.addEventListener('pointerdown', () => {
      if (activo && !teleConSonido && audio.paused) audio.play().catch(() => {});
    }, { passive: true });
  }
  if (esJuego) {
    const cuadros = ['dialogoJuego', 'dialogoEdificio'];
    const observer = new MutationObserver(() => { elegirPista(); });
    cuadros.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el, { attributes: true, attributeFilter: ['open'] });
    });
  }
  // API compartida entre trivia, juegos y televisor. No altera las rutas MP3.
  window.EDITAudio = {
    efecto,
    musicaActiva: () => activo,
    actualizarEscena: elegirPista,
    televisorConSonido(habilitado) {
      teleConSonido = Boolean(habilitado);
      if (teleConSonido) {
        audio.pause();
      } else if (activo) {
        elegirPista();
        audio.play().catch(() => {});
      }
      actualizarBoton();
    }
  };
  // Botones y enlaces: efectos puntuales, nunca sonidos repetidos por frame.
  document.addEventListener('click', event => {
    const elemento = event.target.closest('a, button');
    if (!elemento || elemento === boton) return;
    const principal = elemento.classList.contains('boton-caramelo') ||
      elemento.classList.contains('boton-vamos-jugar') ||
      elemento.id === 'guardarPersonaje' || elemento.matches('.navegacion a');
    if (elemento.id === 'narizPortada') efecto('mascota', .40);
    else if (elemento.id === 'sorpresa' || elemento.id === 'saludar') efecto('mascota', .2);
    else if (elemento.closest('#tableroJuego') && elemento.classList.contains('pieza-mini')) efecto('click', .15);
    else efecto(principal ? 'entrar' : 'click', principal ? .27 : .17);
  });
  // Eventos de la casa: detección no intrusiva del mensaje o las burbujas.
  if (esJuego) {
    document.addEventListener('pointerup', event => {
      if (!event.target.closest('#escenario')) return;
      // El movimiento p5 se completa durante mouseReleased.
      window.setTimeout(() => {
        const texto = typeof mensaje === 'string' ? mensaje : '';
        const t = typeof mensajeHasta === 'number' ? mensajeHasta : 0;
        if (typeof millis !== 'function' || t <= millis()) return;
        if (/manzana|comida|rica/i.test(texto)) efecto('comida', .23);
        else if (/baño|jabon|jabón|reluciente/i.test(texto)) efecto('bano', .22);
      }, 0);
    });
  }
  window.addEventListener('pagehide', () => audio.pause());
})();
