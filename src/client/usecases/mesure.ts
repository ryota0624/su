import { ReadClientlog } from '../gateway/readClientlog';
import { MergeWithServerlog } from './interface/mergeWithServerlog';
import { LoadTestGateway, SutyClientConfig } from './interface/loadTest';

import { processStausFactory } from '../model/processStatus';
import { ProcessStatusRepo } from '../repository/processStatus';
import { configCreator, distpathCreator } from './helper/index'



export interface MesureParams {
  loadTestGW: LoadTestGateway, 
  readClientlogGW: ReadClientlog, 
  mergeWithServerlogGW: MergeWithServerlog,
  processStatusRepo: ProcessStatusRepo
}

export class Mesure {
  loadTestGW: LoadTestGateway;
  readClientlogGW: ReadClientlog;
  mergeWithServerlogGW: MergeWithServerlog;
  processStatusRepo: ProcessStatusRepo;

  constructor(params: MesureParams) {
    this.loadTestGW = params.loadTestGW;
    this.readClientlogGW = params.readClientlogGW;
    this.mergeWithServerlogGW = params.mergeWithServerlogGW;
    this.processStatusRepo = params.processStatusRepo;
  }
  run(config: SutyClientConfig) {
    const tasks = config.phases.map(phase => {
      const task = configCreator(phase, config);
      return () => this.loadTestGW.run(task)
    })
    return tasks.reduce((pre, cur) => {
      return pre.then(cur);
    }, Promise.resolve(0));
  }
}