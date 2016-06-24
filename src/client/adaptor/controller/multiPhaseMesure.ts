// import { Mesure } from '../usecases/mesure';
// import { OutputStatus } from '../usecases/outputStatus';

// import { OutputCSVFile } from '../gateway/output';
// import { ArtilleryGateway } from '../gateway/loadTest';
// import { ReadClientlogFS } from '../gateway/readClientlog';
// import { ReadServerlogRequest } from '../gateway/readServerlog';
// import { MergeWithServerlogRequest, MergeWithServerlogFS } from '../gateway/mergeWithServerlog';
// import { DefaultApp } from '../gateway/externalApp';

// import { ProcessStatusRepoFS } from '../repository/processStatus';

// const processStatusRepo = new ProcessStatusRepoFS;

// import{ sleep } from '../../utils/sleep';

// import { configCreator, distpathCreator } from './creator/index'

export default function multiMesureController(config) {
  // const usecases = config.phases.map(phase => {
  //   if(phase.pause) return () => sleep(phase.pause * 1000);

  //   const newConfig = configCreator(phase, config);
  //   const distpath = distpathCreator(newConfig);
    
  //   const artillery = new ArtilleryGateway;
  //   const readClientlog = new ReadClientlogFS({ path: distpath.loadTest + '.json'});
  //   const mergeWithServerlog = new MergeWithServerlogRequest({ path: config.target });

  //   const mesureUsecase = new Mesure({ processStatusRepo ,loadTestGW: artillery, readClientlogGW: readClientlog, mergeWithServerlogGW: mergeWithServerlog });

  //   return () => mesureUsecase.run(newConfig).then(() => {
  //     const output = new OutputCSVFile({ path: distpath.csv });
  //     const defaultApp = new DefaultApp(distpath.csv);
  //     const outputStatus = new OutputStatus({ output, statusRepo: processStatusRepo, externalApp: defaultApp });
  //     const argvConfig = parseArgv(config);
  //     return outputStatus.run({ timeFormat: argvConfig.timeformat });
  //   });
  // });
  // usecases.reduce((pre, cur) => pre.then(cur), Promise.resolve(0))
}

function parseArgv(config) {
  const argv = {
    timefomat: process.argv[3]
  };
  return Object.assign({}, config, argv)
}