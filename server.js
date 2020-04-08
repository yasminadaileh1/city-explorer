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


let locationCall = require('./modules/location');
server.get('/location', locationHandler);
// constructors ..

function locationHandler(request, response) {
  const city = request.query.data;
  console.log('city' , city);
}


function Movies (movie){
  this.title = movie.title;
  this.overview = movie.overview;
  this.average_votes = movie.average_votes;
  this.this.total_votes = movie.total_votes;
  this.image_url = movie.image_url;
  this.released_on = movie.released_on;
}

// now we will git the data from the API :
// we need to differentiate between two type of the request .. we have a request from the client to the server
// and request from the server to the 3rd part that will provied us with the data ..





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