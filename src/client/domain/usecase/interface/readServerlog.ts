import Process from '../../model/process';
import Computer from '../../model/computer';
export interface ServerlogRecord {
  computer: {
    'la/1min': number;
    'la/5min': number;
    'la/15min': number;
    osFreeMem: number;
    osTotalMem: number;
    relativeTime: number;
  },
  process: {
    pid: number;
    heapUsed: number;
    heapTotal: number;
    relativeTime: number;
  }
}
export interface Serverlog {
  get({ path }: { path: string }): Promise<Array<ServerlogRecord>>;
}
