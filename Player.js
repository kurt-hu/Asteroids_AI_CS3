var size = 10;
var turnSpeed = 0.05;
var maxSpeed = 10;
var accelerationPower = 0.15;
var turnDegrees = 5;
var lagReducer = 10; //Higher means less lag, more possible errors
class Player {
  constructor() {
    this.isDead = false;
    this.spin = 0;
    this.accelerating = false;
    this.vision = new Array(9) ;

    this.spaceship = createSprite(gameWidth/2, gameHeight/2);
    this.spaceship.limitSpeed(maxSpeed);
    this.spaceship.friction = 0.01;

    score = 0;
    this.framesAfterAsteroidCap = 600;
    this.framesAfterAsteroid = 0;
    this.framesAfterShot = 0;

    this.spaceship.draw = function() {
      push();

      fill(255);

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
    this.spawnNewRandomAsteroid();
    this.spawnNewRandomAsteroid();
    this.spawnNewRandomAsteroid();
    this.spawnNewRandomAsteroid();

  }

  shoot() {
    if (this.framesAfterShot > 20) {
      //By default, clockwise is positive, so we gotta do a reverse, but y is also backwards (positive is down),
      // so the two negatives cancel each other out, so we can just use the original this.spaceship.rotation value
      this.bulletStartX = this.spaceship.position.x + size * cos(radians(this.spaceship.rotation));
      this.bulletStartY = this.spaceship.position.y + size * sin(radians(this.spaceship.rotation));
      this.bulletList.push(new Bullet(this.bulletStartX, this.bulletStartY, this.spaceship.rotation,
                                      this.spaceship.velocity.x, this.spaceship.velocity.y));
      this.framesAfterShot = 0;
    }
  }

  spawnNewRandomAsteroid() {
    let x;
    let y;
    if (random() > 0.5) {
      x = int(random(2)) * gameWidth;
      y = random(gameHeight);
    } else {
      y = int(random(2)) * gameHeight;
      x = random(gameWidth);
    }
    this.asteroidsList.push(new Asteroid(x, y, random(-3, 3), random(-3, 3), 1));
  }

  // Called every frame by runner class
  update() {
    this.checkTimers();
    this.updateMovement();
    score++;
    this.look();

    for (let a of this.asteroidsList) {
      a.update();
      if (this.spaceship.overlap(a.asteroid)) {
        //TODO: Add collision code
        this.isDead = true;
        isGameOver = true;
        print("Game over!")
      }
    };

    var xVel1;
    var xVel2;
    var yVel1;
    var yVel2;


    for (let i = 0; i < this.bulletList.length; i++) {
      for (let j = 0; j < this.asteroidsList.length; j++) {
        if (this.asteroidsList[j].asteroid.overlap(this.bulletList[i].bullet)) {
          //TODO: Add collision code
          score += 100;
          if (this.asteroidsList[j].radius == bigAsteroidRadius) {
            xVel1 = this.asteroidsList[j].asteroid.velocity.x - 1;
            xVel2 = this.asteroidsList[j].asteroid.velocity.x + 1;
            yVel1 = this.asteroidsList[j].asteroid.velocity.y - 1;
            yVel2 = this.asteroidsList[j].asteroid.velocity.y + 1;
            this.asteroidsList.push(new Asteroid(this.asteroidsList[j].asteroid.position.x,
                                    this.asteroidsList[j].asteroid.position.y, xVel1, yVel1, 2));
            this.asteroidsList.push(new Asteroid(this.asteroidsList[j].asteroid.position.x,
                                    this.asteroidsList[j].asteroid.position.y, xVel2, yVel2, 2));
          }

          //gotta get rid of the bullet before it can hit the small asteroids
          this.bulletList.splice(i, 1);
          this.asteroidsList.splice(j, 1);

          //this is a little weird but it doesn't work without the break, also makes it faster
          break;
        }
      }
    }

    //separating for loops for the sake of readability
    for (let i = 0; i < this.bulletList.length; i++) {
      if (this.bulletList[i].inBounds()) {
        this.bulletList[i].update();
      } else {
        this.bulletList.splice(i, 1);
      }
    }

    this.show();

    textSize(30);
    fill(50, 200, 50);
    text("Score: " + score, 10, 30);
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

  look() {
    let x;
    let y;
    for (let i = 0; i < this.vision.length; i++){
        x = lagReducer * cos(i * PI / 4 + radians(this.spaceship.rotation));
        y = lagReducer * sin(i * PI / 4 + radians(this.spaceship.rotation));
        this.vision[i] = this.lookInDirection(x, y);//consider increasing x and y by a factor if laggy
    }
    if(this.vision[8] != 0)//CB has canShoot as well - A
    {
      this.vision[8] = 1;
    }
    else {
      this.vision[8] = 0;
    }
  }

  lookInDirection(dX, dY) {
    let x = this.spaceship.position.x;
    let y = this.spaceship.position.y;
    let i = 1;
    while (abs(x-gameWidth/2) < gameWidth/2 && abs(y-gameHeight/2) < gameHeight/2) {
      //condition is that the coordinate is within the bounds
      x += dX;
      y += dY;

      //If you uncomment this it'll display the vision of the spaceship
      // stroke(255);
      // circle(x, y, 2);

      if(this.isAsteroidHere(x, y)){
        return i;
      }
      i += lagReducer;
    }
    return 0;
  }

  isAsteroidHere(x, y) {
    for (let a of this.asteroidsList) {
      if(a.asteroid.overlapPoint(x,y))
        return true;
    }
    return false;
  }

  checkTimers() {
    this.framesAfterShot++;
    this.framesAfterAsteroid++;

    if (this.framesAfterAsteroid > this.framesAfterAsteroidCap) {
      this.spawnNewRandomAsteroid();
      this.framesAfterAsteroid = 0;
      if(this.framesAfterAsteroidCap > 90) {
        this.framesAfterAsteroidCap *= .9;
      }
    }
  }

  // Displays sprite on screen
  show() {
    drawSprite(this.spaceship);

  }
}
