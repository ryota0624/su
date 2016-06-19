import ProcessStatus, {processStausFactory} from '../model/processStatus';
import ProcessState, {processStateFactory} from '../model/processState';

import { promiseReadFile } from '../../utils/promiseFS';
import { csvToArray } from '../../utils/csv'
export interface ProcessStatusRepo {
  data: Map<number, ProcessStatus>;
  add(status: ProcessStatus);
  getAll(): Array<ProcessStatus>
  readFromResource(path?);
}
export class ProcessStatusRepoFS implements ProcessStatusRepo {
  data: Map<number, ProcessStatus>;
  path: string;
  constructor() {
    this.data = new Map<number, ProcessStatus>();
  }
  add(status: ProcessStatus) {
    this.data.set(status.pid, status);
  }
  readFromResource(path) {
    return promiseReadFile(path).then(csv => csvToArray(csv.toString()))
      .then(mergedlogs => processStausFactory(mergedlogs.map((log => ({ client: log, server: log })))))
      .then(processStatuses => processStatuses.forEach(status => this.add(status)))
  }
  getAll(): Array<ProcessStatus> {
    let arr = [];
    this.data.forEach(status => arr.push(status));
    return arr;
  }
}