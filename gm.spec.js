const fs = require('fs');

const seedrandom = require('seedrandom');

const launcher = './launcher.js';

const spawn = require('child_process').spawn;

const goldenMasterPath = './golden_master_data';

function roll(diceSeed) {
  const pseudoRandomNumber = seedrandom(diceSeed)();
  return Math.floor(pseudoRandomNumber * 6) + 1;
}

function launchGameWithOutputRedirect(playersCount, diceSeed) {
  const outputFile = `${goldenMasterPath}/playersCount_${playersCount}_diceSeed_${diceSeed}.txt`
  const goldenMaster = fs.createWriteStream(outputFile);
  const diceRoll = roll(diceSeed);
  const gMaster = spawn('node', [launcher, playersCount, diceRoll]);
  gMaster.stdout.pipe(goldenMaster);
}

function generateGoldenMaster() {
  const minPlayers = 3;
  const maxPlayers = 5;
  const maxSeed = 20;
  for (let playersCount = minPlayers; playersCount < maxPlayers + 1; playersCount += 1) {
    for (let seed = 1; seed < maxSeed + 1; seed += 1) {
      launchGameWithOutputRedirect(playersCount, seed);
    }
  }
}

describe('Golden master test', () => {
  it('should generate golden master data', () => {
    const goldenMasterFolder = fs.readdirSync(goldenMasterPath);
    if (goldenMasterFolder.length < 3) {
      generateGoldenMaster();
    }
  });
});
