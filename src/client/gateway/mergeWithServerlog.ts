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
    return this.readServerlog.run({ path })
      .then(severlogs => _.zip<Serverlog | Clientlog>(severlogs, clientlogs))
      // .then((res) => res.map(log => Object.assign({}, log[1], log[0])));
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
      .then(severlogs => _.zip<Serverlog | Clientlog>(severlogs, clientlogs))
      // .then((res) => res.map(log => Object.assign({}, log[1], log[0])));
  }
}

function getServerlogsReachClientlogsLen(path: string, len: number, getlog: ReadServerlog): Promise<Array<Serverlog>> {
  return Promise.resolve(null)
  // const loop = 
  // return new Promise((res, rej) => {
  //   getlog.run({ path }).then(res => {

  //   })
  // })
}