
require('./game.js');
const helper = require('./helper.js');

exports.launchGame = (playersCount, outStream = null) => {
  const cl = console.log;
 
  const isCorrectlyAnswered = () => {
    const maxAnswerId = 10;
    const wrongAnswerId = 7;
    return Math.floor(Math.random() * maxAnswerId) !== wrongAnswerId;
  };

  // Helper function for Golden Master Test
  const setupConsoleRedirect = () => {
    console.log = (...args) => {
      outStream.write(args.join(''));
    };
  };

  const tearDownConsoleRedirect = () => {
    console.log = cl;
    outStream.end();
    return helper.streamPromise(outStream);
  };

  // Helper functiom for Golden Master Test
  if (outStream) {
    setupConsoleRedirect();
  }

  const hasSomebodyWon = (game, winCriterion) => {
    if (winCriterion()) {
      return game.wasCorrectlyAnswered();
    }
    return game.wrongAnswer();
  };
  let game = new Game();
  // Generate players
  for (let playerNum = 0; playerNum < playersCount; playerNum += 1) {
    const playerName = `player_${playerNum}`;
    game.add(playerName);
  }
  do {
    const diceRollResult = Math.floor(Math.random() * 6) + 1;
    game.roll(diceRollResult);
  } while (hasSomebodyWon(game, isCorrectlyAnswered));
  if (outStream) return tearDownConsoleRedirect();
};

exports.startGame = () => {
  this.launchGame(5);
};
