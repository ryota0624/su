
import { Clientlog } from './readClientlog';
import { Serverlog, ReadServerlog } from './readServerlog';

export interface MergeWithServerlog {
  readServerlog: ReadServerlog;
  path: string;
  run({ clientlogs }: { clientlogs: Array<Clientlog> }):Promise<Array<any>>
}