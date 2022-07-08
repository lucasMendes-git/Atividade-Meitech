const db = require('../../db/mysql');
const fs = require('fs');

const imagesDir = `${__dirname}/../../../db/images/`;

function getImage(gameId) {
  try {
    let buff = fs.readFileSync(`${imagesDir}${gameId}.png`);
    return buff.toString('base64');
  } catch (error) {
    return undefined
  }
}

module.exports = function(req, res) {
  db.run('select * from game')
    .then(allGames => {
      allGames.forEach(game => {
        game.img = getImage(game.id);
      })
      return res.json(allGames)
    });
}