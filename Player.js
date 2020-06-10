var size = 10;
var turnSpeed = 0.05;
var maxSpeed = 10;
var accelerationPower = 0.15;
var turnDegrees = 5;
var lagReducer = 10; //Higher means less lag, more possible errors

class Player {
  constructor(seed = floor(random(1000000000))) {
    this.score = 0;
    this.fitness;
    this.shotsFired = 0;
    this.shotsHit = 0;
    this.isDead = false;
    this.spin = 0;
    this.accelerating = false;
    this.vision = new Array(9) ;
    this.showVision = false;
    this.spaceship = createSprite(gameWidth/2, gameHeight/2);
    this.spaceship.limitSpeed(maxSpeed);
    this.spaceship.friction = 0.01;
    this.brain = new NeuralNet(9, 16, 4)
    this.framesAfterAsteroidCap = 600;
    this.framesAfterAsteroid = 0;
    this.framesAfterShot = 0;

    this.decision = new Array(4);
    this.seed = seed;
    randomSeed(this.seed);
    this.brain = new NeuralNet(9, 16, 4);

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
      this.shotsFired++;
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

  spawnNewDirectedAsteroid() {
    let x;
    let y;
    if (random() > 0.5) {
      x = int(random(2)) * gameWidth;
      y = random(gameHeight);
    } else {
      y = int(random(2)) * gameHeight;
      x = random(gameWidth);
    }

    //These are gonna be much greater than 3 but speed is limited by asteroid
    let xVel = this.spaceship.position.x - x;
    let yVel = this.spaceship.position.y - y;

    this.asteroidsList.push(new Asteroid(x, y, xVel, yVel, 1));
  }

  // Called every frame by runner class
  update() {
    if (this.isDead) {
      return;
    }

    this.checkTimers();
    this.updateMovement();
    this.score++;

    if (this.showVision) {
      this.look();
    }

    for (let a of this.asteroidsList) {
      a.update();
      if (this.spaceship.overlap(a.asteroid)) {
        //TODO: Add collision code
        this.isDead = true;
        // print("Game over!");
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
          this.score += 100;
          this.shotsHit++;
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

    // this.show();

    // textSize(30);
    // fill(50, 200, 50);
    // text("Score: " + this.score, 10, 30);
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

      if (this.showVision) {
        stroke(255);
        circle(x, y, 2);
      }

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
      this.spawnNewDirectedAsteroid();
      this.framesAfterAsteroid = 0;
      if(this.framesAfterAsteroidCap > 90) {
        this.framesAfterAsteroidCap *= .9;
      }
    }
  }

  toggleVision() {
    this.showVision = !this.showVision;
  }

  calculateFitness() {
    this.fitness = this.score + this.score * (this.shotsHit / (this.shotsFired + 1) / 2);
  }


  //returns a clone of this player with the same brian
  clone() {
    let clone = new Player();
    clone.brain = this.brain.clone();
    return clone;
  }

  //returns a clone of this player with the same brain and same random seeds used so all of the asteroids will be in  the same positions
  cloneForReplay() {
    let clone = new Player(this.seed);
    clone.brain = this.brain.clone();
    // clone.seedsUsed = (ArrayList)seedsUsed.clone();
    return clone;
  }

  crossover(parent2) {
    let child = new Player();
    child.brain = this.brain.crossover(parent2.brain);
    return child;
  }

  mutate() {
    this.brain.mutate(mutationRate);
  }

  //convert the output of the neural network to actions
  think() {
    //get the output of the neural network
    this.decision = this.brain.output(this.vision);

    if (this.decision[0] > 0.8) {//output 0 is boosting
      this.accelerating = true;
    } else {
      this.accelerating = false;
    }

    if (this.decision[1] > 0.8) {//output 1 is turn left
      this.spin = -turnDegrees;
    }
    else if (this.decision[2] > 0.8) {//output 2 is turn right
        this.spin = turnDegrees;
    }
    else { //if neither then dont turn
        this.spin = 0;
    }

    //shooting
    if (this.decision[3]> 0.8) {//output 3 is shooting
      this.shoot();
    }
  }

  // Displays sprite on screen
  show() {
    if (!this.isDead) {
      drawSprite(this.spaceship);
      for (let a of this.asteroidsList) {
        a.show();
      }
      for (let a of this.bulletList) {
        a.show();
      }
    }
  }

  //saves the player to a file by converting it to a table
  savePlayer(playerNo, score) {
    //save the players top score and its population id
    let playerStats = new p5.Table();
    playerStats.addColumn("Top Score"); //Table.addColumn
    playerStats.addColumn("PopulationID");
    // let tr = playerStats.addRow(); // tr is TableRow
    // tr.setNum(0, this.score); //TableRow.setFloat or Table.setFloat
    // tr.setInt(1, popID); //TableRow.setInt or Table.setInt

    // saveTable(playerStats, "data/playerStats" + playerNo + ".csv");

    //save players brain
    saveTable(this.brain.netToTable(), "player" + playerNo + ".csv"); //NetToTable() must be created
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------

  //return the player saved in the parameter posiition
  loadPlayer(playerNo) {
    // let load = new Player();
    let t = loadTable("player" + playerNo + ".csv"); //t is a Table
    print(t)
    this.brain.tableToNet(t); //NeuralNet.TableToNet(Table t)
  }
}
