import Request from './request';
import Process from './process';
import Computer from './computer';
export default class Metrics {
  requests: Array<Request>;
  processes: Array<Process>;
  computers: Array<Computer>;
  constructor(param = { requests: [], processes: [], computers: []}) {
    this.requests = param.requests;
    this.processes = param.processes;
    this.computers = param.computers;
  }
}

export function createMetrics(param: { 
  requests: Array<Request>;
  processes: Array<Process>;
  computers: Array<Computer>; 
}) {
  return new Metrics(param);
}
