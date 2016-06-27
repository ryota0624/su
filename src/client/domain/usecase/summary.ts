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

export interface SummaryUsecaseI {
  run(): Promise<Array<Running>>;
}

@injectable()
export class SummaryUsecase implements SummaryUsecaseI {
  repository: RunningRepository;
  constructor(
    @inject("RunningRepository") repository: RunningRepository
  ) {
    this.repository = repository;
  }
  run() {
    this.repository.init();
    const running = this.repository.getAllRunning();
    return Promise.resolve(running);
  }
}