# EDIT — Prototipo de mascota y casa interactiva

## Cómo abrirlo

1. Abrí la carpeta **EDIT** en Visual Studio Code.
2. Iniciá **Live Server** en `index.html` (no abras el HTML directamente mediante `file://`).
3. Entrá a **Crear personaje**. Podés elegir rasgos, remeras, falda/short, conjuntos y calzado.
4. Los cambios se guardan automáticamente en el almacenamiento local del navegador; el botón **Guardar personaje** permite confirmarlo de forma visible. **Descargar imagen PNG** es una acción diferente.
5. Entrá en **Jugar**, presioná **JUGAR** y explorá la casa con **A/D** o las flechas. En celulares, usá los controles táctiles.
6. Los cuatro botones inferiores abren actividades de cursor; también se puede hacer clic sobre objetos cuando Mishi está cerca. La puerta del living lleva al mapa.

No se requieren npm ni instalaciones externas. `lib/p5.js` está incluido. Nunito se obtiene de Google Fonts cuando hay conexión y dispone de alternativas locales.

## Ilustraciones

Los PNG originales de Iris permanecen intactos en `img/partes/` y `img/ropa/`. `img/miniaturas/` contiene recortes de **vista previa**, generados a partir de los PNG originales; no se utilizaron para reemplazar las capas del personaje. Las imágenes de referencia de vestuario están en `referencias/ejemplos-outfits/`.

Las capas del rostro y el pelo comparten las mismas coordenadas y transformaciones: no reciben animaciones independientes ni escala variable durante la caminata. Se conservaron sus posiciones específicas en `POSICIONES`, sin retocar los seis encastres de las pelucas. La composición lógica original mide 844 × 1227; el creador agrega margen transparente exterior para evitar recortes durante el saludo.

## Organización

- `js/assets.js`: catálogo de piezas, ropa, colores y carga de imágenes.
- `js/mascota.js`: estado persistente, dibujo de capas y articulaciones.
- `js/personalizacion.js`: categorías, guardado y selección de vestuario.
- `js/casa.js`: escenario, movimiento, cámara, navegación y HUD de actividades.
- `js/actividades.js`: minijuegos de arrastrar, recorrer o tocar elementos; sin barras ni premios automáticos.
- `js/mapa.js`: mapa existente.
- `css/styles.css`: interfaz y adaptación a escritorio/celular.

La vista del escenario se ajusta al ancho y alto disponibles **sin deformar el juego**. JUGAR ya no solicita pantalla completa.

## Actividades

- **Dormir:** mantener presionado y seguir cinco estrellas en orden.
- **Bañar:** arrastrar el cursor para limpiar ocho burbujas.
- **Comer:** llevar tres manzanas a un objetivo.
- **Jugar:** hacer clic en cinco destellos animados.

Las acciones deben completarse; no modifican barras de energía, hambre, higiene o diversión (el HUD anterior fue retirado).

## Alcance y próximas ilustraciones

La caminata usa las piezas articuladas entregadas: brazos y piernas en contrafase, suavizado de inicio y frenada, y balanceo leve del torso sin rebote global. La dirección se refleja horizontalmente y la cabeza se mantiene rígida junto al pelo. **No hay ilustraciones laterales reales entre los archivos recibidos**, de modo que esta etapa crea una caminata de títere 2.5D, no un perfil lateral dibujado de cero. Para obtener una vista lateral idéntica a un juego con sprites de frente/perfil, hará falta ilustrar las poses laterales de Mishi.

## Comprobaciones

Se validó sintaxis de todos los archivos JavaScript y se ejecutaron pruebas con Chromium en escritorio y viewport móvil: creación de personaje, combinación de vestuario y calzado, guardado, ingreso al juego sin pantalla completa, caminata y finalización de las cuatro actividades. Durante esas comprobaciones no se registraron errores de JavaScript. Se recomienda probar de nuevo en el navegador de destino con Live Server antes de entregar el trabajo.
