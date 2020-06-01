class Population {

  constructor(size) {
    this.players = new Array(size);
    for (let i = 0; i < players.length; i++) {
      players[i] = new Player();
    }

    this.generation = 0;
    this.bestPlayerIndex;
    this.bestPlayer;
    this.bestScore;
  }

  updateAlive() {

    for (let i = 0; i < this.players.length; i++) {
      if (!this.players[i].dead) {
        this.players[i].look();//get inputs for brain
        this.players[i].think();//use outputs from neural network
        this.players[i].update();//move the player according to the outputs from the neural network
        if (!showBest || i ==0) {//dont show dead players
          this.players[i].show();
        }
      }
    }
  }

  setBestPlayer() {
    //get max fitness
    let max =0;
    let maxIndex = 0;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].fitness > max) {
        max = this.players[i].fitness;
        maxIndex = i;
      }
    }

    this.bestPlayerIndex = maxIndex;
    //if best this gen is better than the global best score then set the global best as the best this gen

    if (this.players[this.bestPlayerIndex].score > this.bestScore) {
      this.bestScore = this.players[this.bestPlayerIndex].score;
      this.bestPlayer = this.players[this.bestPlayerIndex].cloneForReplay();
    }
  }

  done() {
    for (let i = 0; i < this.players.length; i++) {
      if (!this.players[i].isDead) {
        return false;
      }
    }
    return true;
  }

  naturalSelection() {
    let newPlayers = new Array(players.length);//Create new players array for the next generation

    setBestPlayer();//set which player is the best

    newPlayers[0] = this.players[this.bestPlayerIndex].cloneForReplay();//add the best player of this generation to the next generation without mutation
    for (let i = 1; i < this.players.length; i++) {
      //for each remaining spot in the next generation
      if (i < this.players.length/2) {
        newPlayers[i] = selectPlayer().clone();//select a random player(based on fitness) and clone it
      }
      else {
        newPlayers[i] = selectPlayer().crossover(selectPlayer());
      }
      newPlayers[i].mutate(); //mutate it
    }

    this.players = newPlayers.clone();
    this.generation += 1;
  }

  selectPlayer() {
    //this function works by randomly choosing a value between 0 and the sum of all the fitnesses
    //then go through all the players and add their fitness to a running sum and if that sum is greater than the random value generated that player is chosen
    //since players with a higher fitness function add more to the running sum then they have a higher chance of being chosen


    //calculate the sum of all the fitnesses
    let fitnessSum = 0;
    for (let i = 0; i < this.players.length; i++) {
      fitnessSum += this.players[i].fitness;
    }
    let rand = floor(random(fitnessSum));
    //summy is the current fitness sum
    let runningSum = 0;

    for (let i = 0; i < this.players.length; i++) {
      runningSum += this.players[i].fitness;
      if (runningSum > rand) {
        return this.players[i];
      }
    }
    //unreachable code to make the parser happy
    return this.players[0];
  }

  //mutates all the players
  mutate() {
    for (let i = 1; i < this.players.length; i++) {
      this.players[i].mutate();
    }
  }

  calculateFitness() {
    for (let i = 1; i < this.players.length; i++) {
      this.players[i].calculateFitness();
    }
  }

}
