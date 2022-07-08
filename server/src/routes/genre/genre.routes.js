const { Router } = require('express');
const getAllRoute = require('./get-all');
const addRoute = require('./add');

const genreRoutes = Router();
genreRoutes.get('/all', getAllRoute);
genreRoutes.post('/add', addRoute);

module.exports = genreRoutes;