import { MesureUsecaseI } from '../../domain/usecase/mesure';
import { configCreator } from './helper/index';
import { SutyClientConfig } from '../../domain/interface/loadTest';
import kernel from '../../inversify.config';
import presenter from '../presenter/mesureMetrics';

export default function mesureController(config: SutyClientConfig) {
  const tasks: Array<SutyClientConfig> = config.phases.map(phase => {
    let testConfig: SutyClientConfig = configCreator(phase, config);
    return testConfig
  });
  const usecase = kernel.get<MesureUsecaseI>("MesureUsecaseI");
  usecase.run(tasks)
    .then(running => presenter(running));
}