const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env['DB_HOST'],
  user: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_NAME'],
  multipleStatements: true
});

const setupFile = fs.readFileSync(`${__dirname}/db-schema.sql`).toString();
db.query(setupFile);
db.end();

// fs.rmdirSync(`${__dirname}\\images`, { recursive: true, force: true });

console.log('DB setup succesfully');