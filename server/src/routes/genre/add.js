const db = require('../../db/mysql');

module.exports = function(req, res) {
  db.run("INSERT INTO genre(descript) values(?)", [req.body.descript])
    .then(({ insertId }) => {
      db.run('select * from genre where id = ?', [insertId])
        .then(newRecord => {
          return res.json(newRecord)
        });
    })
    .catch(err => res.status(400).send(err))
}