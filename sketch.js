// Variables del juego
let anchoCanvas = 800;
let altoCanvas = 400;
let grosorMarco = 10; // Grosor de los marcos superior e inferior

// Variables de la pelota
let xPelota = anchoCanvas / 2;
let yPelota = altoCanvas / 2;
let velocidadXPelota = 5;
let velocidadYPelota = 3;
let diametroPelota = 20;

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

// Configuración inicial
function setup() {
    createCanvas(anchoCanvas, altoCanvas);
    yRaquetaJugador = altoCanvas / 2 - altoRaqueta / 2;
    yRaquetaComputadora = altoCanvas / 2 - altoRaqueta / 2;
}

// Dibujar en pantalla
function draw() {
    background(0); // Fondo negro

    // Dibujar marcos superior e inferior
    fill(255);
    rect(0, 0, anchoCanvas, grosorMarco); // Marco superior
    rect(0, altoCanvas - grosorMarco, anchoCanvas, grosorMarco); // Marco inferior

    mostrarPelota();
    moverPelota();
    verificarColisionesMarcos();

    mostrarRaqueta(xRaquetaJugador, yRaquetaJugador);
    moverRaquetaJugador();
    verificarColisionRaquetaJugador();

    mostrarRaqueta(xRaquetaComputadora, yRaquetaComputadora);
    moverRaquetaComputadora();
    verificarColisionRaquetaComputadora();

    mostrarPuntaje();
    verificarPuntaje();
}

// Función para mostrar la pelota
function mostrarPelota() {
    ellipse(xPelota, yPelota, diametroPelota, diametroPelota);
}

// Función para mover la pelota y aumentar la velocidad ligeramente tras cada rebote
function moverPelota() {
    xPelota += velocidadXPelota;
    yPelota += velocidadYPelota;

    if (velocidadXPelota < 15) { // Limitar la velocidad máxima
        velocidadXPelota *= 1.01;
        velocidadYPelota *= 1.01;
    }
}

// Verificar colisiones de la pelota con los marcos superior e inferior
function verificarColisionesMarcos() {
    if (yPelota - diametroPelota / 2 <= grosorMarco || 
        yPelota + diametroPelota / 2 >= altoCanvas - grosorMarco) {
        velocidadYPelota *= -1; // Invertir dirección vertical
    }
}

// Mostrar raquetas en pantalla
function mostrarRaqueta(x, y) {
    rect(x, y, anchoRaqueta, altoRaqueta);
}

// Mover la raqueta del jugador con el ratón
function moverRaquetaJugador() {
    yRaquetaJugador = constrain(mouseY - altoRaqueta / 2, grosorMarco, altoCanvas - altoRaqueta - grosorMarco);
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

// Mover la raqueta de la computadora
function moverRaquetaComputadora() {
    if (yPelota > yRaquetaComputadora + altoRaqueta / 2) {
        yRaquetaComputadora += velocidadComputadora;
    } else {
        yRaquetaComputadora -= velocidadComputadora;
    }
    yRaquetaComputadora = constrain(yRaquetaComputadora, grosorMarco, altoCanvas - altoRaqueta - grosorMarco);
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
