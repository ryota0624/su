export interface ReadClientlog {
  readpath: string;
  run(): Promise<Array<Clientlog>>;
}

export interface Clientlog {
  time: number;
  responseTime: number;
  statusCode: number;
}
