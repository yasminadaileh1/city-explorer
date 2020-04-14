'use strict';
const superagent = require('superagent');

const main = require('../server');


function movieHandler (request, response){
    superagent(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIE_API_KEY}&city=${request.query.city}`)
      .then((res) => {
        const movieData = res.body.results.map((ourmovie) => {
          return new Movies(ourmovie);
        })
        console.log(movieData)
        response.status(200).json(movieData)
      })
      .catch((error) => errorHandler(error, request, response));
  }

  function errorHandler(error, request, response) {
    response.status(500).send(error);
  }




function Movies(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movie.vote_average;
    this.total_votes = movie.vote_count;
    this.image_url = movie.poster_path;
    this.popularity = movie.popularity;
    this.released_on = movie.release_date;
  }

  module.exports = movieHandler;