var size = 10;
var turnSpeed = 0.05;
var maxSpeed = 10;
var accelerationPower = 0.15;
var turnDegrees = 3;

class Player {

  constructor() {
    this.spin = 0;
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

    this.spaceship.setCollider("rectangle", 0, 0, size, 2*size)

    this.bulletList = [];


    this.asteroidsList = [];
    this.asteroidsList.push(new Asteroid(random(width), random(height), random(-2, 2), random(-2, 2), 1));
    this.asteroidsList.push(new Asteroid(random(width), random(height), random(-2, 2), random(-2, 2), 2));
    this.asteroidsList.push(new Asteroid(random(width), random(height), random(-2, 2), random(-2, 2), 1));
    this.asteroidsList.push(new Asteroid(random(width), random(height), 0, 0, 1));

  }

  shoot() {
    //By default, clockwise is positive, so we gotta do a reverse, but y is also backwards (positive is down),
    // so the two negatives cancel each other out, so we can just use the original this.spaceship.rotation value
    this.bulletStartX = this.spaceship.position.x + size * cos(radians(this.spaceship.rotation));
    this.bulletStartY = this.spaceship.position.y + size * sin(radians(this.spaceship.rotation));
    this.bulletList.push(new Bullet(this.bulletStartX, this.bulletStartY, this.spaceship.rotation,
                                    this.spaceship.velocity.x, this.spaceship.velocity.y));
  }

  // Called every frame by runner class
  update() {
    this.updateMovement();

    for (let a of this.asteroidsList) {
      a.update();
      if (this.spaceship.overlap(a.asteroid)) {
        //TODO: Add collision code

      }
    };

    for (let i = 0; i < this.bulletList.length; i++) {
      for (let j = 0; j < this.asteroidsList.length; j++) {
        if (this.asteroidsList[j].asteroid.overlap(this.bulletList[i].bullet)) {
          //TODO: Add collision code
          print("Hit asteroid")

        }
      }

      if (this.bulletList[i].inBounds()) {
        this.bulletList[i].update();
      } else {
        this.bulletList.splice(i, 1);
      }
    }

    this.show();
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
