import ProcessStatus from '../model/processStatus';
import ProcessState from '../model/processState';

import * as fs from 'fs';
import { promiseAppendFile } from '../../utils/promiseFs';
export interface OutputGW {
  write(status: ProcessStatus): Promise<any>
}

const header = '';

export class OutputCSVFile implements OutputGW {
  ouputpath: string;
  constructor({ path }) {
    this.ouputpath = path;
    fs.writeFileSync(path, 'header'+ '\n');
  }
  write(status: ProcessStatus) {
    return status.states.map(state => () => promiseAppendFile(this.ouputpath, stateToCSVStr(state) + '\n'))
      .reduce((pre, cur) => pre.then(cur), Promise.resolve(0))
  }
}

function stateToCSVStr(state: ProcessState) {
  const params = state.getFlatState();
  return `${params.pid},${params.heapUsed},${params.heapTotal},${params.osFreeMem},${params.osTotalMem},${params.rss},${params.statusCode},${params.time}`;
}