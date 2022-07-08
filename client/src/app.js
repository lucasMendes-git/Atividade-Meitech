import Chart from 'chart.js/auto';

const listContainer = document.getElementById('list-container');
const newGameFormContainer = document.getElementById('new-game-form-container');
const newGenreFormContainer = document.getElementById('new-genre-form-container');
const graphContainer = document.getElementById('graph-container');

const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const genreForm = document.getElementById('genre-form');
genreForm.addEventListener('submit', handleGenreSubmit)

const gameForm = document.getElementById('game-form');
gameForm.addEventListener('submit', handleGameSubmit);

window.addEventListener('load', handlePageLoad);

async function drawGraph() {
  const data = await (await fetch('http://localhost:8080/game/by-genre')).json();
  const canvas = document.getElementById('myChart');
  const noRecordsPlaceholder = document.getElementById('graph-no-records-placeholder');
  
  if (!data.length) {
    noRecordsPlaceholder.classList.remove('hidden');
    canvas.classList.add('hidden')
    return;
  }

  noRecordsPlaceholder.classList.add('hidden');
  canvas.classList.remove('hidden')
  new Chart(canvas, {
    type: 'bar',
    data: {
        labels: data.map(d => d.descript),
        datasets: [{
            label: 'Quantidade Jogos por Genero',
            data: data.map(d => d.count),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
          y: {
              beginAtZero: true,
          }
      }
    }
  });
}

async function handleGameSubmit(event) {
  event.preventDefault();

  const body = {};
  body.descript = document.getElementById('game-descript').value;
  body.idGenre = document.getElementById('game-genre-select').value;
  body.dev = document.getElementById('game-dev').value;
  body.price = document.getElementById('game-price').value;
  body.style = document.getElementById('game-style').value;
  body.img = await imageAsBase64(document.getElementById('game-image').files[0]);

  fetch('http://localhost:8080/game/add', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json'
    }
  })
  .then(() => {
    alert('Salvo com sucesso!');
    gameForm.reset();
  })
  .catch(() => {
    alert('Erro ao salvar');
  })
}

function handleGenreSubmit(event) {
  event.preventDefault()
  const body = {};
  body.descript = document.getElementById('genre-descript').value;

  fetch('http://localhost:8080/genre/add', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json'
    }
  })
  .then(() => {
    alert('Salvo com sucesso!');
    genreForm.reset();
  })
  .catch(() => {
    alert('Erro ao salvar');
  })
}

function handlePageLoad() {
  switch (window.location.pathname) {
    case '/list':
      setTableRows();
      newGameFormContainer.classList.add('hidden');
      newGenreFormContainer.classList.add('hidden');
      graphContainer.classList.add('hidden');
      listContainer.classList.remove('hidden');
      break;
    case '/graph':
      drawGraph().then(() => {
        newGameFormContainer.classList.add('hidden');
        newGenreFormContainer.classList.add('hidden');
        listContainer.classList.add('hidden');
        graphContainer.classList.remove('hidden');
      });
      break;
    case '/add-game':
      getAllGenres().then(() => {
        graphContainer.classList.add('hidden');
        listContainer.classList.add('hidden');
        newGenreFormContainer.classList.add('hidden');
        newGameFormContainer.classList.remove('hidden');
      });
      break;
    case '/add-genre':
      graphContainer.classList.add('hidden');
      listContainer.classList.add('hidden');
      newGameFormContainer.classList.add('hidden');
      newGenreFormContainer.classList.remove('hidden');
      break;
    default:
      window.location.href = 'list';
  }
}

function getAllGames() {
  return fetch('http://localhost:8080/game/all')
    .then(response => response.json())
}

function getAllGenres() {
  return fetch('http://localhost:8080/genre/all')
    .then(response => response.json())
    .then(allGenres => {
      setGenreOptions(allGenres);
      return allGenres;
    });
}

async function setTableRows() {
  const [ gameList, genreList ] = await Promise.all([getAllGames(), getAllGenres()]);
  const tableBody = document.getElementById('game-table-body');
  const tablePlaceholder = document.getElementById('table-no-records-placeholder');
  tableBody.innerHTML = '';
  
  if (gameList.length) {
    tablePlaceholder.classList.add('hidden');
  } else {
    tablePlaceholder.classList.remove('hidden');
  }

  gameList.forEach(game => {
    const gameGenre = genreList.find(genre => genre.id === game.idGenre).descript;

    const tableRow = document.createElement('tr');
    
    const imageCell = document.createElement('td');
    if (game.img) {
      const image = document.createElement('img');
      image.src = `data:image/png;base64,${game.img}`
      imageCell.append(image);
    }
    tableRow.append(imageCell);

    const idCell = document.createElement('td');
    idCell.innerText = game.id;
    tableRow.append(idCell);

    const descCell = document.createElement('td');
    descCell.innerText = game.descript;
    tableRow.append(descCell);

    const devCell = document.createElement('td');
    devCell.innerText = game.dev;
    tableRow.append(devCell);

    const genreCell = document.createElement('td');
    genreCell.innerText = gameGenre;
    tableRow.append(genreCell);

    const styleCell = document.createElement('td');
    styleCell.innerText = game.style;
    tableRow.append(styleCell);

    const priceCell = document.createElement('td');
    priceCell.innerText = brlFormatter.format(game.price);
    tableRow.append(priceCell);

    tableBody.append(tableRow);
  });
}

function setGenreOptions(allGenres) {
  const genreSelect = document.getElementById('game-genre-select');
  genreSelect.innerHTML = '';
  
  allGenres.forEach(genre => {
    genreOption = document.createElement('option');
    genreOption.value = genre.id;
    genreOption.innerHTML = genre.descript;
    genreSelect.append(genreOption);
  })
}

function imageAsBase64(imageFile) {
  return new Promise(resolve => {
    var reader = new FileReader();
    reader.onloadend = function () {
      const result = reader.result;
      const pngBase = 'data:image/png;base64,';
      const jpegBase = 'data:image/jpeg;base64,';
      const jpgBase = 'data:image/jpg;base64,';
      if (result.startsWith(pngBase)) {
        resolve(result.split(pngBase)[1])
      } else if (result.startsWith(jpegBase)) {
        resolve(result.split(jpegBase)[1])
      } else if (result.startsWith(jpgBase)) {
        resolve(result.split(jpgBase)[1])
      } else {
        resolve(reader.result);
      }

    };
    reader.readAsDataURL(imageFile);
  })
}