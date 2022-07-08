const db = require('../../db/mysql');

module.exports = function(req, res) {
  db.run('select * from genre')
    .then(allGenres => {
      return res.json(allGenres)
    });
}