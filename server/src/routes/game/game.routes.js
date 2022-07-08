const { Router } = require('express');
const addRoute = require('./add');
const getAllRoute = require('./get-all');
const getByGenre = require('./get-by-genre');

const gameRoutes = Router();
gameRoutes.get('/all', getAllRoute);
gameRoutes.get('/by-genre', getByGenre);
gameRoutes.post('/add', addRoute);

module.exports = gameRoutes;