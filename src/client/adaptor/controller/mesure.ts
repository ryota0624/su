import { MesureUsecase, MesureParams } from '../../domain/usecase/mesure';
import { ArtilleryGateway }from '../gateway/loadTest';
import { ReadClientlogFS } from '../gateway/readClientlog';
import { ReadServerlogRequest } from '../gateway/readServerlog';
import { configCreator, distpathCreator } from './helper/index';
import { SutyClientConfig } from '../../domain/usecase/interface/loadTest';

import DIcontainer from '../../inversify.config';

export default function mesureController(config: SutyClientConfig) {
  const tasks: Array<MesureParams> = config.phases.map(phase => {
    const testConfig = configCreator(phase, config);
    const path = distpathCreator(testConfig);
    const loadTest = new ArtilleryGateway({ resultpath: path.loadTest, config: testConfig });
    const readClientlog = new ReadClientlogFS({ path: path.loadTest + '.json' });
    const readServerlog = new ReadServerlogRequest({ path: config.target });
    return { loadTest: loadTest, testConfig, readServerlog, readClientlog }
  });
  const usecase = new MesureUsecase(tasks);
  usecase.run();
}