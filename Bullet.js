var radius = 10;
var velocity = 10;
var size = 2;
class Bullet {

  constructor (startingX, startingY, startingRotation) {
    this.bullet.spin = 0;
    this.bullet.accelerating = false;
    this.bullet.rotation = startingRotation;
    this.bullet = createSprite(startingX, startingY);

    this.bullet.draw = function() {
        let angle = TWO_PI / 12;

        push();
        // noFill();
        fill(200, 0, 0)1;
        stroke(255);
        beginShape();

        for (let a = 0; a < TWO_PI; a += angle) {
          vertex(startingX + cos(a) * 5, startingY + sin(a) * 5);
        }

        // circle(startingX, startingY, 5);

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
    } else if (this.bullet.position.x - this.bullet > gameWidth) {
      this.bullet.remove();
    }
    else if (this.bullet.position.y + this.radius < 0) {
      this.bullet.remove();
    } else if (this.bullet.position.y - this.radius > gameHeight) {
      this.bullet.remove();
    }
    else {
      this.bullet.position.x += velocity * cosine(this.bullet.rotation)
      this.bullet.position.y += velocity * sine(this.bullet.rotation)
    }
  }

  show() {
    drawSprite(this.bullet);
  }
}
