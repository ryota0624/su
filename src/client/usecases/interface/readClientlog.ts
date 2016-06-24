export interface ReadClientlog {
  readpath: string;
  run({ path: string }): Promise<Array<Clientlog>>;
}

export interface Clientlog {
  time: number;
  responseTime: number;
  statusCode: number;
}
