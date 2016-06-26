import * as fs from 'fs';
import "reflect-metadata";
import mesureContoller from './adaptor/controller/mesure';
import onlyAttackContoller from './adaptor/controller/onlyAttack';

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
}
