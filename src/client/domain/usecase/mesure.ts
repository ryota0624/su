import { ReadClientlog } from './interface/readClientlog';
import { LoadTestGateway, SutyClientConfig } from './interface/loadTest';
import { ReadServerlog } from './interface/readServerlog';
// import RunningRepository from './interface/repository/runningRepository';
import { createMetrics } from '../model/metrics';
import { createRunning } from '../model/running';
import {injectable, inject} from 'inversify';


export interface MesureParams {
  loadTest: LoadTestGateway, 
  readClientlog: ReadClientlog, 
  readServerlog: ReadServerlog,
  // runningRepository: RunningRepository,
  testConfig: SutyClientConfig
}
@injectable()
export class MesureUsecase {
  runnings: Array<MesureParams>
  constructor(runnings: Array<MesureParams>) {
    this.runnings = runnings;
  }
  run() {
    const tests = this.runnings.map(running => () => this.test(running)).reduce((pre: any, cur) => pre.then(cur), Promise.resolve(0));
  }
  private test(param: MesureParams) {
    let _requests = null;
    let _computers = null;
    let _processes = null;
    return param.loadTest.run()
      .then(() => param.readClientlog.run())
      .then(requests => _requests = requests)
      .then(() => param.readServerlog.run())
      .then(server => {
        _computers = server.computers;
        _processes = server.processes;
      })
      .then(() => createMetrics({ requests: _requests, processes: _processes, computers: _computers }))
      .then(metrics => createRunning({ name: param.testConfig.logname, rid: "", duration: param.testConfig.duration, arrivalRate: param.testConfig.rate }, [metrics]))
      .then(running => console.log(running))
  }
}