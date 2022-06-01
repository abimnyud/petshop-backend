// external dependencies
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// internal dependencies
const config = require('./config');
const auth = require('./api/auth');
const routes = require('./api/routes');

const app = express();

const diHash = {
    express,
    jwt
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use("/api", routes);

app.use((err, req, res, next) => {
    console.error(err);
  
    res.status(err.status || 500).json({
      message: err.message,
    });
  });

module.exports = app;