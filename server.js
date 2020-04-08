// steps to start the server ..
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require('cors');
app.use(cors());
// app.use(errorHandler);
const superagent = require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);


// constructors ..
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

function Weather(weatherData) {
  this.forecast = weatherData.weather.description;
  this.datetime = new Date(weatherData.valid_date).toString().slice(4, 15);
}

function Trail(trail) {
  this.name = trail.name;
  this.location = trail.location;
  this.length = trail.length;
  this.stars = trail.stars;
  this.star_votes = trail.starVotes;
  this.summary = trail.summary;
  this.trail_url = trail.url;
  this.condition_time = trail.conditionDate.slice(11);
  this.condition_date = trail.conditionDate.slice(0, 10);
}
// now we will git the data from the API :
// we need to differentiate between two type of the request .. we have a request from the client to the server
// and request from the server to the 3rd part that will provied us with the data ..
app.get('/location', (request, response) => {
  const city = request.query.city;
  const SQL = 'SELECT * FROM location WHERE search_query = $1'
  const value = [city]
  client
    .query(SQL, value)
    .then((result) => {
      if(result.rows.length > 0){
        response.status(200).json(result.rows[0]);
        console.log("hi")
      }else{
        superagent(
          `https://eu1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`
        ).then((res) => {
          console.log("helloooo")
          const geoData = res.body;
          const locationData = new Location(city, geoData);
          const SQL = 'INSERT INTO location (search_query, formatted_query, latitude, longitude) VALUES($1,$2,$3,$4) RETURNING *';
          const value = [
            locationData.search_query,
            locationData.formatted_query,
            locationData.latitude,
            locationData.longitude
          ];
          client.query(SQL, value).then((result) => {
            console.log(result.rows);
            response.status(200).json(result.rows[0])
          })
        })
      }
    })
    .catch((err) => errorHandler(err, request, response)
    );
});


app.get('/weather', (request, response) => {
  const city = request.query.search_query;
  superagent(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${process.env.WEATHER_API_KEY}`)
    .then((res) => {
      const weatherNow = res.body.data.map((weatherData) => {
        return new Weather(weatherData)
      });
      response.status(200).json(weatherNow)
    })
    .catch((error) => errorHandler(error, request, response));
});

app.get('/trails', (request, response) => {
  superagent(`https://www.hikingproject.com/data/get-trails?lat=${request.query.latitude}&lon=${request.query.longitude}&maxResult=10&key=${process.env.TRAIL_API_KEY}`)
    .then((res) => {
      const trialData = res.body.trails.map((ourTrail) => {
        return new Trail(ourTrail);
      });
      response.status(200).json(trialData)
    })
    .catch((error) => errorHandler(error, request, response));
});


function errorHandler(error, request, response) {
  response.status(500).send(error);
}

client
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`PORT ${PORT}`);
    });
  })
  .catch((err) => {
    throw new Error(err)
  });