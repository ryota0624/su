import Request from '../../model/request';
export interface ReadClientlog {
  readpath: string;
  run(): Promise<Array<Request>>;
}