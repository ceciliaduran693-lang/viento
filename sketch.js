let audio;
let amplitude;
let particulas = [];
const NUM_PARTICULAS = 150;

function preload() {
  // Carga el archivo de audio antes de iniciar el sketch
  soundFormats('mp3', 'wav');
  audio = loadSound('viento.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Analizador de amplitud (volumen)
  amplitude = new p5.Amplitude();

  // Inicializar partículas
  for (let i = 0; i < NUM_PARTICULAS; i++) {
    particulas.push(new Particula());
  }
}

function draw() {
  // Fondo semitransparente para crear efecto de estela/movimiento
  background(15, 20, 30, 80);

  // Obtener la amplitud actual (devuelve un valor entre 0.0 y 1.0)
  let nivelViento = amplitude.getLevel();

  // Mapear la intensidad del viento a una fuerza de empuje horizontal
  let fuerzaViento = map(nivelViento, 0, 0.5, 1, 15);

  // Actualizar y dibujar cada partícula
  for (let p of particulas) {
    p.aplicarViento(fuerzaViento);
    p.update();
    p.display(nivelViento);
  }
}

// Iniciar/pausar audio con un clic
function mousePressed() {
  if (audio.isPlaying()) {
    audio.pause();
  } else {
    audio.loop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// --- Clase Partícula ---
class Particula {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(-50, width);
    this.y = random(height);
    this.vx = random(1, 3);
    this.vy = random(-0.5, 0.5);
    this.tamanoBase = random(2, 5);
    this.alpha = random(100, 200);
  }

  aplicarViento(fuerza) {
    // Las ráfagas aumentan la velocidad horizontal
    this.vxCurrent = this.vx + fuerza;
  }

  update() {
    this.x += this.vxCurrent;
    this.y += this.vy;

    // Reiniciar la partícula cuando sale de la pantalla
    if (this.x > width + 20 || this.y < 0 || this.y > height) {
      this.reset();
      this.x = -10;
    }
  }

  display(nivelViento) {
    noStroke();
    
    // El tamaño y brillo reaccionan dinámicamente al nivel del viento
    let tamanoDinamico = this.tamanoBase + nivelViento * 20;
    let brillo = map(nivelViento, 0, 0.5, 150, 255);

    fill(200, 225, 255, brillo);
    ellipse(this.x, this.y, tamanoDinamico, tamanoDinamico * 0.6);
  }
}