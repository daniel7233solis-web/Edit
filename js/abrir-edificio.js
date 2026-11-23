document.getElementById('cerrarModalEdificio')?.addEventListener('click', () => {
    const dialogo = document.getElementById('dialogoEdificio');
    if (dialogo.open) dialogo.close();
});

document.getElementById('irMinijuego')?.addEventListener('click', () => {
    console.log({modalEdificioId})
    const id = modalEdificioId;
    console.log('Minijuego enviado:', id);
    if (!id) return;
    const destino = 'minijuego.html?juego=' + encodeURIComponent(id);
    window.location.href = destino;
});

document.getElementById('dialogoEdificio')?.addEventListener('close', () => {
    modalEdificioId = null;
});