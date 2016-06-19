import * as fs from 'fs';
import mesureContoller from './controller/mesure';
import mesureTestContoller from './controller/mesureTest';

const clientConfig = require(`${process.env.PWD}/su_client.config.js`);
switch (process.argv[2]) {
  case 'client': {
    mesureContoller(clientConfig);
    break;
  }
  case 'test:client': {
    mesureTestContoller(clientConfig);
    break;
  }
}
