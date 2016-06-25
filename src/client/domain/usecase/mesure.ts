import { Clientlog } from '../interface/readClientlog';
import { LoadTestGateway, SutyClientConfig } from '../interface/loadTest';
import { Serverlog } from '../interface/readServerlog';
// import RunningRepository from './interface/repository/runningRepository';
import { createMetrics } from '../model/metrics';
import { createRunning } from '../model/running';
import { createComputer } from '../model/computer';
import { createProcess } from '../model/process';
import { createRequest } from '../model/request';
import {injectable, inject} from 'inversify';


export interface MesureParams {
  loadTest: LoadTestGateway,
  readClientlog: Clientlog,
  readServerlog: Serverlog,
  // runningRepository: RunningRepository,
  testConfig: SutyClientConfig
}
export interface MesureUsecaseI {
  run(tasks: Array<SutyClientConfig>);
}

@injectable()
export class MesureUsecase implements MesureUsecaseI {
  loadTest: LoadTestGateway;
  clientlog: Clientlog;
  serverlog: Serverlog;
  constructor(
    @inject("LoadTestGateway") loadTest: LoadTestGateway,
    @inject("Clientlog") clientlog: Clientlog,
    @inject("Serverlog") serverlog: Serverlog
  ) {
    this.loadTest = loadTest;
    this.clientlog = clientlog;
    this.serverlog = serverlog;
  }

  run(tasks: Array<SutyClientConfig>) {
    tasks
      .map(config => () => this.task(config))
      .reduce((pre: any, cur) => pre.then(cur), Promise.resolve(0));
  }
  private task(config: SutyClientConfig) {
    let _requests = null;
    let _computers = null;
    let _processes = null;
    const metricsId = (new Date).getTime();
    return this.loadTest.run(config)
      .then(() => this.clientlog.get({ path: config.clientlogPath }))
      .then(requests => {
        _requests = requests.map(record => createRequest(Object.assign(record, { mid: metricsId })))
      })
      .then(() => this.serverlog.get({ path: config.serverlogPath }))
      .then(serverlogs => {
        _computers = serverlogs.map(record => createComputer(Object.assign(record.computer, { mid: metricsId })));
        _processes = serverlogs.map(record => createProcess(Object.assign(record.process, { mid: metricsId })));
      })
      .then(() => createMetrics({ id: metricsId, requests: _requests, processes: _processes, computers: _computers }))
      .then(metrics => createRunning({ name: config.logname, rid: (new Date).getTime().toString(), duration: config.duration, arrivalRate: config.rate }, [metrics]))
      .then(running => console.log(running))
  }
}