import { csvToArray } from '../../utils/csv';
import { getPromise } from '../../utils/request';
import { promiseReadFile } from '../../utils/promiseFs';
import { ReadServerlog, Serverlog } from '../usecases/interface/readServerlog';

export class ReadServerlogRequest implements ReadServerlog {
  run({ path }): Promise<Array<Serverlog>>{
    return getPromise(path + '/suty/log').then(res => csvToArray(res.toString()));
  }
}

export class ReadServerlogFS implements ReadServerlog {
  run({ path }): Promise<Array<Serverlog>>{
    return promiseReadFile(path).then(res => csvToArray(res.toString()));
  }
}

// const r = new ReadServerlogRequest
// r.run({ path: "http://localhost:3333/suty/log" }).then(rs => console.log(rs))
// const r = new ReadServerlogFS
// r.run({ path: process.env.PWD + '/logs/server/date.3.30.csv' }).then(rs => console.log(rs))