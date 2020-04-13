var player;

var gameWidth = 800;
var gameHeight = 800;

function setup() {
  // put setup code here
  createCanvas(gameWidth, gameHeight);
  player = new Player();
}

function draw() {
  // put drawing code here
  background(150);

  player.update();
  player.show();
  // player.move();
}

function keyPressed() {
    if (keyCode == UP_ARROW)
        player.accelerating = true;
    if (keyCode == LEFT_ARROW)
        player.torque += -0.1;
    if (keyCode == RIGHT_ARROW)
        player.torque += 0.1;
}

function keyReleased() {
    if (keyCode == UP_ARROW)
        player.accelerating = false;
    if (keyCode == LEFT_ARROW)
        player.torque -= -0.1;
    if (keyCode == RIGHT_ARROW)
        player.torque -= 0.1;
}
