let searchField = document.getElementById('search');
let searchButton = document.getElementsByTagName('button')[0];

const movies = [];

searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (searchField.value === '') {
        searchField.setAttribute('style', 'border: 2px solid red;');
        return;
    } else {
        searchField.removeAttribute('style');
    }

    fetch(`https://omdb-api.now.sh/?s=${searchField.value}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            data.Search.forEach((movie) => {
                let properMovie = {
                    id: movie.imdbID,
                    poster: movie.Poster,
                    title: movie.Title,
                    year: movie.Year
                };
                movies.push(properMovie);
            });
        })
        .then(() => {
            renderMovies();
        });
    searchField.value = '';
});

function renderMovies() {
    console.log(movies);
}
