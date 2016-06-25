import { MesureUsecase, MesureParams } from '../../domain/usecase/mesure';
// import { ReadClientlogFS } from '../gateway/readClientlog';
// import { ReadServerlogRequest } from '../gateway/readServerlog';
import { configCreator } from './helper/index';
import { SutyClientConfig, LoadTestGateway } from '../../domain/usecase/interface/loadTest';
import { Clientlog } from '../../domain/usecase/interface/readClientlog';
import { Serverlog } from '../../domain/usecase/interface/readServerlog';

import DIcontainer from '../../inversify.config';

export default function mesureController(config: SutyClientConfig) {
  const tasks: Array<SutyClientConfig> = config.phases.map(phase => {
    let testConfig: SutyClientConfig = configCreator(phase, config);
    return testConfig
  });
  const loadTest = DIcontainer.get<LoadTestGateway>("LoadTestGateway");
  const readClientlog = DIcontainer.get<Clientlog>("Clientlog");
  const readServerlog = DIcontainer.get<Serverlog>("Serverlog");
  const usecase = new MesureUsecase(loadTest, readClientlog, readServerlog);
  usecase.run(tasks);
}

    // const loadTest = new ArtilleryGateway
    // const readClientlog = new ReadClientlogFS({ path: path.loadTest + '.json' });
    // const readServerlog = new ReadServerlogRequest({ path: config.target });