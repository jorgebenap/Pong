/* Variables del juego
let anchoCanvas = 800;
let altoCanvas = 400;
let grosorMarco = 10; // Grosor de los marcos superior e inferior
let fondo, barraJugador, barraComputadora, bola; // Variables para almacenar las imágenes
let sonidoColision; // Variable para el sonido de colisión
let sonidoGol; // Variable para el sonido de anotación

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
  sonidoColision = loadSound("/Sounds/pong.wav");
  sonidoGol = loadSound("/Sounds/gol.wav");
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

    //Reproducir el sonido de la colisión
    sonidoColision.play();
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

    //Reproducir el sonido de la colisión
    sonidoColision.play();
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
    sonidoGol.play(); //Reproduce el sonido de gol
    resetPelota();
  } else if (xPelota > anchoCanvas) {
    puntajeJugador++;
    sonidoGol.play(); //Reproduce el sonido de gol
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

/ Configurar la dificultad según el modo de juego
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
  */

let imagenPelota;
let imagenRaqueta;
let imagenComputadora;
let imagenFondo;
let sonidoRaqueta;
let sonidoGol;

let puntosJugador = 0;
let puntosComputadora = 0;


class Pelota {
    constructor(x, y, diameter, vx, vy) {
        this.x = x;
        this.y = y;
        this.diameter = diameter;
        //velocidad el sentido inicial de la pelota sea un valor aleatorio, utiliza la función math.random()
        this.vx = vx;
        this.vy = vy;
        this.reset();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        //aumente la roatación de la pelota con la velocidad en el eje x y la velocidad en el eje y
        this.rotation += this.vx + this.vy;

        if (this.x > width - this.diameter / 2 || this.x < this.diameter / 2) {
            sonidoGol.play();
            if (this.x < width / 2) {
                puntosComputadora++;
            } else {
                puntosJugador++;
            }
            narrarPuntos();    
            this.reset();
        }

        if (this.y > height - this.diameter / 2 || this.y < this.diameter / 2) {
            this.vy *= -1;
        }

        //si colisiona con la raqueta del jugador o la computadora, invierte el sentido y aumenta la velocidad en 10%
        if (colision(this.x, this.y, this.diameter, raqueta.x, raqueta.y, raqueta.width, raqueta.height) || colision(this.x, this.y, this.diameter, computadora.x, computadora.y, computadora.width, computadora.height)) {
            sonidoRaqueta.play();
            this.vx *= -1;
            this.vx *= 1.1;
            this.vy *= 1.1;
        }

    }        

    reset() {
        this.x = 400;
        this.y = 200;
        this.vx = 5 * (Math.random() < 0.5 ? -1 : 1);
        this.vy = 5 * (Math.random() < 0.5 ? -1 : 1);
        //rotación actual de la pelota
        this.rotation = 0;
    }

    draw() {
        //dibuja la pelota como una imagen en lugar de un círculo
        //rotaciona la pelota antes de dibujarla
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        image(imagenPelota, -this.diameter / 2, -this.diameter / 2, this.diameter, this.diameter);
        pop();
        //circle(this.x, this.y, this.diameter);
    }
}

class Raqueta {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    update() {
        //raqueta del jugador se mueva con el mouse
        //identifa si la raqueta es la del jugador, raqueta jugadod es la de la izquierda
        if (this.x < width / 2) {
            this.y = mouseY;
        } else {
            //raqueta de la computadora se mueva siguiendo la pelota
            if (pelota.y > this.y) {
                this.y += this.speed;
            } else {
                this.y -= this.speed;
            }
        }
        //limitar el movimiento de la raqueta, para que no se salga de la pantalla
        this.y = constrain(this.y, 0, height - this.height);
    }

    draw() {
        //si raqueta jugador dibuja la raqueta con la imagen de la raqueta del jugador
        if (this.x < width / 2) {
            image(imagenRaqueta, this.x, this.y, this.width, this.height);
        } else {
            //si raqueta computadora dibuja la raqueta con la imagen de la raqueta de la computadora
            image(imagenComputadora, this.x, this.y, this.width, this.height);
        }       
        //rect(this.x, this.y, this.width, this.height);
    }
}

let pelota;
let raqueta;
let computadora;

//verificar la colisión entre una circunferencia y un rectángulo
//circunferencia cx, cy, diametro
//rectángulo rx, ry, width, height
function colision(cx, cy, diameter, rx, ry, rw, rh) {
    //Si el circulo esta a la izquierda del rectángulo
    if (cx + diameter / 2 < rx) {
        return false;
    }
    //Si el circulo esta arriba del rectángulo
    if (cy + diameter / 2 < ry) {
        return false;
    }
    //Si el circulo esta a la derecha del rectángulo
    if (cx - diameter / 2 > rx + rw) {
        return false;
    }
    //Si el circulo esta abajo del rectángulo
    if (cy - diameter / 2 > ry + rh) {
        return false;
    }
    return true;
}

function preload() {
    imagenPelota = loadImage('bola.png');
    imagenRaqueta = loadImage('barra1.png');
    imagenComputadora = loadImage('barra2.png');
    imagenFondo = loadImage('fondo2.png');
    sonidoRaqueta = loadSound('pong.wav');
    sonidoGol = loadSound('gol.wav');
}


function setup() {
    createCanvas(800, 400);
    pelota = new Pelota(400, 200, 50,5,5);
    raqueta = new Raqueta(20, 150, 20, 100, 5);
    computadora = new Raqueta(760, 150, 20, 100, 5);
}

function narrarPuntos() {
    //Narra los puntos utilizando la api speechapi
    //Narra utilizando español de México
    let puntos = "El marcador está Jugador" + puntosJugador + " a Computadora" + puntosComputadora;
    let mensaje = new SpeechSynthesisUtterance(puntos);
    mensaje.lang = 'es-MX'; 
    speechSynthesis.speak(mensaje);
}


function draw() {
    //background(0);
    //dibujar el fondo
    image(imagenFondo, 0, 0, width, height);
    pelota.update();
    pelota.draw();
    raqueta.update();
    raqueta.draw();
    computadora.update();
    computadora.draw();
}