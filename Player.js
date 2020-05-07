var size = 10;
var turnSpeed = 0.05;
var maxSpeed = 10;
var accelerationPower = 0.15;
var turnDegrees = 3;

class Player {

  constructor() {
    this.spin = 0;
    this.angle = 0;
    this.accelerating = false;

    this.spaceship = createSprite(gameWidth/2, gameHeight/2);
    this.spaceship.limitSpeed(maxSpeed);
    this.spaceship.friction = 0.01;

    this.spaceship.draw = function() {
      push();

      fill(0);

      beginShape();
      vertex(-size, -size);
      vertex(-size, size);
      vertex(2*size, 0);
      endShape(CLOSE);

      pop();
    }

    this.asteroidsList = [];
    this.asteroidsList.push(new Asteroid(random(width), random(height), random(-2, 2), random(-2, 2), 1));
    this.asteroidsList.push(new Asteroid(random(width), random(height), random(-2, 2), random(-2, 2), 2));
    this.asteroidsList.push(new Asteroid(random(width), random(height), random(-2, 2), random(-2, 2), 1));
  }

  // Called every frame by runner class
  update() {
    this.updateMovement();
    this.show();

    for (let a of this.asteroidsList) {
      a.update();
    };
  }

  // Manages acceleration and rotation of spaceship
  updateMovement() {
    if (this.accelerating) {
      this.spaceship.addSpeed(accelerationPower, this.spaceship.rotation);
    }

    this.spaceship.rotation += this.spin;

    // Implements bouncing off the walls
    if (this.spaceship.position.x < 0) {
      this.spaceship.position.x = 1;
      this.spaceship.velocity.x = -this.spaceship.velocity.x;
      this.spaceship.setSpeed(0.7 * this.spaceship.getSpeed()); //slows it down a bit
    } else if (this.spaceship.position.x > width) {
      this.spaceship.position.x = width - 1;
      this.spaceship.velocity.x = -this.spaceship.velocity.x;
      this.spaceship.setSpeed(0.7 * this.spaceship.getSpeed());
    }
    if (this.spaceship.position.y < 0) {
      this.spaceship.position.y = 1;
      this.spaceship.velocity.y = -this.spaceship.velocity.y;
      this.spaceship.setSpeed(0.7 * this.spaceship.getSpeed());
    } else if (this.spaceship.position.y > height) {
      this.spaceship.position.y = height - 1;
      this.spaceship.velocity.y = -this.spaceship.velocity.y;
      this.spaceship.setSpeed(0.7 * this.spaceship.getSpeed());
    }
  }

  // Displays sprite on screen
  show() {
    drawSprite(this.spaceship);
  }
}
