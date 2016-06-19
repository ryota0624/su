import ProcessStatus from '../model/processStatus';
import ProcessState from '../model/processState';

import * as fs from 'fs';
import { promiseAppendFile } from '../../utils/promiseFs';
export interface OutputGW {
  write(status: ProcessStatus): Promise<any>
}

const header = `pid,heapUsed,heapTotal,osFreeMem,osTotalMem,rss,la/1min,la/5min,la/15min,statusCode,time`;
const headerArr = header.split(',');

export class OutputCSVFile implements OutputGW {
  ouputpath: string;
  constructor({ path }) {
    this.ouputpath = path;
    fs.writeFileSync(path, header+'\n');
  }
  write(status: ProcessStatus) {
    return status.states.map(state => () => promiseAppendFile(this.ouputpath, stateToCSVStr(state) + '\n'))
      .reduce((pre, cur) => pre.then(cur), Promise.resolve(0))
  }
}

function stateToCSVStr(state: ProcessState) {
  const params = state.getFlatState();
  const str = headerArr.reduce((pre, cur) => {
    return pre + ',' + params[cur];
  }, '');
  return str.slice(1, str.length);
}