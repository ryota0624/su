import * as express from 'express';
import loggerCreator from '../middleware/express-sutylogger/index';
import getCPU from '../middleware/get_cpu_usage/index';

const config = require(process.env.PWD +'/su_server.config.js');
const testModule = require('../loadModule')(config.testModule);
const logger = loggerCreator.singlecore(`${process.env.PWD}/logs/server/${config.testModule}.csv`);

var app = express();

console.log('host:', config.host);
console.log('port:', config.port);
console.log('pid: ', process.pid);
getCPU(5, "node", `${process.env.PWD}/logs/server/process.csv`, `${process.env.PWD}/logs/server/cpu.csv`);
const server = (cb) => {
  app.use(logger);
  app.use(testModule);
  app.use((req, res, next) => {
    if (req.url === '/gc') {
      if (global.gc) {
        global.gc();
        return res.send('gc');
      }
    }
    next();
  });
  app.get('/', (req, res) => {
    res.send('osu');
  });
  return new Promise((res) => {
    app.listen(config.port, config.host, () => {
      cb(config.port);
      res(true);
    });
  });
};

server(() => {})