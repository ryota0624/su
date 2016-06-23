import { Mesure } from '../usecases/mesure';
import { ArtilleryGateway } from '../gateway/loadTest';
import { ReadClientlogFS } from '../gateway/readClientlog';
import { ReadServerlogRequest } from '../gateway/readServerlog';
import { MergeWithServerlogRequest } from '../gateway/mergeWithServerlog';
import { DefaultApp } from '../gateway/externalApp';
import { OutputCSVFile } from '../gateway/output';
import { OutputStatus } from '../usecases/outputStatus';


import { distpathCreator } from './creator/index';

export default function mesureController(config, repo) {
  const argvConfig = parseArgv(config);
  const distpath = distpathCreator(argvConfig);
  // console.log(argvConfig)
  const artillery = new ArtilleryGateway({ path: distpath.loadTest });
  const readClientlog = new ReadClientlogFS({ path: distpath.loadTest + '.json'});
  const mergeWithServerlog = new MergeWithServerlogRequest({ path: argvConfig.target });
  const mesureUsecase = new Mesure({ processStatusRepo: repo ,loadTestGW: artillery, readClientlogGW: readClientlog, mergeWithServerlogGW: mergeWithServerlog });
  mesureUsecase.run(argvConfig).then(() => {
    const output = new OutputCSVFile({ path: distpath.csv });
    const defaultApp = new DefaultApp(distpath.csv);
    const outputStatus = new OutputStatus({ output, statusRepo: repo });
    return outputStatus.run({ timeFormat: argvConfig.timeformat });
  });
}


function parseArgv(config) {
  const argvConfig = {
    duration: Number(process.argv[4]),
    rate: Number(process.argv[5]),
    logname: process.argv[3],
    // scenarios: []
  }
  if(Number.isNaN(argvConfig.rate)) {
    throw new Error('rateには数値を渡してください')
  }
  if(Number.isNaN(argvConfig.duration)) {
    throw new Error('durationには渡してください')
  }
  return Object.assign({}, config, argvConfig);
}