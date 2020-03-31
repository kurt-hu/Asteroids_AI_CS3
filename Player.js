class Player {
  constructor() {
    this.turnSpeed = 0.05
    //hey background
    //hey backgro dsdund
    this.pos = createVector(gameWidth/2, gameHeight/2);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.rotation = 0
  }

  move() {

  }

  show() {
    push();

    translate(this.pos.x, this.pos.y)
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
    // beginShape(TRIANGLES);
    // vertex(-10, 15);
    // vertex(0, -15);
    // vertex(10, 15);
    // endShape();
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
