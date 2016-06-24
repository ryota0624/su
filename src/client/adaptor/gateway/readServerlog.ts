import { csvToArray } from '../../../utils/csv';
import { getPromise } from '../../../utils/request';
import { promiseReadFile } from '../../../utils/promiseFs';
import { ReadServerlog } from '../../domain/usecase/interface/readServerlog';
import Computer, { createComputer } from '../../domain/model/computer';
import Process, { createProcess } from '../../domain/model/process';

export class ReadServerlogRequest implements ReadServerlog {
  path: string;
  constructor({ path }) {
    this.path = path;
  }
  run(): Promise<{ computers: Array<Computer>, processes: Array<Process>}>{
    return getPromise(this.path + '/suty/log')
    .then(res => csvToArray(res.toString()))
    .then(raw => rawServerlogToEntity(raw))
  }
}

export class ReadServerlogFS implements ReadServerlog {
  path: string;
  constructor({ path }) {
    this.path = path;
  }
  run(): Promise<{ computers: Array<Computer>, processes: Array<Process>}>{
    return promiseReadFile(this.path)
    .then(res => csvToArray(res.toString()))
    .then(raw => rawServerlogToEntity(raw))
  }
}

function rawServerlogToEntity(raw) {
  const computers = raw.map(record => createComputer(record));
  const processes = raw.map(record => createProcess(record));
  return { computers, processes };
}

// const r = new ReadServerlogRequest
// r.run({ path: "http://localhost:3333/suty/log" }).then(rs => console.log(rs))
// const r = new ReadServerlogFS
// r.run({ path: process.env.PWD + '/logs/server/date.3.30.csv' }).then(rs => console.log(rs))