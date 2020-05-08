var player;

var gameWidth = 800;
var gameHeight = 800;

// Called once during runtime
function setup() {
  createCanvas(gameWidth, gameHeight);
  player = new Player();
}

// Called every frame
function draw() {
  background(150);

  player.update();
}

function keyPressed() {
    if (keyCode == UP_ARROW)
        player.accelerating = true;
    if (keyCode == LEFT_ARROW)
        player.spin += -turnDegrees;
    if (keyCode == RIGHT_ARROW)
        player.spin += turnDegrees;
    if (keyCode == SHIFT)
        player.shoot();
}

function keyReleased() {
    if (keyCode == UP_ARROW)
        player.accelerating = false;
    if (keyCode == LEFT_ARROW)
        player.spin -= -turnDegrees;
    if (keyCode == RIGHT_ARROW)
        player.spin -= turnDegrees;
}
