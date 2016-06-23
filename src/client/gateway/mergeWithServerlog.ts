import { Clientlog } from '../usecases/interface/readClientlog';
import { ReadServerlogRequest, ReadServerlogFS } from './readServerlog';
import { Serverlog, ReadServerlog } from '../usecases/interface/readServerLog';
import * as _ from 'lodash';
import { MergeWithServerlog } from '../usecases/interface/mergeWithServerlog';

export class MergeWithServerlogRequest implements MergeWithServerlog {
  path: string;
  readServerlog: ReadServerlog;
  constructor({ path }) {
    this.path = path;
    this.readServerlog = new ReadServerlogRequest;
  }
  run({ clientlogs }: { clientlogs: Array<Clientlog> }): Promise<Array<any>> {
    const path = this.path;
    const clientlogLen = clientlogs.length;
    // return getServerlogsReachClientlogsLen(path, clientlogLen, this.readServerlog)
    return getServerLogsReachNum(path, clientlogLen, this.readServerlog)
      .then(severlogs => mergeLogs(severlogs, clientlogs));
  }
}

export class MergeWithServerlogFS implements MergeWithServerlog {
  path: string;
  readServerlog: ReadServerlog;
  constructor({ path }) {
    this.path = path;
    this.readServerlog = new ReadServerlogFS;
  }
  run({ clientlogs }: {  clientlogs: Array<Clientlog> }): Promise<Array<any>> {
    const path = this.path;
    const clientlogLen = clientlogs.length;
    // return getServerlogsReachClientlogsLen(path, clientlogLen, this.readServerlog)
    return this.readServerlog.run({ path })
      .then(serverlogs => mergeLogs(serverlogs, clientlogs))
  }
}

function mergeLogs(serverlogs, clientlogs) {
  return _.zip<Serverlog | Clientlog>(serverlogs, clientlogs).map(log=> ({ client: log[1], server: log[0] }));
}

function getServerLogsReachNum(path: string, len: number, getlog: ReadServerlog) {
  let i = 0;
  const loop = (resolve, reject) => new Promise(() => {
    getlog.run({path}).then(newlogs => {
      i++;
      console.log('client' ,len, 'server',newlogs.length);
      if(newlogs.length >= len) {
        return resolve(newlogs);
      } else {
        if(i > 10) {
          console.log('faild readServerLog');
          process.exit();
          return reject('faild readServerLog');
        }
        setTimeout(() => loop(resolve, reject), 3000);
      }
    });
  });
  return new Promise((res, reject) => {
    loop(res, reject);
  });
}
