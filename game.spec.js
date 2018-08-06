require('./game.js');

describe('The test environment', function () {
    it('should pass', function (done) {
        expect(true).toBe(true);
        done();
    });

    it('should access game', function (done) {
        expect(Game).toBeDefined();
        done();
    });
});


describe('Game logic', function () {

    beforeEach(function (done) {
        spyOn(console, 'log');
        done();
    });

    function addPlayers(n) {
        const expectedOutput = [];
        const game = new Game();

        for (var i = 1; i < n + 1; i++) {
            var playerName = 'player' + i;
            var playerAddedStr = [playerName + ' was added'];
            var playerNoStr = ['They are player number ' + i];
            expectedOutput.push(playerAddedStr);
            expectedOutput.push(playerNoStr);
            game.add(playerName);
        }
        expect(console.log.calls.count()).toBe(n * 2);
        expect(console.log.calls.allArgs()).toEqual(expectedOutput);
    }

    it('Should add one new Player', function () {
        addPlayers(1);
    });

    it('Should add ten players', function () {
        addPlayers(10);
    });

    it('Should be playable after adding two players', function () {
        var game = new Game();
        game.add('Martin');
        game.add('Helen');
        expect(game.isPlayable(game.howManyPlayers())).toBe(true);
    });

    it('Should not be playable after adding one player', function () {
        var game = new Game();
        game.add('Helen');
        expect(game.isPlayable(game.howManyPlayers())).toBe(false);
    });

    it('Should not be playable after adding one player and checking isPlayable without parameters', function () {
        var game = new Game();
        game.add('Helen');
        expect(game.isPlayable(game.howManyPlayers())).toBe(false);
    });

    it('Should be able to roll the dice', function () {
        var game = new Game();
        var dice = 3;
        const expectedOutput = [['Martin was added'],
        ['They are player number 1'],
        ['Helen was added'],
        ['They are player number 2'],
        ['Martin is the current player'],
        ['They have rolled a ' + dice],
        ['Martin\'s new location is ' + dice],
        ['The category is Rock'],
        ['Rock Question 0']];

        game.add('Martin');
        game.add('Helen');
        game.roll(dice);
        expect(console.log.calls.allArgs()).toEqual(expectedOutput);
    });
});
