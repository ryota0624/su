import { csvToArray } from '../../../utils/csv';
import { getPromise } from '../../../utils/request';
import { promiseReadFile } from '../../../utils/promiseFs';
import { Serverlog, ServerlogRecord } from '../../domain/interface/readServerlog';
import {injectable} from 'inversify';
import { sleep } from '../../../utils/sleep';

@injectable()
export class ReadServerlogRequest implements Serverlog {
  retry: number = 0;
  get({ path, num }): Promise<Array<ServerlogRecord>>{
    return this.getFromServer(path).then(logs => {
        console.log('client:', num, 'server', logs.length)
        if(logs.length < num && this.retry < 5) {
          this.retry++;
          return sleep(1000).then(() => this.get({ path, num }))
        } else {
          return parseServerlog(logs)
        }
      })
  }
  private getFromServer(path) {
    return getPromise(path)
      .then((result: any) => {
        if(result.errno) {
          console.log(`${path} へのサーバログ取得リクエストに失敗しました
          ${result}
          `);
        }
        return result
      })
    .then(res => csvToArray(res.toString()))
  }
}
@injectable()
export class ReadServerlogFS implements Serverlog {
  get({ path }): Promise<Array<ServerlogRecord>>{
    return promiseReadFile(path)
    .then(res => {
      return res;
    })
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