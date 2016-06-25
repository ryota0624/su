import { MesureUsecase, MesureParams, MesureUsecaseI } from '../../domain/usecase/mesure';
import { configCreator } from './helper/index';
import { SutyClientConfig, LoadTestGateway } from '../../domain/interface/loadTest';
import { Clientlog } from '../../domain/interface/readClientlog';
import { Serverlog } from '../../domain/interface/readServerlog';

import kernel from '../../inversify.config';

export default function mesureController(config: SutyClientConfig) {
  const tasks: Array<SutyClientConfig> = config.phases.map(phase => {
    let testConfig: SutyClientConfig = configCreator(phase, config);
    return testConfig
  });
  const loadTest = kernel.get<LoadTestGateway>("LoadTestGateway");
  const readClientlog = kernel.get<Clientlog>("Clientlog");
  const readServerlog = kernel.get<Serverlog>("Serverlog");
  const usecase = kernel.get<MesureUsecaseI>("MesureUsecaseI")//new MesureUsecase(loadTest, readClientlog, readServerlog);
  usecase.run(tasks);
}

    // const loadTest = new ArtilleryGateway
    // const readClientlog = new ReadClientlogFS({ path: path.loadTest + '.json' });
    // const readServerlog = new ReadServerlogRequest({ path: config.target });