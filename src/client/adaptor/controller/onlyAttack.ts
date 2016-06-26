import { OnlyAttackUsecaseI } from '../../domain/usecase/onlyAttack';
import { configCreator } from './helper/index';
import { SutyClientConfig } from '../../domain/interface/loadTest';
import kernel from '../../inversify.config';

export default function onlyAttackController(config: SutyClientConfig) {
  const tasks: Array<SutyClientConfig> = config.phases.map(phase => {
    let testConfig: SutyClientConfig = configCreator(phase, config);
    return testConfig
  });
  const usecase = kernel.get<OnlyAttackUsecaseI>("OnlyAttackUsecaseI");
  usecase.run(tasks);
}