var player;
var framesAfterShot = 0;

var gameWidth = 800;
var gameHeight = 800;
var isSpaceDown

// Called once during runtime
function setup() {
  createCanvas(gameWidth, gameHeight);
  player = new Player();
}

// Called every frame
function draw() {
  background(150);

  framesAfterShot++;
  if (isSpaceDown == true && framesAfterShot > 20) {
      framesAfterShot = 0;
      player.shoot();
  }

  player.update();
}

function keyPressed() {
    if (keyCode == UP_ARROW)
        player.accelerating = true;
    if (keyCode == LEFT_ARROW)
        player.spin += -turnDegrees;
    if (keyCode == RIGHT_ARROW)
        player.spin += turnDegrees;
    if (key == ' ') {
        isSpaceDown = true;
    }
}

function keyReleased() {
    if (keyCode == UP_ARROW)
        player.accelerating = false;
    if (keyCode == LEFT_ARROW)
        player.spin -= -turnDegrees;
    if (keyCode == RIGHT_ARROW)
        player.spin -= turnDegrees;
    if (key == ' ')
      isSpaceDown = false;

}
