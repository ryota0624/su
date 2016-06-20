import ProcessStatus, {processStausFactory} from '../model/processStatus';
import ProcessState, {processStateFactory} from '../model/processState';

import { promiseReadFile } from '../../utils/promiseFS';
import { csvToArray } from '../../utils/csv'
export interface ProcessStatusRepo {
  data: Map<string, ProcessStatus>;
  add(id: string, status: ProcessStatus);
  getAll(): Array<{ status: ProcessStatus, key: string }>
  readFromResource(path?);
}
export class ProcessStatusRepoFS implements ProcessStatusRepo {
  data: Map<string, ProcessStatus>;
  path: string;
  constructor() {
    this.data = new Map<string, ProcessStatus>();
  }
  add(id , status: ProcessStatus) {
    this.data.set(id, status);
  }
  readFromResource(path) {
    return promiseReadFile(path).then(csv => csvToArray(csv.toString()))
      .then(mergedlogs => processStausFactory(mergedlogs.map((log => ({ client: log, server: log })))))
      .then(processStatuses => processStatuses.forEach(status => this.add(path ,status)))
  }
  getAll(): Array<{ status: ProcessStatus, key: string }> {
    let arr = [];
    this.data.forEach((status, key) => arr.push({key , status}));
    return arr;
  }
}