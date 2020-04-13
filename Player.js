class Player {
  constructor() {
    this.turnSpeed = 0.05
    this.maxSpeed = 10
    this.torque = 0

    this.accelerating = false;

    this.pos = createVector(gameWidth/2, gameHeight/2);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);

    this.angle = 0;
  }

  update() {
    this.move();
  }

  move() {

    if (this.accelerating) {
      console.log("accelerating")
      this.acceleration = p5.Vector.fromAngle(this.angle);
      this.acceleration.setMag(.1);
    } else {
      this.acceleration.setMag(0);
    }

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);

    console.log(this.velocity)

    this.pos.add(this.velocity);

    this.angle += this.torque;
  }

  show() {

    push();

    translate(this.pos.x, this.pos.y);
    rotate(this.angle);


    fill(0);
    noStroke();

    var size = 12;

    beginShape();

    vertex(-size-2, -size);
    vertex(-size-2, size);
    vertex(2 * size - 2, 0);
    endShape(CLOSE);
    stroke(255);

    pop();

  }

  // function move() {
  //   self.angle = self.angle + (self.right - self.left)*self.turnSpeed
  //   self.velocity += 0.1*(self.up - self.down)
  //
  //   self.body.rotate((self.right - self.left)*self.turnSpeed)
  //   self.x = self.x + sin(self.angle)*self.velocity
  //   self.y = self.y - cos(self.angle)*self.velocity
  //
  //   if self.velocity > 10 {
  //       self.velocity = 10
  //   }
  //   if self.velocity < 1 {
  //       self.velocity = 1
  //   }
  //
  //   print(self.velocity)
  // }
}
