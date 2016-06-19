import * as fs from 'fs';
import mesureContoller from './controller/mesure';
import mesureTestContoller from './controller/mesureTest';
import { ProcessStatusRepoFS } from './repository/processStatus';
const clientConfig = require(`${process.env.PWD}/su_client.config.js`);
const processStatusRepo = new ProcessStatusRepoFS;

const processStatusRepom = new ProcessStatusRepoFS;
processStatusRepom.readFromResource(process.env.PWD + "/logs/status/date.3.30.csv")
  .then(() => console.log(processStatusRepom)).catch(er => console.log(er));

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
