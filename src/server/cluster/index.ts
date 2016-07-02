import * as cluster from 'cluster';
import loggerCreator from '../middleware/express-sutylogger/index';
import eventAppend from './workerEvent';
import getCPU from '../middleware/get_cpu_usage/index';


const config = require('../../../su_server.config.js');
const testModule = require('../loadModule')(config.testModule);
const logger = loggerCreator.cluster(`${process.env.PWD}/logs/server/${config.testModule}.csv`);

if(cluster.isMaster) {
  console.log('host:', config.host);
  console.log('port:', config.port);
  console.log('pid: ', process.pid);
  getCPU(5, "node", `${process.env.PWD}/logs/server/process.csv`, `${process.env.PWD}/logs/server/cpu.csv`);

  const cpus = require('os').cpus().length;
  for (let i = 0; i < cpus; i++) {
    const worker = cluster.fork();
    eventAppend(worker);
  }
  logger.parent(cluster.workers);
} else {
  const express = require('express');
  const app = express();
  app.use(logger.child);
  app.use(testModule);
  app.get('/', (req, res) => {
    res.send('osu');
  });
  app.listen(config.port, config.host, () => console.log('child', `pid: ${process.pid}`));
}