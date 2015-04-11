'use strict';

var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');

var WEATHER_API = 'http://api.openweathermap.org/data/2.5/forecast/daily?id=1880252&cnt=7&units=metric';

function getTypeOfWeather (weather) {
  // Ico Moon fonts
  switch (weather.main) {
    case 'Clear':
      return 'sun';
    case 'Clouds':
      return 'cloudy';
    case 'Rain':
      switch (weather.description) {
        case 'light rain':
          return 'rainy';
        default:
          return 'rainy2';
      }
      break;
    default:
      return 'temperature';
  }
}

router.get('/', function (req, res) {
  request(WEATHER_API, function (error, response, body) {
    if (!error && response.statusCode == 200) { 
      var data = JSON.parse(body).list;
      data.forEach(function (day) {
        day.temp = parseInt(day.temp.day * 10) / 10;
        day.weather = getTypeOfWeather(day.weather[0]);
      });
      return res.json(data);
    }
  })
});

module.exports = router;

