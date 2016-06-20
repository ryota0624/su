import ProcessState, { processStateFactory } from './processState';
import * as _ from 'lodash';

export default class ProcessStatus {
  pid: number;
  states: Array<ProcessState>
  constructor(pid: number, states: Array<ProcessState>) {
    this.pid = pid;
    this.states = states;
  }
  formatTime(formatString): ProcessStatus {
    const newStates = this.states.map(state => state.formatTime(formatString));
    const newProcessStatus = new ProcessStatus(this.pid, newStates);
    return newProcessStatus
  }
  getTimeGrouped() {
    return _.groupBy(this.states, 'time')
  }
}

export function processStausFactory(mergedlogs: Array<any>) {
  const processStates = mergedlogs.map(log => processStateFactory(log.client, log.server));
  const pidGroupedState = _.groupBy(processStates, 'pid');
  const pids = Object.keys(pidGroupedState);
  return pids.map(pid => new ProcessStatus(Number(pid), pidGroupedState[pid]));
}

export const header = `pid,heapUsed,heapTotal,osFreeMem,osTotalMem,rss,la/1min,la/5min,la/15min,statusCode,time,relativeTime`;
export const headerArr = header.split(',');