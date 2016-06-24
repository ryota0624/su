
import { Clientlog } from './readClientlog';
import { Serverlog, ReadServerlog } from './readServerlog';

export interface MergeWithServerlog {
  readServerlog: ReadServerlog;
  path: string;
  run({ clientlogs, path }: { clientlogs: Array<Clientlog>, path: string }):Promise<Array<any>>
}