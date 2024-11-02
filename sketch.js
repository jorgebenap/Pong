// Variables del juego
let anchoCanvas = 800;
let altoCanvas = 400;
let grosorMarco = 10; // Grosor de los marcos superior e inferior
let fondo, barraJugador, barraComputadora, bola; // Variables para almacenar las imágenes

// Variables de la pelota
let xPelota = anchoCanvas / 2;
let yPelota = altoCanvas / 2;
let velocidadXPelota = 2;
let velocidadYPelota = 2;
let diametroPelota = 20;
let anguloPelota = 0; // Variable para almacenar el ángulo de rotación de la pelota

// Variables de las raquetas
let anchoRaqueta = 10;
let altoRaqueta = 90;
let xRaquetaJugador = 20;
let yRaquetaJugador;
let xRaquetaComputadora = anchoCanvas - 30;
let yRaquetaComputadora;
let velocidadComputadora = 4;

// Puntajes
let puntajeJugador = 0;
let puntajeComputadora = 0;

// Pre-cargar las imágenes
function preload() {
  fondo = loadImage("/Sprites/fondo1.png");
  barraJugador = loadImage("/Sprites/barra1.png");
  barraComputadora = loadImage("/Sprites/barra2.png");
  bola = loadImage("/Sprites/bola.png");
}

// Configuración inicial
function setup() {
  createCanvas(anchoCanvas, altoCanvas);
  yRaquetaJugador = altoCanvas / 2 - altoRaqueta / 2;
  yRaquetaComputadora = altoCanvas / 2 - altoRaqueta / 2;
}

// Dibujar en pantalla
function draw() {
  image(fondo, 0, 0, anchoCanvas, altoCanvas); // Mostrar la imagen de fondo

  // Dibujar marcos superior e inferior
  fill(color("#DE7C7D"));
  rect(0, 0, anchoCanvas, grosorMarco); // Marco superior
  rect(0, altoCanvas - grosorMarco, anchoCanvas, grosorMarco); // Marco inferior

  mostrarPelota();
  moverPelota();
  verificarColisionesMarcos();

  mostrarRaquetaJugador();
  moverRaquetaJugador();
  verificarColisionRaquetaJugador();

  mostrarRaquetaComputadora();
  moverRaquetaComputadora();
  verificarColisionRaquetaComputadora();

  mostrarPuntaje();
  verificarPuntaje();
}

// Función para mostrar la pelota con efecto de giro
function mostrarPelota() {
  push(); // Guardar el estado de transformación actual
  translate(xPelota, yPelota); // Mover al centro de la pelota
  rotate(anguloPelota); // Aplicar la rotación
  imageMode(CENTER); // Centrar la imagen en la posición de la pelota
  image(bola, 0, 0, diametroPelota, diametroPelota); // Dibujar la pelota con giro
  pop(); // Restaurar el estado de transformación

  // Incrementar el ángulo de rotación en función de la velocidad de la pelota
  anguloPelota += (abs(velocidadXPelota) + abs(velocidadYPelota)) * 0.05;
}

// Función para mover la pelota y aumentar la velocidad ligeramente tras cada rebote
function moverPelota() {
  xPelota += velocidadXPelota;
  yPelota += velocidadYPelota;

  if (velocidadXPelota < 100) {
    // Limitar la velocidad máxima
    velocidadXPelota *= 1.001;
    velocidadYPelota *= 1.001;
  }
}

// Verificar colisiones de la pelota con los marcos superior e inferior
function verificarColisionesMarcos() {
  if (
    yPelota - diametroPelota / 2 <= grosorMarco ||
    yPelota + diametroPelota / 2 >= altoCanvas - grosorMarco
  ) {
    velocidadYPelota *= -1; // Invertir dirección vertical
  }
}

// Mostrar raqueta del jugador con imagen
function mostrarRaquetaJugador() {
  image(
    barraJugador,
    xRaquetaJugador,
    yRaquetaJugador,
    anchoRaqueta,
    altoRaqueta
  );
}

// Mover la raqueta del jugador con el ratón
function moverRaquetaJugador() {
  yRaquetaJugador = constrain(
    mouseY - altoRaqueta / 2,
    grosorMarco,
    altoCanvas - altoRaqueta - grosorMarco
  );
}

// Verificar colisión entre la pelota y la raqueta del jugador
function verificarColisionRaquetaJugador() {
  if (
    xPelota - diametroPelota / 2 < xRaquetaJugador + anchoRaqueta &&
    yPelota > yRaquetaJugador &&
    yPelota < yRaquetaJugador + altoRaqueta
  ) {
    velocidadXPelota *= -1;

    // Modificar la velocidad Y de la pelota según dónde golpee la raqueta
    let diff = yPelota - (yRaquetaJugador + altoRaqueta / 2);
    velocidadYPelota = diff * 0.1;
  }
}

// Mostrar raqueta de la computadora con imagen
function mostrarRaquetaComputadora() {
  image(
    barraComputadora,
    xRaquetaComputadora,
    yRaquetaComputadora,
    anchoRaqueta,
    altoRaqueta
  );
}

// Mover la raqueta de la computadora
function moverRaquetaComputadora() {
  if (yPelota > yRaquetaComputadora + altoRaqueta / 2) {
    yRaquetaComputadora += velocidadComputadora;
  } else {
    yRaquetaComputadora -= velocidadComputadora;
  }
  yRaquetaComputadora = constrain(
    yRaquetaComputadora,
    grosorMarco,
    altoCanvas - altoRaqueta - grosorMarco
  );
}

// Verificar colisión entre la pelota y la raqueta de la computadora
function verificarColisionRaquetaComputadora() {
  if (
    xPelota + diametroPelota / 2 > xRaquetaComputadora &&
    yPelota > yRaquetaComputadora &&
    yPelota < yRaquetaComputadora + altoRaqueta
  ) {
    velocidadXPelota *= -1;
  }
}

// Mostrar puntaje en pantalla
function mostrarPuntaje() {
  fill(255);
  textSize(24);
  textAlign(CENTER, TOP);
  text(puntajeJugador, anchoCanvas / 4, 20);
  text(puntajeComputadora, (3 * anchoCanvas) / 4, 20);
}

// Verificar y actualizar el puntaje cuando la pelota sale del campo
function verificarPuntaje() {
  if (xPelota < 0) {
    puntajeComputadora++;
    resetPelota();
  } else if (xPelota > anchoCanvas) {
    puntajeJugador++;
    resetPelota();

    // Incrementar dificultad en cada 5 puntos
    if (puntajeJugador % 5 === 0) {
      velocidadComputadora += 0.5;
      altoRaqueta = max(altoRaqueta - 5, 40); // Limitar tamaño mínimo
    }
  }
}

// Reiniciar la pelota al centro
function resetPelota() {
  xPelota = anchoCanvas / 2;
  yPelota = altoCanvas / 2;
  velocidadXPelota *= -1; // Cambiar dirección
  // Aumentar ligeramente la velocidad después de cada gol
  if (velocidadXPelota < 1) {
    // Limitar la velocidad máxima
    velocidadXPelota *= 1.001;
    velocidadYPelota *= 1.001;
  }
}

// Configurar la dificultad según el modo de juego
function configurarModo(dificultad) {
  switch (dificultad) {
    case "facil":
      velocidadXPelota = 4;
      velocidadYPelota = 3;
      velocidadComputadora = 2;
      break;
    case "medio":
      velocidadXPelota = 6;
      velocidadYPelota = 5;
      velocidadComputadora = 4;
      break;
    case "dificil":
      velocidadXPelota = 8;
      velocidadYPelota = 6;
      velocidadComputadora = 6;
      break;
  }
}
