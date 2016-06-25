import { csvToArray } from '../../../utils/csv';
import { getPromise } from '../../../utils/request';
import { promiseReadFile } from '../../../utils/promiseFs';
import { Serverlog, ServerlogRecord } from '../../domain/usecase/interface/readServerlog';
import {injectable} from 'inversify';

@injectable()
export class ReadServerlogRequest implements Serverlog {
  get({ path }): Promise<Array<ServerlogRecord>>{
    return getPromise(path)
    .then(res => csvToArray(res.toString()))
    .then(raw => parseServerlog(raw))
  }
}

export class ReadServerlogFS implements Serverlog {
  get({ path }): Promise<Array<ServerlogRecord>>{
    return promiseReadFile(path)
    .then(res => csvToArray(res.toString()))
    .then(raw => parseServerlog(raw))
  }
}

function parseServerlog(raw): Array<ServerlogRecord> {
  const logs = raw.map(record => ({ computer: record, process: record }));
  return logs;
}

// const r = new ReadServerlogRequest
// r.run({ path: "http://localhost:3333" }).then(rs => console.log(rs))
// const r = new ReadServerlogFS
// r.run({ path: process.env.PWD + '/logs/server/date.3.30.csv' }).then(rs => console.log(rs))