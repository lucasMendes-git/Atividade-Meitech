const db = require('../../db/mysql');
const fs = require('fs');

const imagesDir = `${__dirname}/../../../db/images/`;

function saveImage(image, gameId) {
  if (!fs.existsSync(imagesDir)){
    fs.mkdirSync(imagesDir);
  }
  
  fs.writeFileSync(`${imagesDir}${gameId}.png`, image, 'base64');
}

function getImage(gameId) {
  try {
    let buff = fs.readFileSync(`${imagesDir}${gameId}.png`);
    return buff.toString('base64');
  } catch (error) {
    return undefined
  }
}

module.exports = function(req, res) {
  db.run(
    "INSERT INTO game(idGenre, descript, style, price, dev) VALUES (?, ?, ?, ?, ?)",
    [req.body.idGenre, req.body.descript, req.body.style, req.body.price, req.body.dev]
  ).then(({ insertId }) => {
    if (req.body.img) {
      saveImage(req.body.img, insertId);
    }

    db.run('select * from game where id = ?', [insertId])
      .then(([newRecord]) => {
        const image = getImage(insertId)
        if (image) {
          newRecord.img = image;
        }
        return res.json(newRecord)
      });
  }).catch(err => res.status(400).send(err))
}