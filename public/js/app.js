(function() {
    'use strict';

    const searchField = document.getElementById('search');
    const searchButton = document.getElementsByTagName('button')[0];
    const movieList = document.getElementsByClassName('movie-list')[0];
    const errorField = document.getElementsByClassName('error')[0];

    let movies = [];
    let error = '';

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
                if (data.Response === 'False') {
                    error = data.Error;
                } else {
                    data.Search.forEach((movie) => {
                        let properMovie = {
                            id: movie.imdbID,
                            poster: movie.Poster,
                            title: movie.Title,
                            year: movie.Year
                        };
                        movies.push(properMovie);
                    });
                }
            })
            .then(() => {
                renderMovies();
            });
        searchField.value = '';
    });

    function renderMovies() {
        while (movieList.firstChild) {
            movieList.removeChild(movieList.firstChild);
        }
        if (movies.length > 0) {
            for (const movie of movies) {
                let movieItem = document.createElement('li');
                movieItem.setAttribute('class', 'movie-list__item');
                movieItem.textContent = movie.title;
                movieList.appendChild(movieItem);
            }
        }
        errorField.textContent = error;
        movies = [];
        error = '';
    }
})();
