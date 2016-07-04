import { Clientlog } from '../interface/readClientlog';
import { LoadTestGateway, SutyClientConfig } from '../interface/loadTest';
import { Serverlog } from '../interface/readServerlog';
import { RunningRepository } from '../interface/repository/runningRepository';
import { createMetrics } from '../model/metrics';
import Running, { createRunning } from '../model/running';
import Computer, { createComputer } from '../model/computer';
import Process, { createProcess } from '../model/process';
import Request, { createRequest } from '../model/request';
import {injectable, inject} from 'inversify';
import { promiseSucc } from '../../../utils/promise';

export interface MesureUsecaseI {
  run(tasks: Array<SutyClientConfig>, cb: (running: Array<Running>) => void): Promise<Array<Running>>;
}

@injectable()
export class MesureUsecase implements MesureUsecaseI {
  loadTest: LoadTestGateway;
  clientlog: Clientlog;
  serverlog: Serverlog;
  repository: RunningRepository;
  runningIds: Array<any> = [];
  constructor(
    @inject(LoadTestGateway.interfaceName) loadTest: LoadTestGateway,
    @inject("Clientlog") clientlog: Clientlog,
    @inject("Serverlog") serverlog: Serverlog,
    @inject("RunningRepository") repository: RunningRepository
  ) {
    this.loadTest = loadTest;
    this.clientlog = clientlog;
    this.serverlog = serverlog;
    this.repository = repository;
  }

  run(tasks: Array<SutyClientConfig>, cb) {
    this.repository.init();
    const promisies = tasks
      .map(config => () => this.task(config));
      // .reduce((pre: any, cur) => pre.then(cur), Promise.resolve(0))
    return promiseSucc<Running>(promisies)
      .then((runnings) => {
        console.log(runnings)
        this.repository.commit();
        return cb(runnings);
      })
  }
  private task(config: SutyClientConfig) {
    const runningId = (new Date).getTime();
    return this.loadTest.run(config)
      .then(() => this.createMetrics(config, runningId))
      .then(metricses => createRunning(runningId, { name: config.logname, duration: config.duration, arrivalRate: config.rate }, metricses))
      .then(running => {
        this.runningIds.push(running.id);
        this.repository.save(running);
        return running;
      })
  }

  private createMetrics(config, runningId) {
    const metricsId = runningId;
    return this.clientlog.get({ path: config.clientlogPath })
      .then(requests => requests.map((record, i) => createRequest(metricsId, record)))
      .then((requests) => this.serverlog.get({ path: config.serverlogPath, num: requests.length })
        .then(serverlogs => serverlogs.map((record, i) => {
          const computer = createComputer(metricsId + i, record.computer);
          const process = createProcess(metricsId + i, record.process);
          return createMetrics(metricsId + i, runningId, { request: requests[i], computer, process })
        })))
  }
}
