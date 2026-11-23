(() => {
  const tracks = {
    inicio: 'audio/musica de inicio.mp3',
    casa: 'audio/musica de casa.mp3',
    minijuego: 'audio/musica de mini juego.mp3'
  };
  const effects = {
    click: 'audio/click.mp3',
    entrar: 'audio/click para crear jugar e inicio.mp3',
    transicion: 'audio/transicion de escena.mp3',
    correcto: 'audio/respuesta correcta minijuego.mp3',
    error: 'audio/error mini juego.mp3',
    mascota: 'audio/risita mascota.mp3',
    bano: 'audio/sonido baño.mp3',
    comida: 'audio/sonido comida.mp3'
  };

  if (document.body.classList.contains('pagina-app')) {
    const reproductor = new Audio();
    reproductor.loop = true;
    reproductor.preload = 'auto';
    reproductor.volume = .22;
    let activa = true;
    let pistaActual = '';
    let enTelevisor = false;
    let escenaActual = 'inicio';
    let volumenTemporal = false;
    const sonidos = new Set();

    try {
      activa = localStorage.getItem('edit_musica') !== 'no';
    } catch (_) {}

    function botonContenido() {
      const frame = document.getElementById('editContenido');
      try { frame?.contentWindow?.EDITAudio?.actualizarBoton?.(); } catch (_) {}
    }

    function reproducir() {
      if (!activa || enTelevisor) return;
      if (pistaActual !== escenaActual) {
        pistaActual = escenaActual;
        reproductor.src = encodeURI(tracks[escenaActual]);
      }
      reproductor.play().catch(() => {});
      botonContenido();
    }

    function cambiarMusica() {
      if (activa && reproductor.paused && !enTelevisor) {
        reproducir();
        return;
      }
      activa = !activa;
      try { localStorage.setItem('edit_musica', activa ? 'si' : 'no'); } catch (_) {}
      if (!activa) reproductor.pause();
      else reproducir();
      botonContenido();
    }

    function efecto(nombre, volumen = .22) {
      if (!effects[nombre]) return;
      const sonido = new Audio(encodeURI(effects[nombre]));
      sonido.volume = volumen;
      sonidos.add(sonido);
      const terminar = () => sonidos.delete(sonido);
      sonido.addEventListener('ended', terminar, { once: true });
      sonido.addEventListener('error', terminar, { once: true });
      sonido.play().catch(terminar);
      return sonido;
    }

    function registrarPagina(pagina, busqueda = '') {
      const escenario = pagina === 'escenario.html';
      escenaActual = escenario
        ? new URLSearchParams(busqueda).get('ir') === 'universidad' ? 'minijuego' : 'casa'
        : pagina === 'minijuego.html' || pagina === 'trivia.html' ? 'minijuego' : 'inicio';
      reproducir();
    }

    function actualizarEscena(escena) {
      if (!tracks[escena]) return;
      escenaActual = escena;
      reproducir();
    }

    function televisorConSonido(conSonido) {
      enTelevisor = Boolean(conSonido);
      if (enTelevisor) reproductor.pause();
      else reproducir();
      botonContenido();
    }

    function transicion() {
      efecto('transicion', .45);
      if (!volumenTemporal) {
        volumenTemporal = true;
        reproductor.volume = .08;
        window.setTimeout(() => {
          reproductor.volume = .22;
          volumenTemporal = false;
        }, 2900);
      }
    }

    window.EDITAudio = {
      efecto,
      cambiarMusica,
      musicaActiva: () => activa,
      musicaSonando: () => !reproductor.paused || enTelevisor,
      reproducir,
      actualizarEscena,
      televisorConSonido,
      registrarPagina,
      transicion
    };
    registrarPagina('index.html');
    return;
  }

  const nav = document.querySelector('.encabezado .navegacion');
  if (!nav) return;
  const controlador = window.parent !== window ? window.parent.EDITAudio : null;
  if (!controlador) return;
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'control-musica';
  nav.appendChild(boton);

  function actualizarBoton() {
    const activa = controlador.musicaActiva();
    boton.classList.toggle('musica-activa', activa);
    boton.setAttribute('aria-pressed', String(activa));
    const estado = activa
      ? controlador.musicaSonando() ? 'Desactivar música' : 'Reproducir música'
      : 'Activar música';
    boton.setAttribute('aria-label', estado);
    boton.title = estado;
    boton.textContent = activa ? '♫' : '♪';
  }

  function escenaActual() {
    if (location.pathname.endsWith('minijuego.html') || location.pathname.endsWith('trivia.html')) return 'minijuego';
    if (!location.pathname.endsWith('escenario.html')) return 'inicio';
    if (typeof lugarActual !== 'undefined' && lugarActual === 'mapa') return 'minijuego';
    if (new URLSearchParams(location.search).get('ir') === 'universidad') return 'minijuego';
    return 'casa';
  }

  window.EDITAudio = {
    efecto: controlador.efecto,
    musicaActiva: controlador.musicaActiva,
    actualizarBoton,
    actualizarEscena: () => controlador.actualizarEscena(escenaActual()),
    televisorConSonido: controlador.televisorConSonido,
    transicion: controlador.transicion
  };

  actualizarBoton();
  controlador.actualizarEscena(escenaActual());
  boton.addEventListener('click', () => controlador.cambiarMusica());
  document.addEventListener('pointerdown', () => controlador.reproducir(), { passive: true });
  document.addEventListener('keydown', () => controlador.reproducir());

  document.addEventListener('click', event => {
    const elemento = event.target.closest('a, button');
    if (!elemento || elemento === boton) return;
    if (elemento.closest('.portada-acciones') && elemento.matches('.boton-caramelo')) return;
    const principal = elemento.classList.contains('boton-vamos-jugar') ||
      elemento.id === 'guardarPersonaje' || elemento.matches('.navegacion a');
    if (elemento.id === 'narizPortada') controlador.efecto('mascota', .40);
    else if (elemento.id === 'sorpresa' || elemento.id === 'saludar') controlador.efecto('mascota', .20);
    else if (elemento.closest('#tableroJuego') && elemento.classList.contains('pieza-mini')) controlador.efecto('click', .15);
    else controlador.efecto(principal ? 'entrar' : 'click', principal ? .27 : .17);
  });

  if (location.pathname.endsWith('escenario.html')) {
    document.addEventListener('pointerup', event => {
      if (!event.target.closest('#escenario')) return;
      window.setTimeout(() => {
        const texto = typeof mensaje === 'string' ? mensaje : '';
        const fin = typeof mensajeHasta === 'number' ? mensajeHasta : 0;
        if (typeof millis !== 'function' || fin <= millis()) return;
        if (/manzana|comida|rica/i.test(texto)) controlador.efecto('comida', .23);
        else if (/baño|jabon|jabón|reluciente/i.test(texto)) controlador.efecto('bano', .22);
      }, 0);
    });
  }
})();
