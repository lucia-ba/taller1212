let PeliculasData = []; // para guardar los datos de las películas

// Cargar la lista de películas
function CargarPeliculas() {
  const url = "https://japceibal.github.io/japflix_api/movies-data.json";
  
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la red');
      }
      return response.json();
    })
    .then(data => {
      PeliculasData = data;
    })
    .catch(error => {
      console.error('Hubo un problema con la solicitud fetch:', error);
    });
}

// Buscar películas
function BuscarPeliculas() {
  const query = document.getElementById("inputBuscar").value.toLowerCase();
  const results = PeliculasData.filter(movie => {
    return (
      movie.title.toLowerCase().includes(query) ||
      (movie.genres && movie.genres.some(genre => genre.name.toLowerCase().includes(query))) ||
      (movie.tagline && movie.tagline.toLowerCase().includes(query)) ||
      (movie.overview && movie.overview.toLowerCase().includes(query))
    );
  });

  displayResults(results);
}

// Mostrar los resultados
function displayResults(results) {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  if (results.length === 0) {
    lista.innerHTML = "<li class='list-group-item text-light'>No se encontraron películas.</li>";
    return;
  }

  results.forEach(movie => {
    const stars = '★'.repeat(Math.round(movie.vote_average));
    const movieItem = document.createElement("li");
    movieItem.className = "list-group-item text-light";
    movieItem.innerHTML = `
      <h5>${movie.title}</h5>
      <p><strong>Tagline:</strong> ${movie.tagline || "No disponible"}</p>
      <p><strong>Calificación:</strong> <span class="text-warning">${stars}</span></p>
    `;

// Mostrar detalles de la película
    movieItem.addEventListener("click", () => DetallesPeliculas(movie));

    lista.appendChild(movieItem);
  });
}

// Mostrar los detalles de la película
function DetallesPeliculas(movie) {
    document.getElementById("detailTitle").innerText = movie.title;
    document.getElementById("detailOverview").innerText = movie.overview || "No disponible";
    const genresList = document.getElementById("detailGenres");
    genresList.innerHTML = "";

// Muestra los géneros de la película
    if (movie.genres) {
      movie.genres.forEach(genre => {
        const genreItem = document.createElement("li");
        genreItem.innerText = genre.name;
        genresList.appendChild(genreItem);
      });
    }

    document.getElementById("movieDetails").style.display = "block";

//Detalles adicionales
    document.getElementById("releaseYear").innerText = new Date(movie.release_date).getFullYear();
    document.getElementById("duration").innerText = movie.runtime;
    document.getElementById("budget").innerText = movie.budget ? `$${movie.budget.toLocaleString()}` : "No disponible";
    document.getElementById("revenue").innerText = movie.revenue ? `$${movie.revenue.toLocaleString()}` : "No disponible";
  }

// Botón buscar
document.getElementById("btnBuscar").addEventListener("click", BuscarPeliculas);

// Para lista desplegable de detalles adicionales
document.getElementById("toggleDetailsBtn").addEventListener("click", () => {
    const additionalDetails = document.getElementById("additionalDetails");
    additionalDetails.style.display = additionalDetails.style.display === "none" ? "block" : "none";
  });

// Cargar películas al iniciar la página
window.onload = CargarPeliculas;