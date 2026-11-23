(() => {
  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)');

  function mostrarCorazones(evento) {
    if (reducir.matches || (evento.pointerType === 'mouse' && evento.button !== 0)) return;
    const colores = ['#FAA4B5', '#FFF183', '#70C1E1', '#F8B77C'];
    for (let i = 0; i < 5; i++) {
      const el = document.createElement('span');
      el.className = 'corazon-click';
      el.textContent = i === 2 ? '✦' : '♥';
      el.setAttribute('aria-hidden', 'true');
      el.style.left = evento.clientX + 'px';
      el.style.top = evento.clientY + 'px';
      el.style.color = colores[i % colores.length];
      el.style.setProperty('--mover-x', `${(i - 2) * 24 + Math.random() * 14}px`);
      el.style.setProperty('--mover-y', `${-72 - Math.random() * 48}px`);
      el.style.setProperty('--retraso', `${i * 25}ms`);
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove(), { once: true });
    }
  }

  document.addEventListener('pointerdown', mostrarCorazones);

  function destinoConMascota(enlace) {
    if (!enlace.hasAttribute('data-ruta-mascota')) return enlace.href;
    try {
      const guardado = JSON.parse(localStorage.getItem('edit_mascota') || 'null');
      const existe = guardado && typeof guardado === 'object' &&
        Number.isInteger(guardado.hair) && Number.isInteger(guardado.eyes);
      return new URL(existe ? 'escenario.html' : 'personaje.html', document.baseURI).href;
    } catch (_) {
      return new URL('personaje.html', document.baseURI).href;
    }
  }

  let navegando = false;
  document.querySelectorAll('.pagina-portada .portada-acciones .boton-caramelo, a[data-ruta-mascota]').forEach(enlace => {
    enlace.addEventListener('click', evento => {
      if (evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
      if (reducir.matches && !enlace.hasAttribute('data-ruta-mascota') && !enlace.matches('.boton-caramelo')) return;
      evento.preventDefault();
      if (navegando) return;
      navegando = true;
      const destino = destinoConMascota(enlace);
      if (enlace.closest('.portada-acciones')) {
        window.EDITAudio?.transicion();
        window.setTimeout(() => { location.href = destino; }, 650);
      } else {
        location.href = destino;
      }
    });
  });
})();
