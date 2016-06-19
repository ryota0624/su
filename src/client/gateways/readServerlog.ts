import { csvToArray } from '../../utils/csv';
import { getPromise } from '../../utils/request';
import { promiseReadFile } from '../../utils/promiseFs';
export interface Serverlog {
 pid: number;
 time: number;
 rss: number;
 processMemoryCur: number;
 processMemoryMax: number;
 pcMemoryCur: number;
 pcMemoryMax: number;
 loadAverage1: number;
 loadAverage5: number;
 loadAverage15: number;
}

export interface ReadServerlog {
  run({ path: string }): Promise<Array<Serverlog>>;
}

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