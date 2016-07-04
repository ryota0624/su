import { LoadTestGateway, SutyClientConfig } from '../interface/loadTest';
// import RunningRepository from './interface/repository/runningRepository';
import {injectable, inject} from 'inversify';

export interface OnlyAttackUsecaseI {
  run(tasks: Array<SutyClientConfig>, cb: () => void) :Promise<any>;
}

@injectable()
export class OnlyAttackUsecase implements OnlyAttackUsecaseI {
  loadTest: LoadTestGateway;
  constructor(
    @inject(LoadTestGateway.interfaceName) loadTest: LoadTestGateway
  ) {
    this.loadTest = loadTest;
  }

  run(tasks: Array<SutyClientConfig>, cb) {
    return tasks
      .map(config => () => this.task(config))
      .reduce((pre: any, cur) => pre.then(cur), Promise.resolve(0))
      .then(() => cb())
  }
  private task(config: SutyClientConfig) {
    return this.loadTest.run(config)
  }
}