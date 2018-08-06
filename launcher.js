
require('./game.js');

exports.launchGame = (playersCount, outStream) => {

    const maxAnswerId = 10;
    const wrongAnswerId = 7;

    var cl = console.log
    console.log = function(...args){
        outStream.write(args.join(''));
        //cl.apply(console, args)
    }
    
    var notAWinner = false;
    var game = new Game();

    // Generate players
    for (let playerNum = 0; playerNum < playersCount; playerNum += 1) {
        var playerName = 'player_' + playerNum;
        game.add(playerName);
    }
    do {
        const diceRollResult =  Math.floor(Math.random() * 6) + 1;
        const answerGiven = Math.floor(Math.random() * maxAnswerId);
        game.roll(diceRollResult);
        if (answerGiven=== wrongAnswerId) {
            notAWinner = game.wrongAnswer();
        } else {
            notAWinner = game.wasCorrectlyAnswered();
        }
    } while (notAWinner);
    outStream.end();
    console.log = cl;
    return;
}