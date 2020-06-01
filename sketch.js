var player;

var gameWidth = 800;
var gameHeight = 800;
var isGameOver = false;
var score = 0;

// Called once during runtime
function setup() {
  createCanvas(gameWidth, gameHeight);
  player = new Player();
}

// Called every frame
function draw() {
  background(0);
  if (!isGameOver) {
    player.update();
  }

  if (isGameOver){
    textSize(32);
    textAlign(CENTER);
    fill(250, 50, 50);
    text('Game Over!', gameWidth/2, gameHeight/2);
    text('Score: ' + score, gameWidth/2, gameHeight/2 + 35);
    text("Press 'Enter' to restart", gameWidth/2, gameHeight/2 + 70)
  }
}

function keyPressed() {
    if (keyCode == UP_ARROW)
        player.accelerating = true;
    if (keyCode == LEFT_ARROW)
        player.spin += -turnDegrees;
    if (keyCode == RIGHT_ARROW)
        player.spin += turnDegrees;
    if (key == ' ') {
        player.shoot();
    }
    if (keyCode == ENTER && isGameOver) {
        isGameOver = false;
        player = new Player();
    }
    if (key == 'b') {
      for (let i = 0; i < player.vision.length; i++) {
        print(player.vision[i]);
      }
    }
}

function keyReleased() {
    if (keyCode == UP_ARROW)
        player.accelerating = false;
    if (keyCode == LEFT_ARROW)
        player.spin -= -turnDegrees;
    if (keyCode == RIGHT_ARROW)
        player.spin -= turnDegrees;
}
