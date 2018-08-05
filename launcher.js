function launchGame(playersCount, diceRoll) {
    require('./game.js');
    var notAWinner = false;
    var game = new Game();
    // Generate players
    for (let playerNum = 0; playerNum < playersCount; playerNum += 1) {
        var playerName = 'player_' + playerNum;
        game.add(playerName);
    }
    do {
        game.roll(diceRoll || Math.floor(Math.random() * 6) + 1);
        if (Math.floor(Math.random() * 10) === 7) {
            notAWinner = game.wrongAnswer();
        } else {
            notAWinner = game.wasCorrectlyAnswered();
        }
    } while (notAWinner);
    process.exit();
}

launchGame(process.argv[2], process.argv[3]);