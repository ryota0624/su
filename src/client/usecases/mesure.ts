import { ReadClientlog } from '../gateways/readClientlog';
import { ReadServerlog } from '../gateways/readServerlog';
import { LoadTestGateway, SutyClientConfig } from '../gateways/loadTest';

export interface MesureParams {
  loadTestGW: LoadTestGateway, 
  readClientlogGW: ReadClientlog, 
  readServerlogGW: ReadServerlog
}

export class Mesure {
  loadTestGW: LoadTestGateway;
  readClientlogGW: ReadClientlog;
  readServerlogGW: ReadServerlog;
  constructor(params: MesureParams) {
    this.loadTestGW = params.loadTestGW;
    this.readClientlogGW = params.readClientlogGW;
    this.readServerlogGW = params.readServerlogGW;
  }
  run(config: SutyClientConfig) {
    this.loadTestGW.run(config)
    .then((resultpath) => this.readClientlogGW.run({ path: resultpath })).then(res => console.log(res)).catch(err => console.log(err))
  }
}

// const m = new Mesure({ loadTestGW: null, readClientlogGW:null, readServerlogGW: null });
// console.log(m);