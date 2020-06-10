var player;

var gameWidth = 800;
var gameHeight = 800;

var isHumanPlaying = false;
var showBest = false;
var showOneFromPop = false;
var playingFromFile = false;

var mutationRate = 0.1;

var fps = 60;


//framerate testing
// var lastUpdate = Date.now();
// var myInterval = setInterval(tick, 0);
//
// function tick() {
//   var now = Date.now();
//   var dt = now - lastUpdate;
//   lastUpdate = now;
//
//   print(dt)
// }

// Called once during runtime
function setup() {
  createCanvas(gameWidth, gameHeight);
  frameRate(fps);
  humanPlayer = new Player();
  filePlayer = new Player();

  spaceshipPop = new Population(30);
}

// Called every frame
function draw() {
  background(0);
  if (playingFromFile) {
    if (!filePlayer.isDead) {
      filePlayer.loadPlayer(1);
    } else {
      playingFromFile = false;
    }
  } else if (isHumanPlaying) {
    if (!humanPlayer.isDead) {
      humanPlayer.update();
      humanPlayer.show();
    }
  } else if (showBest) {
    if (!spaceshipPop.bestPlayer.isDead) {
      spaceshipPop.bestPlayer.look();
      spaceshipPop.bestPlayer.think();
      spaceshipPop.bestPlayer.update();
      spaceshipPop.bestPlayer.show();
    } else {
      showBest = false;
      spaceshipPop.bestPlayer = spaceshipPop.bestPlayer.cloneForReplay();
    }
  } else {
    if (!spaceshipPop.done()) {
      spaceshipPop.updateAlive();
    } else {
      spaceshipPop.calculateFitness();
      spaceshipPop.naturalSelection();
    }
  }


  showText();
  // print(frameRate())

  if (humanPlayer.isDead){
    textSize(32);
    textAlign(CENTER);
    fill(250, 50, 50);
    text('Game Over!', gameWidth/2, gameHeight/2);
    text('Score: ' + humanPlayer.score, gameWidth/2, gameHeight/2 + 35);
    text("Press 'Enter' to restart", gameWidth/2, gameHeight/2 + 70)
  }
}

function showText() {
  if (playingFromFile) {
    textSize(30);
    fill(50, 200, 50);
    text("Saved Player Score: " + filePlayer.score, 10, 30);
  } else if (isHumanPlaying) {
    textSize(30);
    fill(50, 200, 50);
    text("Score: " + humanPlayer.score, 10, 30);
  } else if (showBest) {
    textSize(30);
    fill(50, 200, 50);
    text("Score: " + spaceshipPop.bestPlayer.score, 10, 30);
    text("Gen: " + spaceshipPop.generation, gameWidth - 150, 30);
  } else {
    textSize(30);
    fill(50, 200, 50);
    text("Score: ~" + spaceshipPop.getRandomScore(), 10, 30);
    text("Gen: " + spaceshipPop.generation, gameWidth - 150, 30);

  }
}

function keyPressed() {
    if (keyCode == UP_ARROW)
        humanPlayer.accelerating = true;
    if (keyCode == LEFT_ARROW)
        humanPlayer.spin += -turnDegrees;
    if (keyCode == RIGHT_ARROW)
        humanPlayer.spin += turnDegrees;
    if (key == ' ') {
        humanPlayer.shoot();
    }
    if (keyCode == ENTER && humanPlayer.isDead) {
        humanPlayer = new Player();
    }
    if (key == 'v') {
      for (let i = 0; i < humanPlayer.vision.length; i++) {
        print(humanPlayer.vision[i]);
      }
      humanPlayer.toggleVision();
    }
    if (key == 'f') {
      humanPlayer.calculateFitness();
      print(humanPlayer.fitness);
    }
    if (key == 'h') {
      isHumanPlaying = !isHumanPlaying;
      humanPlayer = new Player();
    }
    if (key == 'b') {
      print(spaceshipPop.bestScore);
      if (spaceshipPop.bestPlayer != null) {
        showBest = true;
        print(spaceshipPop.bestPlayer.brain.whh)
      }
    }
    if (key == '=') {
      fps += 10;
      frameRate(fps);
      print(fps);
    }
    if (key == '-') {
      fps -= 10;
      frameRate(fps);
      print(fps);
    }
    // if (key == 's') {
    //   saveToFile(spaceshipPop);
    // }
}

function keyReleased() {
    if (keyCode == UP_ARROW)
        humanPlayer.accelerating = false;
    if (keyCode == LEFT_ARROW)
        humanPlayer.spin -= -turnDegrees;
    if (keyCode == RIGHT_ARROW)
        humanPlayer.spin -= turnDegrees;
}

function saveToFile(population) {
  if (population != null) {
    population.bestPlayer.savePlayer(1);
  }
}
