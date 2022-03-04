class Firework {
  gravity = 0.2;
  mass;
  radius;
  accelerationY = 0;
  accelerationX = 0;
  launchFireworkImpulse;
  directionInAngle;
  isLaunched = false;

  tailX;
  tailY;
  tailOpacity = 0.3;
  tailLength = 10;

  constructor({
    x = Math.random() * canvas.width,
    y = canvas.height + 10,
    radius = 10,
    color = '#fff',
    minImpulse = 5,
    maxImpulse = 9,
    maxDirectionInAngle = 110,
    minDirectionInAngle = 70,
    mass = 0.4
  }) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.mass = mass;
    this.launchFireworkImpulse = Math.random() * (maxImpulse - minImpulse) + minImpulse;
    this.directionInAngle = Math.random() * (maxDirectionInAngle - minDirectionInAngle) + minDirectionInAngle
  }

  update() {
    this.applyGravity();
    this.launchFirework();

    if (this.accelerationY >= -6.5) {
      this.radius = Math.max(0, this.radius - 0.1);
    }

    this.x += this.accelerationX;
    this.y += this.accelerationY;

    // Tail transform
    this.tailX = this.x - (this.accelerationX * this.tailLength);;
    this.tailY = this.y - (this.accelerationY * this.tailLength);
  }

  applyGravity() {
    this.accelerationY += -Math.sin(Math.PI * 1.5) * (this.gravity * this.mass);
  }

  launchFirework() {
    if (!this.isLaunched) {
      this.accelerationX += Math.cos((Math.PI * this.directionInAngle) / 180) * this.launchFireworkImpulse;
      this.accelerationY += -Math.sin((Math.PI * this.directionInAngle) / 180) * this.launchFireworkImpulse;
      this.isLaunched = true;
    }
  }

  drawTail() {
    ctx.save();
    ctx.globalAlpha = this.tailOpacity;
    ctx.beginPath();
    ctx.moveTo(this.tailX, this.tailY);
    ctx.lineTo(this.x - this.radius, this.y);
    ctx.lineTo(this.x + this.radius, this.y);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    this.drawTail();
  }
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const fps = 60;

let generateFireworksInterval = 500;
let fireworkParticlesCount = 80;

const fireworks = [];
const fireworksColors = ['red', 'blue', 'green', 'white', 'purple', 'cyan', 'yellow'];
const fireworkParticles = [];

function generateFireworkParticles(x, y) {
  for (let i = 0; i < fireworkParticlesCount; i++) {
    const color = Math.floor(Math.random() * fireworksColors.length);

    const particle = new Firework({
      x,
      y,
      color: fireworksColors[color],
      radius: 6,
      maxImpulse: 5,
      minImpulse: 2,
      minDirectionInAngle: 45,
      maxDirectionInAngle: 135,
      mass: 0.5
    });

    fireworkParticles.push(particle);
  }
}

function generateFireworks() {
  const color = Math.floor(Math.random() * fireworksColors.length);
  const firework = new Firework({ color: fireworksColors[color] });
  fireworks.push(firework);
}

function update() {
  fireworks.forEach(firework => {
    if (firework.radius <= 0) {
      generateFireworkParticles(firework.x, firework.y);
      return fireworks.splice(firework, 1);
    }

    return firework.update();
  });

  fireworkParticles.forEach(particle => {
    if (particle.radius <= 0) {
      return fireworkParticles.splice(particle, 1);
    }

    return particle.update();
  });

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach(firework => firework.draw());
  fireworkParticles.forEach(particle => particle.draw());
}

setInterval(update, 1000/fps);
setInterval(generateFireworks, generateFireworksInterval);