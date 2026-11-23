/* Catálogo de sprites y accesorios de la mascota. */
const ARCHIVOS = {
  "head": [
    "head1.png"
  ],
  "torso": [
    "torso1.png"
  ],
  "armL": [
    "armL1.png"
  ],
  "armR": [
    "armR1.png"
  ],
  "legL": [
    "legL1.png"
  ],
  "legR": [
    "legR1.png"
  ],
  "hair": [
    "hair1.png",
    "hair2.png",
    "hair3.png",
    "hair4.png",
    "hair5.png",
    "hair6.png"
  ],
  "eyes": [
    "eyes1.png",
    "eyes2.png",
    "eyes3.png"
  ],
  "brows": [
    "brows1.png",
    "brows2.png",
    "brows3.png"
  ],
  "nose": [
    "nose1.png",
    "nose2.png",
    "nose3.png"
  ],
  "mouth": [
    "mouth1.png",
    "mouth2.png",
    "mouth3.png",
    "mouth4.png"
  ],
  "ears": [
    "ears1.png",
    "ears2.png",
    "ears3.png"
  ]
};

const COLORES_PIEL = ['#ffebd9', '#f6d4bc', '#e6b18e', '#c98969', '#96634e', '#f5d9e8', '#c5b6ed', '#a7d8cb'];
const COLORES_PELO = ['#ffffff', '#f7c7d9', '#d9b7f3', '#a9cbe9', '#b6dfd0', '#f4d49a', '#9b735f', '#4d425c', '#f3a7a3', '#b7b0ff'];
const COLORES_NARIZ = [
  '#e8b9b4',
  '#d99b91',
  '#b97570',
  '#8f5555',
  '#f3b6cc',
  '#c69ed8',
  '#91bfc8',
  '#6f626d'
];

const ROPA = {
    superiores: [
        {
            id: 'remeraPistacho',
            nombre: 'Remera pistacho',
            completa: 'remera pistacho completa.png',
            torso: 'remera pistacho torso.png',
            brazoL: 'remera pistacho brazo izquierdo.png',
            brazoR: 'remera pistacho brazo derecho.png'
        },
        {
            id: 'remeraBlanca',
            nombre: 'Remera blanca',
            completa: 'remera blanca completa.png',
            torso: 'remera blanca torso.png',
            brazoL: 'remera blanca brazo izquierdo.png',
            brazoR: 'remera blanca brazo derecho.png'
        },
        {
            id: 'blusa',
            nombre: 'Blusa',
            completa: 'blusa completa.png',
            torso: 'blusa torso.png',
            brazoL: 'blusa brazo izquierdo.png',
            brazoR: 'blusa brazo derecho.png'
        }
    ],

    inferiores: [
        {
            id: 'pantaloncito',
            nombre: 'Pantaloncito',
            completa: 'pantaloncito completo.png',
            centro: 'pantaloncito medio.png',
            piernaL: 'pantaloncito pierna izquierda.png',
            piernaR: 'pantaloncito pierna derecha.png'
        },
        {
            id: 'pollera',
            nombre: 'Pollera rosa',
            completa: 'pollera completa sujeta al torso.png',
            sujetaAlTorso: true
        }
    ],

    conjuntos: [
        {
            id: 'enterizo',
            nombre: 'Enterizo celeste',
            completa: 'enterizo completo.png',
            torso: 'enterizo torso.png',
            piernaL: 'enterizo pierna izquierda.png',
            piernaR: 'enterizo pierna derecha.png'
        },
        {
            id: 'vestido',
            nombre: 'Vestido amarillo',
            completa: 'vestido completo sujeto a torso.png',
            sujetaAlTorso: true
        }
    ],

    calzado: [
        {
            id: 'zapatillasRojas',
            nombre: 'Zapatillas rojas',
            completa: 'zapatillas rojas completas.png',
            piernaL: 'zapatillas rojas pierna izquierda.png',
            piernaR: 'zapatillas rojas pierna derecha.png'
        },
        {
            id: 'zapatosNegros',
            nombre: 'Zapatos negros',
            completa: 'zapatos negros completos.png',
            piernaL: 'zapatos negros pierna izquierda.png',
            piernaR: 'zapatos negros pierna derecha.png'
        }
    ]
};
const imagenesRopa = {};
function cargarImagenesRopa() {
    for (const categoria in ROPA) {
        for (const prenda of ROPA[categoria]) {
            imagenesRopa[prenda.id] = {};

            for (const parte in prenda) {
                const archivo = prenda[parte];

                if (typeof archivo === 'string' && archivo.endsWith('.png')) {
                    imagenesRopa[prenda.id][parte] = loadImage(
                        'img/ropa/' + archivo
                    );
                }
            }
        }
    }
}