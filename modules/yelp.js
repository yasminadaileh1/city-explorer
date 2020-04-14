'use strict';
const superagent = require('superagent');
const main = require('../server');

function yelpHandler(request, response){
    
    superagent(`https://api.yelp.com/v3/businesses/search?&city=${request.query.city}`)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
      .then((res) => {
        const yelpData = res.body.businesses.map((ourYelp) => {
          return new Yelp(ourYelp);
        })
        response.status(200).json(yelpData)
        Console.log(yelpData)
      })
      .catch((error) => errorHandler(error, request, response));
  }


  function errorHandler(error, request, response) {
    response.status(500).send(error);
  }

function Yelp(data) {
    this.name = data.name;
    this.image_url = data.image_url;
    this.price = data.price;
    this.rating = data.rating;
    this.url = data.url;
  }

  module.exports = yelpHandler;