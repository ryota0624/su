import { ReadClientlog } from './interface/readClientlog';
import { MergeWithServerlog } from './interface/mergeWithServerlog';

import { processStausFactory } from '../model/processStatus';
import { ProcessStatusRepo } from '../repository/processStatus';

export interface createMergedLogParams {
  readClientlogGW: ReadClientlog, 
  mergeWithServerlogGW: MergeWithServerlog,
  processStatusRepo: ProcessStatusRepo,
  config: { logname: string }
}

export class CreateMergedLog {
  readClientlogGW: ReadClientlog;
  mergeWithServerlogGW: MergeWithServerlog;
  processStatusRepo: ProcessStatusRepo;
  config: { logname: string };
  constructor(params: createMergedLogParams) {
    this.readClientlogGW = params.readClientlogGW;
    this.mergeWithServerlogGW = params.mergeWithServerlogGW;
    this.processStatusRepo = params.processStatusRepo;
    this.config = params.config;
  }
  run() {
    // return this.readClientlogGW.run({ path: null })
    //   .then(clientlogs => this.mergeWithServerlogGW.run({ clientlogs }))
    //   .then(mergedlogs => processStausFactory(mergedlogs))
    //   .then(processStatuses => processStatuses.forEach((processStatus, key) => {
    //     this.processStatusRepo.add(this.config.logname + key ,processStatus);
    //   })).then(() => console.log(this.processStatusRepo)).catch(err => console.log(err))
  }
}
