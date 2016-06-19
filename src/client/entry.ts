import * as fs from 'fs';
import mesureContoller from './controller/mesure';
import mesureTestContoller from './controller/mesureTest';
import ProcessStatusRepo from './repository/processStatus';
const clientConfig = require(`${process.env.PWD}/su_client.config.js`);
const processStatusRepo = new ProcessStatusRepo;

switch (process.argv[2]) {
  case 'client': {
    mesureContoller(clientConfig, processStatusRepo);
    break;
  }
  case 'test:client': {
    mesureTestContoller(clientConfig, processStatusRepo);
    break;
  }
}
