export default class Process {
  pid: number;
  heapUsed: number;
  heapTotal: number;
  relativeTime: number;
  constructor(param = { pid: 0, heapTotal: 0, heapUsed: 0, relativeTime: 0 }) {
    this.pid = param.pid;
    this.heapTotal = param.heapTotal;
    this.heapUsed = param.heapUsed;
    this.relativeTime = param.relativeTime;
  }
}

export function createProcess(param = { pid: 0, heapUsed: 0, heapTotal: 0, relativeTime: 0 }) {
  return new Process(param);
}