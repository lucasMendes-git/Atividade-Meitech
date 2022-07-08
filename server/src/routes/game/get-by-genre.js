const db = require('../../db/mysql');

module.exports = function(req, res) {
  db.run('select count(*) as count, idGenre, genre.descript from game left join genre on genre.id = idGenre group by idGenre')
    .then(gamesByGenre => {
      return res.json(gamesByGenre);
    });
}