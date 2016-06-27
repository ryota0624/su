import { ServerlogLocal } from '../interface/readServerlog';
import { RunningRepository } from '../interface/repository/runningRepository';
import { createMetrics } from '../model/metrics';
import Running, { createRunning } from '../model/running';
import { createComputer } from '../model/computer';
import { createProcess } from '../model/process';
import { createRequest } from '../model/request';
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
    let _computers = null;
    let _processes = null;
    const metricsId = (new Date).getTime();
    const runningId = metricsId.toString();
    this.repository.init();
    return this.serverlog.get({ path: url })
    .then(serverlogs => {
        if(serverlogs.length === 0) throw new Error("serverlogが存在していません")
        _computers = serverlogs.map(record => createComputer(Object.assign(record.computer, { mid: metricsId })));
        _processes = serverlogs.map(record => createProcess(Object.assign(record.process, { mid: metricsId })));
    })
    .then(() => createMetrics({ id: metricsId, rid: runningId ,requests: [], processes: _processes, computers: _computers }))
    .then(metrics => createRunning({ name: filename+".server", id: runningId, duration: 0, arrivalRate: 0 }, [metrics]))
    .then((running) => {
      this.repository.save(running);
      this.repository.commit();
      return [running];
    })
  }
}