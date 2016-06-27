import { Clientlog } from '../interface/readClientlog';
import { LoadTestGateway, SutyClientConfig } from '../interface/loadTest';
import { Serverlog } from '../interface/readServerlog';
import { RunningRepository } from '../interface/repository/runningRepository';
import { createMetrics } from '../model/metrics';
import Running, { createRunning } from '../model/running';
import { createComputer } from '../model/computer';
import { createProcess } from '../model/process';
import { createRequest } from '../model/request';
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
    let _requests = null;
    let _computers = null;
    let _processes = null;
    const metricsId = (new Date).getTime();
    const runningId = metricsId.toString();
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
      .then(() => createMetrics({ id: metricsId, rid: runningId ,requests: _requests, processes: _processes, computers: _computers }))
      .then(metrics => createRunning({ name: config.logname, id: runningId, duration: config.duration, arrivalRate: config.rate }, [metrics]))
      .then(running => {
        this.runningIds.push(running.id);
        this.repository.save(running);
        return running;
      }).catch(err => console.log(err))
  }
}