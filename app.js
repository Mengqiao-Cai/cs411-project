// Import the express library here
const express = require('express');
const request = require('request');
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = 'df7bc87abfff4a9b91701baf00a0a560'; // Your client id
var client_secret = '6f692f2f7ff04fa4bd000bbbe6ae186d'; // Your secret
var redirect_uri = 'http://localhost:3000/www/index.html'; // Your redirect uri

// Instantiate the app here
var app = express();
app.use(cors({
  origin: '*'
}));
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

   // Use static server to serve the Express Yourself Website
app.use(express.static('public'));

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});


app.get('/events', (req, res) => {
  const city = req.query.city;
  const date = req.query.date
  console.log(req);
  const options = {
    'method': 'GET',
    'url': `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=${city}&apikey=bmaBdvvoasFwssS77Hqo2xUwqQJAeFPh&`,
    'headers': {
      'Cookie': 'TMSO=seed=1daad088cf24&exp=1586629516&kid=key1&sig=0x4ce6c5d5ddef1485eca8c516309683d7597d067614bf7aa50210176cab6dc697a4f96ef0f9488028dd83429991ec6ac77e0fc70c49697590fedf25a8098384ba'
    }
  };
  try {
    request(options, function (error, response) {
      if (error) throw new Error(error);
      var events = JSON.parse(response.body)._embedded.events;
      res.send(events.map(e => {
        return {
          names: e.name,
          venues: e._embedded.venues.map(v => v.name),
          dateAndTime: e.dates.start.dateTime
        };
      }));
    });
  } catch (error) {
    res.send(error);
  }
});


const PORT = process.env.PORT || 3000;

// Invoke the app's `.listen()` method below:
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
