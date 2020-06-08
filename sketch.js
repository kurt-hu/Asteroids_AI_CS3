var player;

var gameWidth = 800;
var gameHeight = 800;

var isHumanPlaying = false;
var showBest = false;
var showOneFromPop = true;

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

  theBoys = new Population(200);
}

// Called every frame
function draw() {
  background(0);
  if (isHumanPlaying) {
    if (!humanPlayer.isDead) {
      humanPlayer.update();
      humanPlayer.show();
    }
  } else if (showBest) {
    if (!theBoys.bestPlayer.isDead) {
      theBoys.bestPlayer.look();
      theBoys.bestPlayer.think();
      theBoys.bestPlayer.update();
      theBoys.bestPlayer.show();
    } else {
      showBest = false;
      theBoys.bestPlayer = theBoys.bestPlayer.cloneForReplay();
    }
  } else {
    if (!theBoys.done()) {
      theBoys.updateAlive();
    } else {
      theBoys.calculateFitness();
      theBoys.naturalSelection();
    }
  }


  showText();
  print(frameRate())

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
  if (isHumanPlaying) {
    textSize(30);
    fill(50, 200, 50);
    text("Score: " + humanPlayer.score, 10, 30);
  } else if (showBest) {
    textSize(30);
    fill(50, 200, 50);
    text("Score: " + theBoys.bestPlayer.score, 10, 30);
    text("Gen: " + theBoys.generation, gameWidth - 150, 30);
  } else {
    textSize(30);
    fill(50, 200, 50);
    text("Gen: " + theBoys.generation, gameWidth - 150, 30);
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
      print(theBoys.bestScore);
      if (theBoys.bestPlayer != null) {
        showBest = true;
        print(theBoys.bestPlayer.brain.whh)
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
}

function keyReleased() {
    if (keyCode == UP_ARROW)
        humanPlayer.accelerating = false;
    if (keyCode == LEFT_ARROW)
        humanPlayer.spin -= -turnDegrees;
    if (keyCode == RIGHT_ARROW)
        humanPlayer.spin -= turnDegrees;
}
