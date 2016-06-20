import * as fs from 'fs';
import mesureContoller from './controller/mesure';
import mesureTestContoller from './controller/mesureTest';
import multiPhaseMesureContoller from './controller/multiPhaseMesure';
import timeGroupedContoller from './controller/timeGrouped';
import onlyAttackController from './controller/multiPhaseonlyAttack';
import createMergedLogController from './controller/createMergedLog';

import { ProcessStatusRepoFS } from './repository/processStatus';
const clientConfig = require(`${process.env.PWD}/su_client.config.js`);
const processStatusRepo = new ProcessStatusRepoFS;

switch (process.argv[2]) {
  case 'client': {
    mesureContoller(clientConfig, processStatusRepo);
    break;
  }
  case 'client:multi': {
    multiPhaseMesureContoller(clientConfig, processStatusRepo);
    break;
  }
  case 'mergelog': {
    createMergedLogController(clientConfig, processStatusRepo);
    break;
  }
  case 'client:timeGrouped': {
    timeGroupedContoller([`${process.env.PWD}/logs/status/hoge.3.30.csv`,`${process.env.PWD}/logs/status/High load phase.6.50.csv`], processStatusRepo);
    break;
  }
  case 'client:onlyAttack': {
    onlyAttackController(clientConfig);
    break;
  }
  case 'test:client': {
    mesureTestContoller(clientConfig, processStatusRepo);
    break;
  }
}
