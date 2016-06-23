import { LoadTestGateway, SutyClientConfig } from './interface/loadTest';

export class OnlyAttack {
  loadTestGW: LoadTestGateway;
  
  constructor(params: { loadTestGW: LoadTestGateway} ) {
    this.loadTestGW = params.loadTestGW;
  }
  run(config: SutyClientConfig) {
    return this.loadTestGW.run(config).catch(err => console.log(err))
  }
}
