var radius = 10;

class Bullet {

  constructor (startingX, startingY, startingRotation) {
    this.spin = 0;
    this.accelerating = false;
    this.bullet.rotation = startingRotation;
    this.bullet = createSprite(startingX, startingY);

    this.bullet.draw = function() {
      push();

      fill(255, 204, 0);
      beginShape();
      circle(startingX, startingY, radius)
      endShape(CLOSE);

      pop();
    }
  }

  update() {
    this.updateMovement();
    this.show();
  }

  updateMovement() {
    //Checks if out of bounds
    if (this.bullet.position.x + this.radius < 0) {
      this.bullet.remove();
    } else if (this.bullet.position.x - this.bullet > width) {
      this.bullet.remove();
    }
    if (this.bullet.position.y + this.radius < 0) {
      this.bullet.remove();
    } else if (this.bullet.position.y - this.radius > height) {
      this.bullet.remove();
    }
  }

  show() {
    drawSprite(this.bullet);
  }
}
