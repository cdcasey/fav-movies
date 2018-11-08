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
        const el = event.target;

        if (el.classList.contains('favorite-button')) {
            const movie = movies[el.dataset.listIndex];
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
            el.setAttribute('style', 'color: red');
        }

        if (el.classList.contains('movie-list__item')) {
            const plotDiv = event.target.firstChild.nextSibling.nextSibling;
            plotDiv.classList.toggle('hidden');
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
                const plotDiv = document.createElement('div');

                favoriteButton.setAttribute('class', 'favorite-button');
                favoriteButton.setAttribute('data-list-index', index);
                favoriteButton.innerHTML = '&hearts;';

                plotDiv.setAttribute('class', 'movie-plot hidden');

                movieItem.setAttribute('class', 'movie-list__item');
                movieItem.textContent = movie.title;
                movieItem.insertAdjacentElement('beforeend', favoriteButton);
                movieItem.insertAdjacentElement('beforeend', plotDiv);
                movieList.appendChild(movieItem);
                fetch(`https://www.omdbapi.com/?apikey=27549c19&i=${movie.id}`)
                    .then((data) => data.json())
                    .then((response) => {
                        plotDiv.innerText = response.Plot;
                    });
            }
        }
        errorField.textContent = error;
        error = '';
    }
})();
