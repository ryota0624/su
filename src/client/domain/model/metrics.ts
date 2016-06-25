import Request from './request';
import Process from './process';
import Computer from './computer';
export default class Metrics {
  id: number;
  requests: Array<Request>;
  processes: Array<Process>;
  computers: Array<Computer>;
  constructor(param = { id: 0, requests: [], processes: [], computers: []}) {
    this.requests = param.requests;
    this.processes = param.processes;
    this.computers = param.computers;
    this.id = param.id;
  }
}

export function createMetrics(param: { 
  requests: Array<Request>;
  processes: Array<Process>;
  computers: Array<Computer>;
  id: number;
}) {
  return new Metrics(param);
}
