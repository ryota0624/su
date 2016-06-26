import * as moment from 'moment';
export default class Process {
  pid: number;
  heapUsed: number;
  heapTotal: number;
  relativeTime: number;
  mid: number;
  constructor(param = { mid: 0, pid: 0, heapTotal: 0, heapUsed: 0, relativeTime: 0 }) {
    this.pid = param.pid;
    this.heapTotal = Number(param.heapTotal);
    this.heapUsed = Number(param.heapUsed);
    this.relativeTime = Number(param.relativeTime);
    this.mid = param.mid;
  }
  setTimeFormat(format:string) {
    const formatedTime = moment(this.relativeTime).format(format);//this.relativeTime
    return new Process(Object.assign({}, this, { relativeTime: formatedTime }));
  }
}

export function createProcess(param = { mid: 0, pid: 0, heapUsed: 0, heapTotal: 0, relativeTime: 0 }) {
  return new Process(param);
}
