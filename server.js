// steps to start the server ..
require('dotenv').config();
const main = {};
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require('cors');
app.use(cors());
const superagent = require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => {
  throw new Error(err);
});

const locationHandler = require('./modules/location');
app.get('/location', locationHandler);
const weatherHandler = require('./modules/weather');
app.get('/weather', weatherHandler);
const trailsHandler = require('./modules/trails');
app.get('/trails', trailsHandler);
const movieHandler = require('./modules/movie');
app.get('/movie', movieHandler);
const yelpHandler = require('./modules/yelp');
app.get('/yelp', yelpHandler);

client
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` hello PORT ${PORT}`);
    });
  })
  .catch((err) => {
    throw new Error(err)
  });

  module.exports = main;