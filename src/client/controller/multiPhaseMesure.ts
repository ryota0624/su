import { Mesure } from '../usecases/mesure';
import { OutputStatus } from '../usecases/outputStatus';

import { OutputCSVFile } from '../gateway/output';
import { ArtilleryGateway, SutyClientConfig } from '../gateway/loadTest';
import { ReadClientlogFS } from '../gateway/readClientlog';
import { ReadServerlogRequest } from '../gateway/readServerlog';
import { MergeWithServerlogRequest, MergeWithServerlogFS } from '../gateway/mergeWithServerlog';

import{ sleep } from '../../utils/sleep';

export default function multiMesureController(config: SutyClientConfig, repo) {
  const usecases = config.phases.map(phase => {
    if(phase.pause) return () => sleep(phase.pause * 1000);

    const newConfig = configCreator(phase, config);
    const distpath = distpathCreator(newConfig);
    
    const artillery = new ArtilleryGateway({ path: distpath.loadTest });
    const readClientlog = new ReadClientlogFS({ path: distpath.loadTest + '.json'});
    const mergeWithServerlog = new MergeWithServerlogRequest({ path: config.target });

    const mesureUsecase = new Mesure({ processStatusRepo: repo ,loadTestGW: artillery, readClientlogGW: readClientlog, mergeWithServerlogGW: mergeWithServerlog });

    return () => mesureUsecase.run(newConfig).then(() => {
      const output = new OutputCSVFile({ path: distpath.csv });
      const outputStatus = new OutputStatus({ output, statusRepo: repo });
      return outputStatus.run({ timeFormat: config.timeformat });
    });
  });
  usecases.reduce((pre, cur) => pre.then(cur), Promise.resolve(0))
}

function configCreator(phase, config) {
  return Object.assign({}, config, { rate: phase.arrivalRate, duration: phase.duration, logname: phase.name });
}

function distpathCreator(config) {
  return {
    loadTest: `${process.env.PWD}/logs/client/${config.logname}.${config.duration}.${config.rate}`,
    csv: `${process.env.PWD}/logs/status/${config.logname}.${config.duration}.${config.rate}.csv`
  }
}