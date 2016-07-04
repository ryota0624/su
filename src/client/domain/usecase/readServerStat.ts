import { ServerlogLocal } from '../interface/readServerlog';
import { RunningRepository } from '../interface/repository/runningRepository';
import { createMetrics } from '../model/metrics';
import Running, { createRunning } from '../model/running';
import { createComputer } from '../model/computer';
import { createProcess } from '../model/process';
import Request,{ createRequest } from '../model/request';
import {injectable, inject} from 'inversify';

export interface ReadServerStatUsecaseI {
  run(url: string);
}

@injectable()
export class ReadServerStatUsecase implements ReadServerStatUsecaseI {
  serverlog: ServerlogLocal;
  repository: RunningRepository;
  constructor(
    @inject("ServerlogLocal") serverlog: ServerlogLocal,
    @inject("RunningRepository") repository: RunningRepository
  ) {
    this.serverlog = serverlog;
    this.repository = repository;
  }

  run(url: string) {
    const filenameArr = url.split(/\/|\.|js|csv/).filter(i => Boolean(i));
    const filename = filenameArr[filenameArr.length -1];
    const metricsId = (new Date).getTime();
    const runningId = metricsId;
    return this.serverlog.get({ path: url })
    .then(serverlogs => {
        if(serverlogs.length === 0) throw new Error("serverlogが存在していません")
        return serverlogs.map((record, i) => {
          const computer = createComputer(metricsId + i, record.computer);
          const process = createProcess(metricsId + i, record.process);
          return createMetrics(metricsId + i, runningId, { request: new Request, computer, process })
        });
    })
    .then(metricses => createRunning(runningId, { name: filename+".server", duration: 0, arrivalRate: 0 }, metricses))
    .then((running) => {
      this.repository.save(running);
      this.repository.commit();
      return [running];
    })
  }
}