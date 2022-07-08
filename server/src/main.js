const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors')
const gameRouter = require('./routes/game/game.routes')
const genreRouter = require('./routes/genre/genre.routes')

const app = express();
app.use(express.json({ limit: '5mb' })); // limite do tamanho da imagem
app.use(cors())
app.use('/game', gameRouter);
app.use('/genre', genreRouter);

app.listen(process.env['PORT'], () => console.log('listening on ' + process.env['PORT']));