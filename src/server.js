// external dependencies
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// internal dependencies
// const auth = require('./api/auth');
const routes = require('./api/routes');
const handlerHash = require('./api/handler');
const pool = require('../connection/dbConnect');

const app = express();

const diHash = {
    express,
    jwt,
    pool,
    handlerHash
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", routes(diHash));

app.use((err, req, res, next) => {
    console.error(err);
  
    res.status(err.status || 500).json({
      message: err.message,
    });
  });

module.exports = app;