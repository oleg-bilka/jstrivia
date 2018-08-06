
/*eslint func-names: ["error", "never"]*/ 
exports = typeof window !== 'undefined' && window !== null ? window : global;

exports.Game = function () {
  const questionCategorySize = 50;
  const coinsToWin = 6;

  const players = [];
  const places = [];
  const purses = [];
  const inPenaltyBox = [];

  const category = {
    Pop: [],
    Science: [],
    Sports: [],
    Rock: [],
  };

  let currentPlayer = 0;
  let isGettingOutOfPenaltyBox = false;

  //* Populate question topics */
  for (let i = 0; i < questionCategorySize; i += 1) {
    Object.keys(category).map((topic) => {
      category[topic].push(`${topic} Question ${i}`);
    });
  }

  //* Private Methods */
  const currentCategory = () => {
    const popCategory = 'Pop';
    const scienceCategory = 'Science';
    const sportsCategory = 'Sports';
    const rockCategory = 'Rock';
    const categoriesMap = new Map([
      [0, popCategory],
      [1, scienceCategory],
      [2, sportsCategory],
      [4, popCategory],
      [5, scienceCategory],
      [6, sportsCategory],
      [8, popCategory],
      [9, scienceCategory],
      [10, sportsCategory],
    ]);
    if (categoriesMap.has(places[currentPlayer])) {
      return categoriesMap.get(places[currentPlayer]);
    }
    return rockCategory;
  };

  const didPlayerWin = function () {
    return !(purses[currentPlayer] === coinsToWin);
  };

  const isOdd = num => num % 2 !== 0;
  const needToResetCurrentPlayer = () => currentPlayer === players.length;
  const playerShouldStartANewLap = boardLastPosition => places[currentPlayer] > boardLastPosition;
  const playerIsEligableForGold = () => !inPenaltyBox[currentPlayer]
                                       || (inPenaltyBox[currentPlayer] && isGettingOutOfPenaltyBox);

  const askQuestion = function () {
    const question = category[currentCategory()].shift();
    console.log(question);
  };

  //* Public Methods */
  this.isPlayable = function (howManyPlayers) {
    const minimumNumberOfPlayers = 2;
    return howManyPlayers >= minimumNumberOfPlayers;
  };

  this.add = function (playerName) {
    players.push(playerName);
    places[this.howManyPlayers() - 1] = 0;
    purses[this.howManyPlayers() - 1] = 0;
    inPenaltyBox[this.howManyPlayers() - 1] = false;
    console.log(`${playerName} was added`);
    console.log(`They are player number ${players.length}`);
    return true;
  };

  this.howManyPlayers = function () {
    return players.length;
  };

  this.movePlayer = (boardSize, rolledNum) => {
    const boardLastPosition = boardSize - 1;
    places[currentPlayer] += rolledNum;
    if (playerShouldStartANewLap(boardLastPosition)) {
      places[currentPlayer] -= boardSize;
    }
  };

  this.selectNextPlayer = () => {
    currentPlayer += 1;
    if (needToResetCurrentPlayer()) {
      currentPlayer = 0;
    }
  };

  this.logPlayerNewLocation = () => {
    console.log(`${players[currentPlayer]}'s new location is ${places[currentPlayer]}`);
  };

  this.logPlayerCurrentCategory = () => {
    console.log(`The category is ${currentCategory()}`);
  };

  this.logCurrentPlayer = () => {
    console.log(`${players[currentPlayer]} is the current player`);
  };

  this.logRolledNum = (rolledNum) => {
    console.log(`They have rolled a ${rolledNum}`);
  };

  this.logIfPlayerGettingOutOfPenaltyBox = (isGettingOut) => {
    console.log(`${players[currentPlayer]} is ${isGettingOut ? '' : 'not '}getting out of the penalty box`);  
  };

  this.roll = function (rolledNum) {
    this.logCurrentPlayer();
    this.logRolledNum(rolledNum);

    const boardSize = 12;
    if (inPenaltyBox[currentPlayer]) {
      if (isOdd(rolledNum)) {
        isGettingOutOfPenaltyBox = true;
        this.logIfPlayerGettingOutOfPenaltyBox(isGettingOutOfPenaltyBox);
        this.movePlayer(boardSize, rolledNum);
        this.logPlayerNewLocation();
        this.logPlayerCurrentCategory();
        askQuestion();
      } else {
        isGettingOutOfPenaltyBox = false;
        this.logIfPlayerGettingOutOfPenaltyBox(isGettingOutOfPenaltyBox);
      }
    } else {
      this.movePlayer(boardSize, rolledNum);
      this.logPlayerNewLocation();
      this.logPlayerCurrentCategory();
      askQuestion();
    }
  };

  const gainGoldForCorrectAnswer = () => {
    purses[currentPlayer] += 1;
    console.log('Answer was correct!!!!');
    console.log(`${players[currentPlayer]} now has ${purses[currentPlayer]} Gold Coins.`);
  };

  this.selectNextPlayerAfterAnswerDecorator = function (answerFunc) {
    const self = this;
    return function () {
      const value = answerFunc();
      self.selectNextPlayer();
      return value;
    };
  };

  // This function is exposed with selectNextPlayerAfterAnswerDecorator
  const wasCorrectlyAnswered = function () {
    if (playerIsEligableForGold()) {
      gainGoldForCorrectAnswer();
      return didPlayerWin();
    }
    return true;
  };

  // This function is exposed with selectNextPlayerAfterAnswerDecorator
  const wrongAnswer = function () {
    console.log('Question was incorrectly answered');
    console.log(`${players[currentPlayer]} was sent to the penalty box`);
    inPenaltyBox[currentPlayer] = true;
    return true;
  };

  this.wasCorrectlyAnswered = this.selectNextPlayerAfterAnswerDecorator(wasCorrectlyAnswered);
  this.wrongAnswer = this.selectNextPlayerAfterAnswerDecorator(wrongAnswer);
};
