import { ReadClientlog } from '../gateways/readClientlog';
import { MergeWithServerlog } from '../gateways/mergeWithServerlog';
import { LoadTestGateway, SutyClientConfig } from '../gateways/loadTest';
import { sleep } from '../../utils/sleep';
export interface MesureParams {
  loadTestGW: LoadTestGateway, 
  readClientlogGW: ReadClientlog, 
  mergeWithServerlogGW: MergeWithServerlog
}

export class Mesure {
  loadTestGW: LoadTestGateway;
  readClientlogGW: ReadClientlog;
  mergeWithServerlogGW: MergeWithServerlog

  constructor(params: MesureParams) {
    this.loadTestGW = params.loadTestGW;
    this.readClientlogGW = params.readClientlogGW;
    this.mergeWithServerlogGW = params.mergeWithServerlogGW;
  }
  run(config: SutyClientConfig) {
    return this.loadTestGW.run(config)
      .then(resultpath => this.readClientlogGW.run())
      .then(clientlogs => this.mergeWithServerlogGW.run({ clientlogs }))
      .then(mergedlogs => console.log(mergedlogs)).catch(err => console.log(err))
  }

  createTests(config: SutyClientConfig) {
     return config.phases.map(phase => {
       if (phase.pause) return () => sleep(phase.pause); //後でsleepに;
      config.duration = phase.duration;
      config.rate = phase.arrivalRate;
      config.logname = phase.name;
      return () => this.loadTestGW.run(config)
      .then((resultpath) => this.readClientlogGW.run())
      .then(res => console.log(res))
    });
  }
}

// const m = new Mesure({ loadTestGW: null, readClientlogGW:null, readServerlogGW: null });
// console.log(m);