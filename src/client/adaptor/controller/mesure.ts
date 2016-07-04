import { MesureUsecaseI } from '../../domain/usecase/mesure';
import { configCreator } from './helper/configCreator';
import { configCheck } from './helper/configCheck';

import { SutyClientConfig } from '../../domain/interface/loadTest';
import kernel from '../../inversify.config';
import presenter from '../presenter/mesureMetrics';

export default function mesureController(config: SutyClientConfig) {
  if(process.argv[3]) config.timeformat = process.argv[3];
  configCheck(config);
  const tasks: Array<SutyClientConfig> = config.phases.map(phase => {
    let testConfig: SutyClientConfig = configCreator(phase, config);
    return testConfig
  });
  const usecase = kernel.get<MesureUsecaseI>("MesureUsecaseI");
  usecase.run(tasks, (running) => presenter(running, config))
    // .then(running => (running, config));
}
