import { Mesure } from '../usecases/mesure';
import { ArtilleryGateway } from '../gateway/loadTest';
import { ReadClientlogFS } from '../gateway/readClientlog';
import { ReadServerlogRequest } from '../gateway/readServerlog';
import { MergeWithServerlogRequest } from '../gateway/mergeWithServerlog';
import { DefaultApp } from '../gateway/externalApp';
import { OutputCSVFile } from '../gateway/output';
import { OutputStatus } from '../usecases/outputStatus';


import { ProcessStatusRepoFS } from '../repository/processStatus';

const processStatusRepo = new ProcessStatusRepoFS;

import { distpathCreator } from './creator/index';

export default function mesureQucickController(config) {
  // const argvConfig = parseArgv(config);
  // const distpath = distpathCreator(argvConfig);
  // console.log(argvConfig)
  // const artillery = new ArtilleryGateway;
  // const readClientlog = new ReadClientlogFS({ path: distpath.loadTest + '.json'});
  // const mergeWithServerlog = new MergeWithServerlogRequest({ path: argvConfig.target });
  // const mesureUsecase = new Mesure({ processStatusRepo ,loadTestGW: artillery, readClientlogGW: readClientlog, mergeWithServerlogGW: mergeWithServerlog });
  // mesureUsecase.run(argvConfig).then(() => {
  //   const output = new OutputCSVFile({ path: distpath.csv });
  //   const defaultApp = new DefaultApp(distpath.csv);
  //   const outputStatus = new OutputStatus({ output, statusRepo: processStatusRepo, externalApp: defaultApp });
  //   return outputStatus.run({ timeFormat: argvConfig.timeformat });
  // });
}


function parseArgv(config) {
  const argvConfig = {
    duration: process.argv[4],
    rate: process.argv[5],
    logname: process.argv[3],
    // scenarios: []
  }
  return Object.assign({}, config, argvConfig);
}