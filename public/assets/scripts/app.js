const API_KEY = 'Sua chave aqui'; 
const BASE_URL = 'https://api.themoviedb.org/3';

// Função para buscar séries populares
async function fetchPopularSeries() {
  const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR`);
  if (!response.ok) {
    throw new Error('Erro ao buscar séries populares');
  }
  const data = await response.json();
  return data.results;
}

// Função para buscar novas séries
async function fetchNewSeries() {
  const response = await fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=pt-BR`);
  if (!response.ok) {
    throw new Error('Erro ao buscar novas séries');
  }
  const data = await response.json();
  return data.results;
}

// Função para buscar informações do usuário no JSON Server
async function fetchUserInfo() {
  const response = await fetch('http://localhost:3000/usuarios');
  if (!response.ok) {
    throw new Error('Erro ao buscar informações do usuário');
  }
  const user = await response.json();
  return user[0]; 
}

// Função para buscar séries favoritas do JSON Server
async function fetchFavoriteSeries() {
  const response = await fetch('http://localhost:3000/seriesFavoritas');
  if (!response.ok) {
    throw new Error('Erro ao buscar séries favoritas');
  }
  return await response.json();
}

// Função para buscar detalhes de uma série específica
async function fetchSerieDetails(id) {
  const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=pt-BR`);
  if (!response.ok) {
    throw new Error('Erro ao buscar detalhes da série');
  }
  return await response.json();
}

// Função para exibir o carrossel de séries populares
async function displayCarousel() {
  try {
    const series = await fetchPopularSeries();
    const carouselInner = document.getElementById('carrosel-series');
    const indicators = document.querySelector('.carousel-indicators');

    carouselInner.innerHTML = '';
    indicators.innerHTML = '';

    series.forEach((serie, index) => {
      const activeClass = index === 0 ? 'active' : '';
      carouselInner.innerHTML += `
      <div class="carousel-item ${activeClass}">
          <img src="${serie.poster_path ? `https://image.tmdb.org/t/p/w500${serie.poster_path}` : 'assets/img/default.jpg'}"
              class="d-block w-100 img-fluid" alt="${serie.name}" 
              style="object-fit: cover; height: 100%; ">
          <div class="carousel-caption d-none d-md-block">
              <h5>${serie.name}</h5>
              <p>${serie.overview}</p>
          </div>
      </div>`;

      indicators.innerHTML += `
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" 
                class="${activeClass}" aria-current="${activeClass}" aria-label="Slide ${index + 1}"></button>`;
    });

    // Ativar o carrossel automaticamente 
    const carouselElement = document.getElementById('carouselExampleIndicators');
    const carouselInstance = new bootstrap.Carousel(carouselElement, {
      interval: 3000, // Tempo em milissegundos entre as transições (3 segundos)
      ride: 'carousel' 
    });

  } catch (error) {
    console.error(error.message);
  }
}

// Função para exibir novas séries
async function displayNewSeries() {
  try {
    const series = await fetchNewSeries();
    const novasSeriesSection = document.getElementById('novas-series-cards');

    novasSeriesSection.innerHTML = '';

    series.slice(0, 8).forEach(serie => {
      novasSeriesSection.innerHTML += `
              <div class='col'>
                  <div class='card h-100'> <!-- h-100 para manter a altura igual -->
                      <img src="${serie.poster_path ? `https://image.tmdb.org/t/p/w500${serie.poster_path}` : 'assets/img/default.jpg'}"
                           class='card-img-top' alt='${serie.name}'>
                      <div class='card-body'>
                          <h5 class='card-title'>${serie.name}</h5>
                          <p class='card-text'>${serie.overview}</p>
                          <a href='detalhes.html?id=${serie.id}' class='btn btn-primary'>Ver Detalhes</a>
                      </div>
                  </div>
              </div>`;
    });

  } catch (error) {
    console.error(error.message);
  }
}

// Função para exibir informações do autor
async function displayUserInfo() {
  try {
    const user = await fetchUserInfo();

    const infoAutorSection = document.getElementById('info-autor');

    infoAutorSection.innerHTML = `
          <div class='card-body text-center'>
              <img class='avatar-img rounded-circle' src="${user.avatar || 'assets/img/default_avatar.jpg'}" alt="${user.nome}" style="width: 150px; height: 150px;"> <!-- Imagem do aluno -->
              <h5 class='mt-3'>${user.nome}</h5> 
              <p><strong>Curso:</strong> ${user.curso}</p>
              <p><strong>Bio:</strong> ${user.bio}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Facebook:</strong> <a href="${user.facebook}" target="_blank">${user.facebook}</a></p>
              <p><strong>Twitter:</strong> <a href="${user.twitter}" target="_blank">${user.twitter}</a></p>
          </div>`;
  } catch (error) {
    console.error(error.message);
  }
}

// Função para exibir séries favoritas
async function displayFavoriteSeries() {
  try {
    const favorites = await fetchFavoriteSeries();

    const seriesFavoritasSection = document.getElementById('favoritas-cards');

    seriesFavoritasSection.innerHTML = '';

    if (favorites.length === 0) {
      document.getElementById('no-favorites-message').style.display = 'block'; // Mostra mensagem se não houver favoritos
      return;
    }

    for (const favorite of favorites) {
      const serieDetails = await fetchSerieDetails(favorite.serieId);

      seriesFavoritasSection.innerHTML += `
              <div class='col'>
                  <div class='card h-100'>
                      <img src="${serieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${serieDetails.poster_path}` : 'assets/img/default.jpg'}"
                           alt='${serieDetails.name}' />
                      <div class='card-body'>
                          <h5>${serieDetails.name}</h5>
                          <p>${serieDetails.overview}</p>
                          <a href='detalhes.html?id=${favorite.serieId}' class='btn btn-primary'>Ver Detalhes</a>
                      </div>
                  </div>
              </div>`;
    }

    document.getElementById('no-favorites-message').style.display = 'none'; // Esconde a mensagem se houver favoritos
  } catch (error) {
    console.error(error.message);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await displayCarousel();
  await displayNewSeries();
  await displayUserInfo();
  await displayFavoriteSeries();
});