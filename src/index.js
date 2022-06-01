require('dotenv').config();
const appServer = require('./server');

process.env.APP_VERSION = require('../package.json').version;

const appPort = process.env.PORT || 8080;

appServer.listen(appPort, () => {
  console.log(`Server is listening on port ${appPort}`);
  console.log(`APP_ENV ${process.env.APP_ENV}`);
  console.log(`v${process.env.APP_VERSION}`);
});