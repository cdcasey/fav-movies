(function() {
    'use strict';

    const searchField = document.getElementById('search__button');
    const searchButton = document.getElementsByTagName('button')[0];
    const movieList = document.getElementsByClassName('movie-list')[0];
    const errorField = document.getElementsByClassName('error')[0];
    const favoritesLink = document.getElementById('favorites-button');

    let movies = [];
    let error = '';

    movieList.addEventListener('click', (event) => {
        const button = event.target;

        if (button.classList.contains('favorite-button')) {
            const movie = movies[button.dataset.listIndex];
            fetch('/favorites', {
                method: 'POST',
                body: JSON.stringify(movie),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    alert(`${movie.title} added to favorites.`);
                })
                .catch(console.error);
            button.setAttribute('style', 'color: red');
        }
    });

    favoritesLink.addEventListener('click', (event) => {
        fetch(`/favorites`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
            });
    });

    searchButton.addEventListener('click', (event) => {
        movies = [];
        event.preventDefault();
        if (searchField.value === '') {
            searchField.setAttribute('style', 'border: 2px solid red;');
            return;
        } else {
            searchField.removeAttribute('style');
        }

        fetch(`https://www.omdbapi.com/?apikey=27549c19&s=${searchField.value}`)
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
            for (const [index, movie] of movies.entries()) {
                const movieItem = document.createElement('li');
                const favoriteButton = document.createElement('button');
                favoriteButton.setAttribute('class', 'favorite-button');
                favoriteButton.setAttribute('data-list-index', index);
                favoriteButton.innerHTML = '&hearts;';

                movieItem.setAttribute('class', 'movie-list__item');
                movieItem.textContent = movie.title;
                movieItem.insertAdjacentElement('beforeend', favoriteButton);
                movieList.appendChild(movieItem);
            }
        }
        errorField.textContent = error;
        error = '';
    }
})();
