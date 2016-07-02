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

export interface MesureUsecaseI {
  run(tasks: Array<SutyClientConfig>): Promise<Array<Running>>;
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

  run(tasks: Array<SutyClientConfig>) {
    this.repository.init();
    return tasks
      .map(config => () => this.task(config))
      .reduce((pre: any, cur) => pre.then(cur), Promise.resolve(0))
      .then(() => {
        this.repository.commit();
        return this.runningIds.map(id => this.repository.getById(id));
      })
  }
  private task(config: SutyClientConfig) {
    const runningId = (new Date).getTime();
    return this.loadTest.run(config)
      .then(() => this.createMetrics(config, runningId))
      .then(metrics => createRunning({ name: config.logname, id: runningId, duration: config.duration, arrivalRate: config.rate }, metrics))
      .then(running => {
        this.runningIds.push(running.id);
        this.repository.save(running);
        return running;
      }).catch(err => console.log(err))
  }
  private createMetrics(config, runningId) {
    const metricsId = runningId;
    return this.clientlog.get({ path: config.clientlogPath })
      .then(requests => requests.map((record, i) => createRequest(Object.assign(record, { mid: metricsId }))))
      .then((requests) => this.serverlog.get({
        path: config.serverlogPath, num: requests.length
      }).then(serverlogs => {
        const computers = serverlogs.map((record, i) => createComputer(Object.assign(record.computer, { mid: metricsId + i })));
        const processes = serverlogs.map((record, i) => createProcess(Object.assign(record.process, { mid: metricsId + i })));
        return requests.map((request, i) => createMetrics({ id: metricsId + i, rid: runningId, request, computer: computers[i], process: processes[i] }))
      }))
  }
}