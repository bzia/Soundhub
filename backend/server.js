const express = require('express');
const userRoutes = require('./src/routes/userRoutes.js');
const db = require('./src/models/index.js');
const { errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var request = require('request');

require('dotenv').config();
const config = require('../config');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

app.use('/api/users', userRoutes);

var client_id = config.client_id; // Spotify client id
var client_secret = config.client_secret; // Spotify secret
var redirect_uri = 'https://soundhub-app.herokuapp.com/api/callback'; // redirect uri defined in spotify dev dashboard

var generateRandomString = function (length) {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

app.get('/api/login', function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // application requests authorization with certain scopes
  const scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-read-private',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
  ];

  const scope = scopes.join(' ');

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get('/api/callback', function (req, res) {
  // application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(client_id + ':' + client_secret).toString('base64'),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { Authorization: 'Bearer ' + access_token },
          json: true,
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          console.log(body);
        });

        // pass the token to the browser to make requests from there
        res.redirect(
          'https://soundhub-app.herokuapp.com/analytics/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      } else {
        res.redirect(
          '/#' +
            querystring.stringify({
              error: 'invalid_token',
            })
        );
      }
    });
  }
});

app.get('/refresh_token', function (req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(client_id + ':' + client_secret).toString('base64'),
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

/* For Deployment */
const __dir = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dir, '/frontend/build')));

  // asterisk -> anything thats not an api route (above)
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dir, 'frontend', 'build', 'index.html'))
  );
}

const port = process.env.PORT;

async function init() {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  console.log(`Starting Sequelize + Express example on port ${port}...`);
}

init();

app.listen(port, () => {
  console.log(
    `Express server started on port ${port}. Try some routes, such as '/api/users'.`
  );
});
