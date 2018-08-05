

exports.launchGame = (playersCount, outStream) => {

    var cl = console.log
    console.log = function(...args){
        outStream.write(args.join(''));
        //cl.apply(console, args)
    }
    
    require('./game.js');
    var notAWinner = false;
    var game = new Game();
    // Generate players
    for (let playerNum = 0; playerNum < playersCount; playerNum += 1) {
        var playerName = 'player_' + playerNum;
        game.add(playerName);
    }
    do {
        game.roll(Math.floor(Math.random() * 6) + 1);
        if (Math.floor(Math.random() * 10) === 7) {
            notAWinner = game.wrongAnswer();
        } else {
            notAWinner = game.wasCorrectlyAnswered();
        }
    } while (notAWinner);
    outStream.end();
    console.log = cl;
    return;
}