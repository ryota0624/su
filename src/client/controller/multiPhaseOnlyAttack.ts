import { OnlyAttack } from '../usecases/onlyAttack';

import { OutputCSVFile } from '../gateway/output';
import { ArtilleryGateway, SutyClientConfig } from '../gateway/loadTest';

import{ sleep } from '../../utils/sleep';

import { configCreator, distpathCreator } from '../creator/index'


export default function multiMesureController(config: SutyClientConfig) {
  
  const usecases = config.phases.map(phase => {
    if(phase.pause) return () => sleep(phase.pause * 1000);
    const newConfig = configCreator(phase, config);
    const distpath = distpathCreator(newConfig);
    const artillery = new ArtilleryGateway({ path: distpath.loadTest });
    const mesureUsecase = new OnlyAttack({ loadTestGW: artillery });
    return () => mesureUsecase.run(newConfig);
  });
  usecases.reduce((pre: any, cur) => pre.then(cur), Promise.resolve(0))
}
