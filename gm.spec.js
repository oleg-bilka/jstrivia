const fs = require('fs');

const seedrandom = require('seedrandom');

const launcher = './launcher.js';
delete require.cache[require.resolve(launcher)];

const empty = require('empty-folder');

const dircompare = require('dir-compare');

const goldenMasterPath = './golden_master_data';
const secondaryTestsPath = './secondary_data';

function launchGameWithOutputRedirect(playersCount, seed, path) {
  const outputFile = `${path}/playersCount_${playersCount}_diceSeed_${seed}.txt`;
  const outStream = fs.createWriteStream(outputFile, { flags: 'a' });
  seedrandom(seed, { global: true });
  const gMaster = require(launcher);
  return gMaster.launchGame(playersCount, outStream);
}

async function generateGoldenMaster(path) {
  const minPlayers = 3;
  const maxPlayers = 5;
  const maxSeed = 20;
  for (let playersCount = minPlayers; playersCount < maxPlayers + 1; playersCount += 1) {
    for (let seed = 1; seed < maxSeed + 1; seed += 1) {
      (await launchGameWithOutputRedirect(playersCount, seed, path));
    }
  }
}

describe('Golden master test', () => {
  /** This timeout required due to the fact we are redirecting console.log from our game session
       * to fs stream we do not have a way to ensure that all console logs are finished without modifying game code
       * however we do not want to do it in GM test. Another way is to spawn node processes for each game session however I don't like this sollution either.
       *
    */
  beforeAll((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    done();
  });

  beforeEach((done) => {
    done();
   //setTimeout(done, 900);
  });

  xit('should generate initial golden master data if its directory is empty', (done) => {
    const goldenMasterFolder = fs.readdirSync(goldenMasterPath);
    if (goldenMasterFolder.length < 3) {
      generateGoldenMaster(goldenMasterPath);
      done();
    }
    done();
  });


  it('Create New test results and compare it with initial Golden Master tests', (done) => {
    empty(secondaryTestsPath, false, (o) => {
      if (o.error) console.error(o.error);
      generateGoldenMaster(secondaryTestsPath);
      done();
    });
  });

  it('Should compare secondary test results folder with the golden master test data', (done) => {
    const options = {
      compareContent: true,
    };
    const res = dircompare.compareSync(goldenMasterPath, secondaryTestsPath, options);
    // console.info(res);
    expect(res.distinct).toBe(0);
    done();
  });
});
