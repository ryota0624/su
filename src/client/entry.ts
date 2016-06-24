import * as fs from 'fs';
import mesureQuickContoller from './controller/mesureQuick';
// import mesureTestContoller from './controller/mesureTest';
import multiPhaseMesureContoller from './controller/multiPhaseMesure';
import mesureContoller from './controller/mesure';
import timeGroupedContoller from './controller/timeGrouped';
import onlyAttackController from './controller/multiPhaseOnlyAttack';
import createMergedLogController from './controller/createMergedLog';

const clientConfig = require(`${process.env.PWD}/su_client.config.js`);

switch (process.argv[2]) {
  case 'quick': {
    mesureQuickContoller(clientConfig);
    break;
  }
  case 'client': {
    mesureContoller(clientConfig);
    // multiPhaseMesureContoller(clientConfig);
    break;
  }
  case 'mergelog': {
    createMergedLogController(clientConfig);
    break;
  }
  case 'client:timeGrouped': {
    timeGroupedContoller([`${process.env.PWD}/logs/status/hoge.3.30.csv`,`${process.env.PWD}/logs/status/High load phase.6.50.csv`]);
    break;
  }
  case 'client:onlyAttack': {
    onlyAttackController(clientConfig);
    break;
  }
  case 'test:client': {
    // mesureTestContoller(clientConfig);
    break;
  }
}
