
require('./game.js');

exports.launchGame = (playersCount, outStream) => {

    const isCorrectlyAnswered = () => {
        const maxAnswerId = 10;
        const wrongAnswerId = 7;
        return Math.floor(Math.random() * maxAnswerId) !== wrongAnswerId;
    } 

    var cl = console.log
    console.log = function(...args){
        outStream.write(args.join(''));
        //cl.apply(console, args)
    }

    const hasSomebodyWon = (game, winCriterion) =>{
        if (winCriterion())  {
            return game.wasCorrectlyAnswered();
       } else {
           return game.wrongAnswer();
       }
    }
    
    var game = new Game();

    // Generate players
    for (let playerNum = 0; playerNum < playersCount; playerNum += 1) {
        var playerName = 'player_' + playerNum;
        game.add(playerName);
    }
    do {
        const diceRollResult =  Math.floor(Math.random() * 6) + 1;
        game.roll(diceRollResult);
      
    } while (hasSomebodyWon(game, isCorrectlyAnswered));
    outStream.end();
    console.log = cl;
    return;
}