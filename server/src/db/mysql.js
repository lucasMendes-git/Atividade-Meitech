const mysql = require('mysql');

function createConnection() {
  return mysql.createConnection({
    host: process.env['DB_HOST'],
    user: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_NAME']
  });
}

function run(command, parameters) {
  return new Promise((resolve, reject) => {
    const connection = createConnection();
    connection.query(command, parameters, (error, results) => {
      if (error) {
        reject(error)
      } else {
        resolve(results);
      }

      connection.end();
    });
  })
}

module.exports = {
  run
}