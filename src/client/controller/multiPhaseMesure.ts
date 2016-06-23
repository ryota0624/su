import { Mesure } from '../usecases/mesure';
import { OutputStatus } from '../usecases/outputStatus';
import { OpenFile } from '../usecases/openFile';

import { SutyClientConfig } from '../usecases/gatewayInterfaces/loadTest';

import { ReadClientlogFS } from '../gateway/readClientlog';
import { ReadServerlogRequest } from '../gateway/readServerlog';
import { MergeWithServerlogRequest, MergeWithServerlogFS } from '../gateway/mergeWithServerlog';
import { DefaultApp } from '../gateway/externalApp';
import { OutputCSVFile } from '../gateway/output';
import { ArtilleryGateway } from '../gateway/loadTest';

import{ sleep } from '../../utils/sleep';

import { configCreator, distpathCreator } from './creator/index'

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
      const outputStatusUsecase = new OutputStatus({ output, statusRepo: repo });

      const defaultApp = new DefaultApp(distpath.csv);
      const openFileUsecase = new OpenFile({ externalApp: defaultApp })
      const argvConfig = parseArgv(config);
      console.log(argvConfig)
      return outputStatusUsecase.run({ timeFormat: argvConfig.timeformat })
      .then(() => {
        if(argvConfig.spreadSheetSoftwarePath) {
          return openFileUsecase.run()
        }
      });
    });
  });
  usecases.reduce((pre, cur) => pre.then(cur), Promise.resolve(0))
}

function parseArgv(config) {
  const argv = {
    timefomat: process.argv[3]
  };
  return Object.assign({}, config, argv)
}