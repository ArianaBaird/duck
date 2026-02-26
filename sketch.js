// Duck Party - p5.js Demo
let ducks = [];
let confetti = [];
let isMoving = false;
let currentHatType = 0; // 0: party, 1: top hat, 2: baseball cap, 3: winter hat
let currentDuckColor = 0; // 0: white goose, 1: Canadian goose, 2: yellow, 3: mallard
let currentGrassType = 0; // 0: none, 1: plain, 2: flowers, 3: muddy puddle, 4: pond
let quackSound, partySound;
let baseDuckSize;

// Hat types array
const HAT_TYPES = ['party', 'tophat', 'baseball', 'winter'];

// Duck color presets
const DUCK_COLORS = {
  whiteGoose: { body: [240, 245, 250], head: [240, 245, 250], eye: [20, 20, 20], beak: [255, 140, 0] },
  canadianGoose: { body: [40, 40, 40], head: [40, 40, 40], eye: [255, 255, 255], beak: [255, 100, 0] },
  yellow: { body: [255, 220, 0], head: [255, 220, 0], eye: [20, 20, 20], beak: [255, 100, 0] },
  mallard: { body: [100, 140, 80], head: [20, 80, 60], eye: [255, 255, 255], beak: [255, 140, 0] }
};

// Grass types
const GRASS_TYPES = ['none', 'plain', 'flowers', 'muddypuddle', 'pond'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  baseDuckSize = windowWidth / 8;
  
  // Create initial duck
  addDuck();
  
  // Remove sound initialization - we'll use simpler approach
}

function addDuck() {
  const duck = {
    x: random(baseDuckSize, width - baseDuckSize),
    y: random(baseDuckSize, height - baseDuckSize),
    vx: 0,
    vy: 0,
    rotation: 0,
    targetRotation: 0,
    speed: 2,
    size: baseDuckSize,
    hatType: currentHatType,
    colorType: currentDuckColor
  };
  ducks.push(duck);
}

function draw() {
  // Background
  background(137, 207, 240);
  
  // Draw grass
  drawGrass();
  
  // Update and draw ducks
  for (let duck of ducks) {
    updateDuck(duck);
    drawDuck(duck);
  }
  
  // Update and draw confetti
  for (let i = confetti.length - 1; i >= 0; i--) {
    confetti[i].update();
    confetti[i].display();
    if (confetti[i].isDead()) {
      confetti.splice(i, 1);
    }
  }
  
  // Draw legend
  drawLegend();
}

function updateDuck(duck) {
  if (isMoving) {
    // Move duck
    duck.x += duck.vx;
    duck.y += duck.vy;
    
    // Gradually rotate towards target rotation
    duck.rotation = lerp(duck.rotation, duck.targetRotation, 0.05);
    
    // Check edge collisions
    const radius = duck.size / 2;
    if (duck.x - radius < 0 || duck.x + radius > width ||
        duck.y - radius < 0 || duck.y + radius > height) {
      triggerParty();
      // Bounce in random direction
      parseNewDirection(duck);
    }
    
    // Keep duck in bounds
    duck.x = constrain(duck.x, radius, width - radius);
    duck.y = constrain(duck.y, radius, height - radius);
  }
}

function parseNewDirection(duck) {
  const angle = random(TWO_PI);
  duck.vx = cos(angle) * duck.speed;
  duck.vy = sin(angle) * duck.speed;
  duck.targetRotation = angle;
}

function drawDuck(duck) {
  push();
  translate(duck.x, duck.y);
  rotate(duck.rotation);
  
  const colorScheme = getDuckColors(duck.colorType);
  const size = duck.size;
  
  // Body (circle)
  fill(colorScheme.body);
  stroke(0);
  strokeWeight(2);
  circle(0, 0, size);
  
  // Head (small circle on top)
  fill(colorScheme.head);
  circle(0, -size * 0.6, size * 0.65);
  
  // Eyes (pusheen style - closed happy eyes)
  fill(0);
  ellipse(-size * 0.15, -size * 0.67, size * 0.08, size * 0.08);
  ellipse(size * 0.15, -size * 0.67, size * 0.08, size * 0.08);
  
  // Beak (rotated bracket)
  fill(colorScheme.beak);
  stroke(0);
  strokeWeight(1.5);
  arc(0, -size * 0.6, size * 0.25, size * 0.15, 0, PI, CHORD);
  
  // Wings (half circles on sides)
  fill(colorScheme.body);
  stroke(0);
  strokeWeight(1.5);
  arc(-size * 0.35, 0, size * 0.35, size * 0.3, PI/2, 3*PI/2, CHORD);
  arc(size * 0.35, 0, size * 0.35, size * 0.3, PI/2, 3*PI/2, CHORD);
  
  // Feet (half circles at bottom, flat side down)
  fill(colorScheme.beak);
  stroke(0);
  strokeWeight(1.5);
  arc(-size * 0.18, size * 0.42, size * 0.25, size * 0.15, 0, PI);
  arc(size * 0.18, size * 0.42, size * 0.25, size * 0.15, 0, PI);
  
  // Hat
  drawHat(duck.hatType, size);
  
  pop();
}

function drawBeak(x, y, size) {
  // Draw a bracket-like beak rotated 90 degrees
  beginShape();
  vertex(x + size, y - size * 0.4);
  vertex(x + size * 0.3, y - size * 0.4);
  vertex(x + size * 0.3, y);
  vertex(x + size, y);
  endShape();
}

function drawHat(hatType, duckSize) {
  const hatY = -duckSize * 0.85;
  
  if (hatType === 0) {
    // Party hat
    fill(255, 192, 203); // Pink
    stroke(0);
    strokeWeight(1);
    triangle(-duckSize * 0.2, hatY, duckSize * 0.2, hatY, 0, hatY - duckSize * 0.35);
    
    // Yellow pom pom
    fill(255, 255, 0);
    stroke(0);
    strokeWeight(1);
    circle(0, hatY - duckSize * 0.38, duckSize * 0.15);
  } else if (hatType === 1) {
    // Top hat
    fill(0); // Black
    stroke(0);
    strokeWeight(1);
    // Bottom brim
    fill(0);
    stroke(0);
    strokeWeight(1);
    ellipse(0, hatY, duckSize * 0.5, duckSize * 0.08);
    // Cap rounded part
    arc(0, hatY - duckSize * 0.1, duckSize * 0.4, duckSize * 0.2, PI, TWO_PI);
    fill(255, 0 , 0); // Red band
    rect(-duckSize * 0.2, hatY - duckSize * 0.1, duckSize * 0.4, duckSize * 0.1);
    
  } else if (hatType === 2) {
    // Baseball cap
    fill(0, 100, 255); // Blue
    stroke(0);
    strokeWeight(1);
    // Cap rounded part
    rect(-duckSize * 0.2, hatY - duckSize * 0.11, duckSize * 0.4, duckSize * 0.05);
    arc(0, hatY - duckSize * 0.05, duckSize * 0.4, duckSize * 0.2, PI, TWO_PI, OPEN);
        
    // Visor
    fill(0,100,255);
    stroke(0);
    strokeWeight(1);
    arc(0, hatY - duckSize * 0.01, duckSize * 0.4, duckSize * 0.15, 0, PI);
  } else if (hatType === 3) {
    // Winter hat/Tuke (red pompom hat)
    fill(200, 0, 0); // Red
    stroke(0);
    strokeWeight(1);
    // Knit part
    arc(0, hatY, duckSize * 0.35, duckSize * 0.25, PI, TWO_PI);
    
    // Pom pom
    fill(255, 255, 255);
    noStroke();
    circle(0, hatY - duckSize * 0.15, duckSize * 0.12);
  }
}

function getDuckColors(colorType) {
  switch(colorType) {
    case 0: return DUCK_COLORS.whiteGoose;
    case 1: return DUCK_COLORS.canadianGoose;
    case 2: return DUCK_COLORS.yellow;
    case 3: return DUCK_COLORS.mallard;
    default: return DUCK_COLORS.whiteGoose;
  }
}

function drawGrass() {
  if (currentGrassType === 0) return; // None
  
  const grassHeight = 80;
  
  if (currentGrassType === 1) {
    // Plain grass
    drawPlainGrass(grassHeight);
  } else if (currentGrassType === 2) {
    // Grass with flowers
    drawPlainGrass(grassHeight);
    drawFlowers();
  } else if (currentGrassType === 3) {
    // Grass with muddy puddle
    drawPlainGrass(grassHeight);
    drawMuddyPuddle();
  } else if (currentGrassType === 4) {
    // Grass with pond
    drawPlainGrass(grassHeight);
    drawPond();
  }
}

function drawPlainGrass(height) {
  fill(100, 150, 75);
  stroke(80, 120, 60);
  strokeWeight(1);
  
  // Draw grass blades
  for (let x = 0; x < width; x += 15) {
    const bladeWidth = random(3, 6);
    drawGrassBlade(x, height, bladeWidth);
  }
}

function drawGrassBlade(x, height, width) {
  beginShape();
  const baseY = height;
  const tipY = height - random(30, 50);
  const curveAmount = random(-5, 5);
  
  bezier(x - width/2, baseY, x - width + curveAmount, tipY - 10, 
         x + curveAmount - 2, tipY - 5, x + width/2, baseY);
  bezier(x + width/2, baseY, x + width + curveAmount, tipY - 8, 
         x + curveAmount + 2, tipY - 3, x - width/2, baseY);
  endShape(CLOSE);
}

function drawFlowers() {
  // Red flowers scattered
  for (let i = 0; i < 8; i++) {
    const x = random(width);
    const y = height - random(20, 60);
    drawFlower(x, y, 255, 50, 50);
  }
}

function drawFlower(x, y, r, g, b) {
  fill(r, g, b);
  noStroke();
  // Petals
  for (let i = 0; i < 5; i++) {
    const angle = TWO_PI / 5 * i;
    const px = x + cos(angle) * 12;
    const py = y + sin(angle) * 12;
    circle(px, py, 8);
  }
  // Center
  fill(255, 255, 0);
  circle(x, y, 6);
}

function drawMuddyPuddle() {
  fill(139, 90, 43);
  noStroke();
  ellipse(width / 2, height - 50, 300, 80);
  
  fill(150, 100, 50);
  ellipse(width / 2 - 40, height - 50, 60, 40);
  ellipse(width / 2 + 60, height - 55, 50, 35);
}

function drawPond() {
  fill(100, 150, 200);
  noStroke();
  ellipse(width / 2, height - 80, 400, 120);
  
  // Water ripples
  stroke(150, 180, 220);
  strokeWeight(1);
  noFill();
  ellipse(width / 2, height - 80, 120, 40);
  ellipse(width / 2, height - 80, 180, 60);
}

function drawLegend() {
  const padding = 15;
  const margin = width / 40;
  const boxWidth = 220;
  const boxHeight = 240;
  const x = width - margin - boxWidth;
  const y = margin;
  
  // Background
  fill(255);
  stroke(0);
  strokeWeight(2);
  rect(x, y, boxWidth, boxHeight);
  
  // Text
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textFont('Quicksand');
  textSize(11);
  
  const lines = [
    "[enter] - stop / start",
    "[space] - reset # of ducks",
    "(1,2,3...) - add __ ducks",
    "d - duck change",
    "g - grass",
    "h - hat change",
    "p - party!",
    "click the duck - ???"
  ];
  
  let currentY = y + padding;
  for (let line of lines) {
    text(line, x + padding, currentY);
    currentY += 25;
  }
}

function triggerParty() {
  // Create confetti
  for (let i = 0; i < 30; i++) {
    const conf = new Confetti(width / 2, height / 2);
    confetti.push(conf);
  }
  
  // Play party sound (simple beep)
  playPartySound();
}

function playPartySound() {
  // Create a simple beep using oscillator
  try {
    const osc = new p5.Oscillator('sine');
    osc.freq(800);
    osc.amp(0.1);
    osc.start();
    setTimeout(() => osc.stop(), 100);
  } catch(e) {
    // Sound might not be available
  }
}

function playQuackSound() {
  try {
    const osc = new p5.Oscillator('sine');
    osc.freq(300 + random(-50, 50));
    osc.amp(0.15);
    osc.start();
    setTimeout(() => osc.stop(), 150);
  } catch(e) {
    // Sound might not be available
  }
}

// Confetti class
class Confetti {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-3, 3);
    this.vy = random(-4, 0);
    this.width = random(10, 20);
    this.height = random(10, 20);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.1, 0.1);
    this.color = [
      color(255, 0, 0),      // Red
      color(255, 127, 0),    // Orange
      color(255, 255, 0),    // Yellow
      color(0, 255, 0),      // Green
      color(0, 0, 255),      // Blue
      color(75, 0, 130),     // Indigo
      color(148, 0, 211),    // Violet
      color(255, 192, 203)   // Pink
    ];
    this.c = random(this.color);
    this.life = 255;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // Gravity
    this.rotation += this.rotationSpeed;
    this.life -= 4;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    fill(this.c);
    fill(red(this.c), green(this.c), blue(this.c), this.life);
    noStroke();
    rect(-this.width/2, -this.height/2, this.width, this.height);
    pop();
  }
  
  isDead() {
    return this.y > height || this.life <= 0;
  }
}

// Keyboard controls
function keyPressed() {
  if (keyCode === ENTER) {
    isMoving = !isMoving;
    if (isMoving) {
      for (let duck of ducks) {
        parseNewDirection(duck);
      }
    }
    return false;
  }
  
  if (key === ' ') {
    ducks = [];
    addDuck();
    isMoving = false;
    return false;
  }
  
  if (key >= '1' && key <= '9') {
    const numToAdd = int(key);
    for (let i = 0; i < numToAdd; i++) {
      addDuck();
    }
    return false;
  }
  
  if (key === 'h' || key === 'H') {
    currentHatType = (currentHatType + 1) % HAT_TYPES.length;
    for (let duck of ducks) {
      duck.hatType = currentHatType;
    }
    return false;
  }
  
  if (key === 'd' || key === 'D') {
    currentDuckColor = (currentDuckColor + 1) % 4;
    for (let duck of ducks) {
      duck.colorType = currentDuckColor;
    }
    return false;
  }
  
  if (key === 'g' || key === 'G') {
    currentGrassType = (currentGrassType + 1) % GRASS_TYPES.length;
    return false;
  }
  
  if (key === 'p' || key === 'P') {
    triggerParty();
    return false;
  }
}

function mousePressed() {
  // Check if clicked on any duck
  for (let duck of ducks) {
    const distance = dist(mouseX, mouseY, duck.x, duck.y);
    if (distance < duck.size / 2) {
      playQuackSound();
      return false;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}