
require('./game.js');

exports.launchGame = (playersCount, outStream) => {

  const isCorrectlyAnswered = () => {
    const maxAnswerId = 10;
    const wrongAnswerId = 7;
    return Math.floor(Math.random() * maxAnswerId) !== wrongAnswerId;
  };

  const cl = console.log;
  console.log = (...args) => {
    outStream.write(args.join(''));
  };

  const hasSomebodyWon = (game, winCriterion) =>{
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
  outStream.end();
  console.log = cl;
};
