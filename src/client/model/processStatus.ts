import ProcessState, { processStateFactory } from './processState';
import * as _ from 'lodash';

export default class ProcessStatus {
  pid: number;
  states: Array<ProcessState>
  constructor(pid: number, states: Array<ProcessState>) {
    this.pid = pid;
    this.states = states;
  }
}
      // .then(mergedlogs => mergedlogs.map((log) => processStateFactory(log[0], log[1])))

      // .then(processStates => _.groupBy(processStates, 'pid'))

export function processStausFactory(mergedlogs: Array<any>) {
  const processStates = mergedlogs.map(log => processStateFactory(log.client, log.server));
  const pidGroupedState = _.groupBy(processStates, 'pid');
  const pids = Object.keys(pidGroupedState);
  return pids.map(pid => new ProcessStatus(Number(pid), pidGroupedState[pid]));
}