import { ReadClientlog } from './interface/readClientlog';
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
    const configs = this.makeConfigs(config);
    const tests = configs.reduce((pre, cur) => pre.then(() => this.loadTestGW.run(cur.task)), Promise.resolve(0));
    tests.then(() => this.totalStatus(configs))
  }

  private makeConfigs(config: SutyClientConfig) {
    return config.phases.map(phase => {
      const task: SutyClientConfig = configCreator(phase, config);
      const distpath = distpathCreator(task);
      task.outputpath = distpath.loadTest;
      return { task, distpath } //this.loadTestGW.run(task)
    });
  }

  private totalStatus(tasks: Array<{ task: SutyClientConfig, distpath: { csv: string, loadTest: string } }>) {
    tasks.map(task => this.readClientlogGW.run({ path: task.distpath }));
  }
}