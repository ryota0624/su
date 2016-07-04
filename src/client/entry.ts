import * as fs from 'fs';
import "reflect-metadata";
import mesureContoller from './adaptor/controller/mesure';
import onlyAttackContoller from './adaptor/controller/onlyAttack';
import quickMesureController from './adaptor/controller/quickMesure';
import summaryController from './adaptor/controller/summary';
import readserverStatController from './adaptor/controller/readserverStat';

const clientConfig = require(`${process.env.PWD}/su_client.config.js`);
switch (process.argv[2]) {
  case 'client': {
    mesureContoller(clientConfig);
    break;
  }
  case 'onlyAttack': {
    onlyAttackContoller(clientConfig);
    break;
  }
  case 'quick': {
    quickMesureController(clientConfig);
    break;
  }
  case 'summary': {
    summaryController(clientConfig);
    break;
  }
  case 'readserverStat': {
    readserverStatController();
    break;
  }
  case 'artilleryReport': {
    
  }
}
