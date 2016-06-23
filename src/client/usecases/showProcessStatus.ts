import { GetRequestStatus } from './interface/getRequestStatus';
import { LoadTestGateway, SutyJob } from './interface/loadTest';
import { GetServerStatus } from './interface/getServerStatus';
import * as _ from 'lodash';

import { processStausFactory } from '../model/processStatus';
import { processStateFactory } from '../model/processState';

import { ProcessStatusRepo } from '../repository/processStatus';

export interface ShowProcessParams {
  loadTestGW: LoadTestGateway, 
  getRequestStatus: GetRequestStatus, 
  getServerStatus: GetServerStatus,
  processStatusRepo: ProcessStatusRepo
}

export default class ShowProcessStatus {
  loadTestGW: LoadTestGateway;
  getRequestStatus: GetRequestStatus;
  getServerStatus: GetServerStatus;
  processStatusRepo: ProcessStatusRepo;
  requestStatus: Array<any>;
  serverStatus: Array<any>
  constructor(params: ShowProcessParams) {
    this.loadTestGW = params.loadTestGW;
    this.getRequestStatus = params.getRequestStatus;
    this.getServerStatus = params.getServerStatus;
    this.processStatusRepo = params.processStatusRepo;
  }
  addServerStatus(status) {
    this.serverStatus = status;
  }
  addRequestStatus(status) {
    this.requestStatus = status;
  }
  run(config: SutyJob) {
    config.phases.map(phase => {
      const job = configCreator(phase, config);
      const distpath = distpathCreator(job);
      return this.loadTestGW.run(job, distpath.loadTest)
        .then(() => this.getRequestStatus.run({ path: distpath.loadTestResult }))
        .then(requestState => this.addRequestStatus(requestState))
        .then(() => this.getServerStatus.run({ path: config.target }))
        .then(serverStatus => this.addServerStatus(serverStatus))
        .then(() => processStateFactory(this.requestStatus, this.serverStatus))
        .then((mergeLogs) => processStateFactory(merge))
    })
  }

}

export function configCreator(phase, config) {
  return Object.assign({}, config, { rate: phase.arrivalRate, duration: phase.duration, logname: phase.name });
}

export function distpathCreator(config) {
  const logname = config.logname.replace(/\s/g,"_");
  return {
    loadTest: `${process.env.PWD}/logs/client/${logname}.${config.duration}.${config.rate}`,
    loadTestResult: `${process.env.PWD}/logs/client/${logname}.${config.duration}.${config.rate}.json`,
    csv: `${process.env.PWD}/logs/status/${logname}.${config.duration}.${config.rate}.csv`
  }
}

function mergeLogs(serverlogs, clientlogs) {
  return _.zip<any>(serverlogs, clientlogs).map(log=> ({ client: log[1], server: log[0] }));
}
