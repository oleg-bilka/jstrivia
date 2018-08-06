/*eslint func-names: ["error", "never"] */

require('./game.js');

describe('The test environment', () => {
  it('should pass', (done) => {
    expect(true).toBe(true);
    done();
  });

  it('should access game', (done) => {
    expect(Game).toBeDefined();
    done();
  });
});

describe('Game logic', () => {
  beforeEach((done) => {
    spyOn(console, 'log');
    done();
  });

  const addPlayers = (n) => {
    const expectedOutput = [];
    const game = new Game();

    for (let i = 1; i < n + 1; i += 1) {
      const playerName = `player ${i}`;
      const playerAddedStr = [`${playerName} was added`];
      const playerNoStr = [`They are player number ${i}`];
      expectedOutput.push(playerAddedStr);
      expectedOutput.push(playerNoStr);
      game.add(playerName);
    }
    expect(console.log.calls.count()).toBe(n * 2);
    expect(console.log.calls.allArgs()).toEqual(expectedOutput);
  };

  it('Should add one new Player', () => {
    addPlayers(1);
  });

  it('Should add 10 new players', () => {
    addPlayers(10);
  });

  it('Should be playable after adding two players', () => {
    const game = new Game();
    game.add('Martin');
    game.add('Helen');
    expect(game.isPlayable(game.howManyPlayers())).toBe(true);
  });

  it('Should not be playable after adding one player', () => {
    let game = new Game();
    game.add('Helen');
    expect(game.isPlayable(game.howManyPlayers())).toBe(false);
  });

  it('Should not be playable after adding one player and checking isPlayable without parameters', () => {
    let game = new Game();
    game.add('Helen');
    expect(game.isPlayable(game.howManyPlayers())).toBe(false);
  });

  it('Should be able to roll the dice', () => {
    const game = new Game();
    const dice = 3;
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

  xit('Should be able to roll the dice', () => {
    const game = new Game();
    const playerPlace = 2;
    const rolledNumber = 1;
    $rolledNumber = 1;
    const game = new Game();
    game.add('Martin');
    game.add('Helen');
    game.roll(dice);
    expect(console.log.calls.allArgs()).toEqual(expectedOutput);
});
});
