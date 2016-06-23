import ProcessStatus, { header, headerArr } from '../model/processStatus';
import ProcessState from '../model/processState';

import * as fs from 'fs';
import { promiseAppendFile } from '../../utils/promiseFs';
import { OutputGW } from '../usecases/interface/output';

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