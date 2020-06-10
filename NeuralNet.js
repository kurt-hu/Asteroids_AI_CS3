class NeuralNet {

  //constructor
  constructor(inputs, hiddenNo, outputNo) {

    //set dimensions from parameters
    this.iNodes = inputs; //No. of input nodes
    this.oNodes = outputNo; //No. of hidden nodes
    this.hNodes = hiddenNo; //No. of output nodes


    //create first layer weights
    //included bias weight
    this.whi = new Matrix(this.hNodes, this.iNodes + 1);//matrix containing weights between the input nodes and the hidden nodes

    //create second layer weights
    //include bias weight
    this.whh = new Matrix(this.hNodes, this.hNodes + 1);//matrix containing weights between the hidden nodes and the second layer hidden nodes

    //create second layer weights
    //include bias weight
    this.woh = new Matrix(this.oNodes, this.hNodes +1 );  //matrix containing weights between the second hidden layer nodes and the output nodes
    //set the matricies to random values
    this.whi.randomize();
    this.whh.randomize();
    this.woh.randomize();
  }


  //mutation function for genetic algorithm
  mutate(mutationRate) {
    //mutates each weight matrix
    this.whi.mutate(mutationRate);
    this.whh.mutate(mutationRate);
    this.woh.mutate(mutationRate);
  }


  //calculate the output values by feeding forward through the neural network
  output(inputsArr) {  //array of floats

    //convert array to matrix
    //Note woh has nothing to do with it its just a function in the Matrix class
    let inputs = this.woh.singleColumnMatrixFromArray(inputsArr);

    //add bias
    let inputsBias = inputs.addBias();


    //-----------------------calculate the guessed output
    //apply layer one weights to the inputs
    let hiddenInputs = this.whi.dot(inputsBias);

    //pass through activation function(sigmoid)
    let hiddenOutputs = hiddenInputs.activate();

    //add bias
    let hiddenOutputsBias = hiddenOutputs.addBias();

    //apply layer two weights
    let hiddenInputs2 = this.whh.dot(hiddenOutputsBias);
    let hiddenOutputs2 = hiddenInputs2.activate();
    let hiddenOutputsBias2 = hiddenOutputs2.addBias();

    //apply level three weights
    let outputInputs = this.woh.dot(hiddenOutputsBias2);
    //pass through activation function(sigmoid)
    let outputs = outputInputs.activate();

    //convert to an array and return
    return outputs.toArray();
  }

  //crossover funciton for genetic algorithm
  crossover(partner) {// partner is a NeuralNet

    //creates a new child with layer matricies from both parents
    let child = new NeuralNet(this.iNodes, this.hNodes, this.oNodes);
    child.whi = this.whi.crossover(partner.whi);
    child.whh = this.whh.crossover(partner.whh);
    child.woh = this.woh.crossover(partner.woh);
    return child;
  }

  //return a neural net whihc is a clone of this Neural net
  clone() {
    let clone  = new NeuralNet(this.iNodes, this.hNodes, this.oNodes);
    clone.whi = this.whi.clone();
    clone.whh = this.whh.clone();
    clone.woh = this.woh.clone();

    return clone;
  }

  //converts the weights matricies to a single table
  //used for storing the snakes brain in a file
  netToTable() {

    //create table
    let t = new p5.Table();


    //convert the matricies to an array
    let whiArr = this.whi.toArray();
    let whhArr = this.whh.toArray();
    let wohArr = this.woh.toArray();

    //set the amount of columns in the table
    for (let i = 0; i < max(new Array(whiArr.length, whhArr.length, wohArr.length)); i++) {
      t.addColumn();
    }

    //set the first row as whi
    let tr = t.addRow();

    for (let i = 0; i< whiArr.length; i++) {
      tr.setNum(i, whiArr[i]);
    }


    //set the second row as whh
    tr = t.addRow();

    for (let i = 0; i< whhArr.length; i++) {
      tr.setNum(i, whhArr[i]);
    }

    //set the third row as woh
    tr = t.addRow();

    for (let i = 0; i< wohArr.length; i++) {
      tr.setNum(i, wohArr[i]);
    }

    //return table
    return t;
  }


  //takes in table as parameter and overwrites the matricies data for this neural network
  //used to load snakes from file
  tableToNet(t) {

    //create arrays to tempurarily store the data for each matrix
    let whiArr = new Array(this.whi.rows * this.whi.cols);
    let whhArr = new Array(this.whh.rows * this.whh.cols);
    let wohArr = new Array(this.woh.rows * this.woh.cols);

    //set the whi array as the first row of the table
    let tr = t.getRow(1);
    print(tr)

    for (let i = 0; i< whiArr.length; i++) {
      whiArr[i] = tr.getNum(i);
    }


    //set the whh array as the second row of the table
    tr = t.getRow(2);

    for (let i = 0; i< whhArr.length; i++) {
      whhArr[i] = tr.getNum(i);
    }

    //set the woh array as the third row of the table

    tr = t.getRow(3);

    for (let i = 0; i< wohArr.length; i++) {
      wohArr[i] = tr.getNum(i);
    }


    //convert the arrays to matricies and set them as the layer matricies
    whi.fromArray(whiArr);
    whh.fromArray(whhArr);
    woh.fromArray(wohArr);
  }

}
