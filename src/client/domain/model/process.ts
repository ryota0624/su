export default class Process {
  pid: number;
  heapUsed: number;
  heapTotal: number;
  relativeTime: number;
  mid: number;
  constructor(param = { mid: 0, pid: 0, heapTotal: 0, heapUsed: 0, relativeTime: 0 }) {
    this.pid = param.pid;
    this.heapTotal = param.heapTotal;
    this.heapUsed = param.heapUsed;
    this.relativeTime = param.relativeTime;
    this.mid = param.mid;
  }
}

export function createProcess(param = { mid: 0, pid: 0, heapUsed: 0, heapTotal: 0, relativeTime: 0 }) {
  return new Process(param);
}