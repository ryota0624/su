import { Clientlog } from './readClientlog';
import { ReadServerlogRequest, Serverlog, ReadServerlog, ReadServerlogFS } from './readServerlog';
import * as _ from 'lodash';
interface MergedLog extends Serverlog, Clientlog {
}
export interface MergeWithServerlog {
  readServerlog: ReadServerlog;
  path: string;
  run({ clientlogs }: { clientlogs: Array<Clientlog> }):Promise<Array<any>>
}

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
