var bulletSize = 10;

class Bullet {

  constructor(startingX, startingY, startingRotation, startingXvelocity = 0, startingYvelocity = 0) {
    this.spin = 0;

    this.bullet = createSprite(startingX, startingY);
    this.bullet.accelerating = false;
    this.bullet.rotation = startingRotation;
    this.bullet.setVelocity(30*cos(radians(startingRotation)) + startingXvelocity,
      30*sin(radians(startingRotation)) + startingYvelocity);

    this.bullet.draw = function() {
        push();
        // noFill();
        fill(0);
        stroke(255);
        beginShape();

        circle(0, 0, bulletSize);

        endShape(CLOSE);
        pop();
      }

      this.bullet.setCollider("circle", 0, 0, bulletSize);
  }

  update() {
    this.updateMovement();
    // this.show();
  }

  updateMovement() {
    //Checks if out of bounds
      // this.bullet.position.x += this.bullet.velocity.x;
      // this.bullet.position.y += this.bullet.velocity.y;
      // print(this.bullet.position.x);
      // print(this.bullet.position.y);
  }

  inBounds() {
    if (this.bullet.position.x + bulletSize < 0) {
        return false;
    }
    if (this.bullet.position.x - bulletSize > gameWidth) {
        return false;
    }
    if (this.bullet.position.y + bulletSize < 0) {
        return false;
    }
    if (this.bullet.position.y - bulletSize > gameHeight) {
      return false;
    }
    return true
  }
  show() {
    drawSprite(this.bullet);
  }
}
