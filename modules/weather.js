'use strict';
const superagent = require('superagent');
const main = require('../server');

function weatherHandler (request, response){
    const city = request.query.search_query;
    superagent(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${process.env.WEATHER_API_KEY}`)
      .then((res) => {
        const weatherNow = res.body.data.map((weatherData) => {
          return new Weather(weatherData)
          
        });
        response.status(200).json(weatherNow)
      })
      .catch((error) => errorHandler(error, request, response));
  }
  function errorHandler(error, request, response) {
    response.status(500).send(error);
  }

function Weather(weatherData) {
    this.forecast = weatherData.weather.description;
    this.datetime = new Date(weatherData.valid_date).toString().slice(4, 15);
  }

  module.exports = weatherHandler;
  