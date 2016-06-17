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
    const tests = this.createTests(config);
    // tests.reduce((cur, pre) => {
    //   return pre().then(() => cur());
    // }, () => Promise.resolve(0));
  }
  createTests(config) {
     return config.phases.map(phase => {
      if(phase.pause) Promise.resolve() //後でsleepに;
      config.duration = phase.duration;
      config.rate = phase.arrivalRate;
      config.logname = phase.name;
      return () => this.loadTestGW.run(config)
      .then((resultpath) => this.readClientlogGW.run({ path: resultpath }))
      .then(res => console.log(res)).catch(err => console.log(err))
    });
  }
}

// const m = new Mesure({ loadTestGW: null, readClientlogGW:null, readServerlogGW: null });
// console.log(m);