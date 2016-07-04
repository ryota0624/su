import { OnlyAttackUsecaseI } from '../../domain/usecase/onlyAttack';
import { configCreator } from './helper/configCreator';
import { configCheck } from './helper/configCheck';

import { SutyClientConfig } from '../../domain/interface/loadTest';
import kernel from '../../inversify.config';

import onlyAttackPresenter from '../presenter/onlyAttack';

export default function onlyAttackController(config: SutyClientConfig) {
  configCheck(config);
  const tasks: Array<SutyClientConfig> = config.phases.map(phase => {
    let testConfig: SutyClientConfig = configCreator(phase, config);
    return testConfig
  });
  const usecase = kernel.get<OnlyAttackUsecaseI>("OnlyAttackUsecaseI");
  usecase.run(tasks).then(() => onlyAttackPresenter(tasks));
}

