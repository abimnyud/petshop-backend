// external dependencies
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

// internal dependencies
// const auth = require('./api/auth');
const { routes, authenticateRoutes} = require('./api/routes');
const handlerHash = require('./api/handler');
const pool = require('../connection/dbConnect');
const middlewareHash = require('./api/middlewares');

const app = express();

const diHash = {
    express,
    jwt,
    bcrypt,
    pool,
    handlerHash,
    middlewareHash
}

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('combined'));
app.use(middlewareHash.verifyAPIKey(diHash));
app.use("/api", middlewareHash.validation(diHash), routes(diHash));
app.use("/auth", authenticateRoutes(diHash));

app.use((err, req, res, next) => {
    console.error(err);
  
    res.status(err.status || 500).json({
      message: err.message,
    });
  });

module.exports = app;