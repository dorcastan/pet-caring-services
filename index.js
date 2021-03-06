const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const PGStore = require('connect-pg-simple')(session);

const path = require('path');
const auth = require('./auth');
const pool = require('./db');
const routes = require('./routes');

const PORT = process.env.PORT || 8000;

const app = express();

// -------------------- General Setup --------------------
// support parsing of 'application/json' type POST data
app.use(bodyParser.json());
// support parsing of 'application/x-www-form-urlencoded' type data
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}

app.use(
  cors({
    // allow CORS for any port on localhost or example-domain.herokuapp.com
    credentials: true,
    // TODO: replace with actual heroku domain
    origin: /https?:\/\/(localhost:[0-9]{1,5})|(petcaringservices-group21.herokuapp.com)/,
    exposedHeaders: ['Set-Cookie'],
  }),
);

// -------------------- Authentication --------------------
auth.init(app);

const sessionConfig = {
  store: new PGStore({ pool }),
  // secret: process.env.SECRET, // TODO: add 'dotenv' and ENV variables
  secret: 'simulator simulator', // process.env.SECRET, // TODO: add 'dotenv' and ENV variables
  resave: false, // PGStore supports the `touch` method
  saveUninitialized: true, // to allow tracking of repeat visitors
  cookie: {
    httpOnly: false, // allow browser JavaScript to access the cookie
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  proxy: true,
};

if (app.get('env') === 'production') {
  sessionConfig.cookie.secure = true; // only use cookie over HTTPS
}
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

// -------------------- Routing --------------------
app.use('/api', routes); // prepend all routes with '/api'

// Generic Error Handling
// Note: 4th parameter `next` is required for error-handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// -------------------- Server --------------------
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
});
