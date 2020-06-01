class Matrix {
  constructor(numR, numC) { //takes integers
    this.rows = numR;
    this.cols = numC;
    this.matrix = new Array(rows,cols);
  }

  constructor(inputMatrix ) { //takes matrix
    this.matrix = inputMatrix;
    cols = inputMatrix.length();
    row = inputMatrix[0].length();
  }

  output() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        print(this.matrix[i][j] + " ");
      }
      println(" ");
    }
    println();
  }

  multiply(n) { // float is n
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] *= n;
      }
    }
  }

  dot(n) { //matrix is n
    let result = new Matrix(this.rows, n.cols);

    if (cols == n.rows) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.rows; j++) {
          this.sum = 0(float);
          for (let k = 0; k < this.rows; k++) {
            this.sum += this.matrix[i][k]*n.matrix[k][j];
          }
          result.matrix[i][j] = this.sum;
        }
      }
    }
    return result;
  }

  randomize() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] = ((Math.random() * 2) - 1)(int);
      }
    }
  }

  Add(n) {  //float is n
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] += n;
      }
    }
  }

  add(n) { //matix n
    let newMatrix = new Matrix(this.rows, this.cols);
    if (this.cols == n.cols && this.rows == n.rows) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          newMatrix.matrix[i][j] = this.matrix[i][j] + n.matrix[i][j];
        }
      }
    }
    return newMatrix;
  }

  subtract(n) {
    let newMatrix = new Matrix(this.cols, this.rows);
    if (this.cols == n.cols && this.rows == n.rows) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          newMatrix.matrix[i][j] = this.matrix[i][j] - n.matrix[i][j];
        }
      }
    }
    return newMatrix;
  }

  multiply(n) {
    let newMatrix = new Matrix(this.rows, this.cols);
    if (this.cols == n.cols && this.rows == n.rows) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          newMatrix.matrix[i][j] = this.matrix[i][j] * n.matrix[i][j];
        }
      }
    }
    return newMatrix;
  }

  transpose() {
    let n = new Matrix(this.cols, this.rows);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        n.matrix[j][i] = this.matrix[i][j];
      }
    }
    return n;
  }

  singleColumnMatrixFromArray(arr) { //float array
    let n = new Matrix(arr.length, 1);
    for (let i = 0; i < arr.length; i++) {
      n.matrix[i][0] = this.arr[i];
    }
    return n;
  }

  fromArray(arr) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] =  arr[j+i*this.cols];
      }
    }
  }

  toArray() {
    let arr = new Array(this.rows*this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.arr[j + i * this.cols] = this.matrix[i][j];
      }
    }
    return arr;
  }

  addBias() {
    let n = new Matrix(this.rows + 1, 1);
    for (let i = 0; i < this.rows; i++) {
      n.matrix[i][0] = this.matrix[i][0];
    }
    n.matrix[rows][0] = 1;
    return n;
  }

  activate() {
    let n = new Matrix(this.rows, this.cols);
    for (int i = 0; i < this.rows; i++) {
      for (int j = 0; j < this.cols; j++) {
        n.matrix[i][j] = sigmoid(this.matrix[i][j]);
      }
    }
    return n;
  }

  sigmoid(x) {
    let y = (1(float)) / (1 + pow((float)Math.E, -x));
    return y;
  }

  sigmoidDerived() {
    let n = new Matrix(this.rows, this.cols);
    for (let i =0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        n.matrix[i][j] = (this.matrix[i][j] * (1 - this.matrix[i][j]));
      }
    }
    return n;
  }

  removeBottomLayer() {
    let n = new Matrix(this.rows - 1, this.cols);
    for (let i = 0; i < n.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        n.matrix[i][j] = this.matrix[i][j];
      }
    }
    return n;
  }

  mutate(mutationRate) {

    //for each element in the matrix
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let rand = random(1)(float);
        if (rand < mutationRate) {//if chosen to be mutated
          this.matrix[i][j] += randomGaussian()/5;//add a random value to it(can be negative)

          //set the boundaries to 1 and -1
          if (this.matrix[i][j]>1) {
            this.matrix[i][j] = 1;
          }
          if (this.matrix[i][j] <-1) {
            this.matrix[i][j] = -1;
          }
        }
      }
    }
  }

  //returns a matrix which has a random number of vaules from this matrix and the rest from the parameter matrix
  crossover(partner) { //matrix
    let child = new Matrix(this.rows, this.cols);

    //pick a random point in the matrix
    let randC = floor(random(this.cols));
    let randR = floor(random(this.rows));
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {

        if ((i < randR)|| (i == randR && j <= randC)) { //if before the random point then copy from this matric
          child.matrix[i][j] = this.matrix[i][j];
        } else { //if after the random point then copy from the parameter array
          child.matrix[i][j] = partner.matrix[i][j];
        }
      }
    }
    return child;
  }

  clone() {
    let clone = new  Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        clone.matrix[i][j] = this.matrix[i][j];
      }
    }
    return clone;
  }

}
