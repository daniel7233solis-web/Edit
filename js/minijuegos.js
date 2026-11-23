/* EDIT · Juegos breves de campus. Cada edificio ofrece una actividad real.
 * Todos los minijuegos mantienen al usuario en el mismo recorrido.
 * La trivia original se conserva en trivia.html. */
let minijuegoActual = null;

function abrirMinijuegoActual() {
    const id = modalEdificioId;
    const ficha = document.getElementById('dialogoEdificio');
    if (ficha.open) ficha.close();
    if(id === 'historico') {
        window.location.href='trivia.html?desde=universidad';
        return;
    }
    const info=EDIFICIOS_UNM.find(e=>e.id===id);
    if(!info) return;
    const dlg=document.getElementById('dialogoJuego');
    document.getElementById('tituloJuego').textContent=info.juego;
    minijuegoActual={id,pasos:0,terminado:false,bloqueado:false,seleccion:[]};
    if (!dlg.open) dlg.showModal();
    if(id==='dorrego') iniciarParejas();
    else if(id==='daract1') iniciarFormas();
    else if(id==='daract2') iniciarEstrellas();
    else if(id==='laboratorios') iniciarMezclas();
}
function tableroJuego() {return document.getElementById('tableroJuego');}
function mensajeJuego(t) {document.getElementById('mensajeJuego').textContent=t;}
function progresoJuego(actual,total) {
    document.getElementById('progresoJuego').textContent=actual+' / '+total;
}
function botonJuego(label,accion,clase='') {
    const b=document.createElement('button');b.type='button';b.className='pieza-mini '+clase;
    b.textContent=label;b.addEventListener('click',accion);return b;
}
function finalizarJuego() {
    minijuegoActual.terminado=true;
    tableroJuego().replaceChildren();
    const final=document.createElement('div');final.className='mini-exito';
    final.textContent='✦ ¡Lo lograste! ✦';
    tableroJuego().append(final);
    mensajeJuego('¡Terminaste el desafío! Podés volver al mapa o jugar otra vez.');
    const boton=document.createElement('button');boton.type='button';
    boton.className='boton-vamos-jugar';boton.textContent='↻ Volver a jugar';
    boton.addEventListener('click',()=>{
        const id=minijuegoActual.id;
        minijuegoActual={id,pasos:0,terminado:false,bloqueado:false,seleccion:[]};
        if(id==='dorrego') iniciarParejas();
        else if(id==='daract1') iniciarFormas();
        else if(id==='daract2') iniciarEstrellas();
        else if(id==='laboratorios') iniciarMezclas();
    });
    tableroJuego().append(boton);
}

function iniciarParejas() {
    const estado=minijuegoActual;
    estado.cartas=['🌷','🌷','⭐','⭐','🍀','🍀','🎨','🎨'].sort(()=>Math.random()-.5);
    estado.vistas=[];estado.acertadas=new Set();
    const board=tableroJuego();board.className='mini-tablero mini-memoria';board.replaceChildren();
    mensajeJuego('Encontrá las cuatro parejas iguales.');progresoJuego(0,4);
    estado.cartas.forEach((simbolo,i)=>{
        const b=botonJuego('?',()=>{
            if(minijuegoActual!==estado||estado.bloqueado||estado.acertadas.has(i)||estado.vistas.includes(i))return;
            b.textContent=simbolo;b.classList.add('abierta');estado.vistas.push(i);
            if(estado.vistas.length===2){
                const [a,z]=estado.vistas;
                if(estado.cartas[a]===estado.cartas[z]){
                    estado.acertadas.add(a);estado.acertadas.add(z);
                    estado.vistas=[];
                    progresoJuego(estado.acertadas.size/2,4);
                    if(estado.acertadas.size===8)finalizarJuego();
                }else{
                    estado.bloqueado=true;
                    window.setTimeout(()=>{
                        if(minijuegoActual!==estado)return;
                        const buttons=Array.from(board.children);
                        buttons[a].textContent='?';buttons[z].textContent='?';
                        buttons[a].classList.remove('abierta');buttons[z].classList.remove('abierta');
                        estado.vistas=[];estado.bloqueado=false;
                    },650);
                }
            }
        });board.appendChild(b);
    });
}
function iniciarFormas() {
    const estado=minijuegoActual, board=tableroJuego();
    board.className='mini-tablero mini-formas';board.replaceChildren();
    mensajeJuego('Tocá las figuras en este orden: ● → ▲ → ◆ → ★.');progresoJuego(0,4);
    const formas=['◆','★','●','▲'];
    for(const forma of formas){
        const b=botonJuego(forma,()=>{
            if(estado.terminado||b.disabled)return;
            const orden=['●','▲','◆','★'];
            if(forma!==orden[estado.pasos]){mensajeJuego('Probá con la siguiente figura del orden indicado.');return;}
            estado.pasos++;b.disabled=true;b.classList.add('acertada');
            mensajeJuego('¡Bien! Seguí con la siguiente figura.');progresoJuego(estado.pasos,4);
            if(estado.pasos===4)finalizarJuego();
        });board.appendChild(b);
    }
}
function iniciarEstrellas() {
    const estado=minijuegoActual, board=tableroJuego();
    board.className='mini-tablero mini-estrellas';board.replaceChildren();
    mensajeJuego('Encontrá las cinco estrellas en orden, del 1 al 5.');progresoJuego(0,5);
    [4,2,5,1,3].forEach(n=>{
        const b=botonJuego('★ '+n,()=>{
            if(estado.terminado||b.disabled)return;
            if(n!==estado.pasos+1){mensajeJuego('Buscá primero la estrella '+(estado.pasos+1)+'.');return;}
            estado.pasos++;b.disabled=true;b.classList.add('acertada');
            progresoJuego(estado.pasos,5);mensajeJuego('¡Estrella encontrada!');
            if(estado.pasos===5)finalizarJuego();
        });board.appendChild(b);
    });
}
function iniciarMezclas() {
    const estado=minijuegoActual, board=tableroJuego();
    board.className='mini-tablero mini-mezclas';board.replaceChildren();
    estado.pasos=0;progresoJuego(0,3);
    const rondas=[{color:'verde',par:['amarillo','azul'],muestra:'#77c88a'},
        {color:'violeta',par:['rojo','azul'],muestra:'#bba1ea'},
        {color:'naranja',par:['rojo','amarillo'],muestra:'#ffc16b'}];
    const tintes=[['rojo','#ef7185'],['azul','#73c2ea'],['amarillo','#ffe273']];
    function ronda(){
        board.replaceChildren();estado.seleccion=[];
        const r=rondas[estado.pasos];
        mensajeJuego('Elegí los dos colores que forman '+r.color+'.');
        const muestra=document.createElement('div');muestra.className='muestra-objetivo';
        muestra.style.background=r.muestra;muestra.textContent='¿Cómo logramos el '+r.color+'?';board.append(muestra);
        tintes.forEach(([nombre,tono])=>{
            const b=botonJuego(nombre,()=>{
                if(estado.seleccion.includes(nombre))return;
                estado.seleccion.push(nombre);b.classList.add('acertada');
                if(estado.seleccion.length===2){
                    if(r.par.every(c=>estado.seleccion.includes(c))){
                        estado.pasos++;progresoJuego(estado.pasos,3);
                        if(estado.pasos===3)finalizarJuego();else ronda();
                    }else{
                        mensajeJuego('Esa mezcla no produce '+r.color+'. ¡Probá otra vez!');
                        estado.seleccion=[];
                        board.querySelectorAll('.pieza-mini').forEach(e=>e.classList.remove('acertada'));
                    }
                }
            },'tinte-mini');
            b.style.background=tono;board.append(b);
        });
    }
    ronda();
}

document.getElementById('cerrarModalEdificio')?.addEventListener('click',()=>{
    const ficha = document.getElementById('dialogoEdificio');
    if (ficha.open) ficha.close();
});
document.getElementById('irMinijuego')?.addEventListener('click',abrirMinijuegoActual);
document.getElementById('cerrarDialogoJuego')?.addEventListener('click',()=>{
    minijuegoActual=null;document.getElementById('dialogoJuego').close();
});
