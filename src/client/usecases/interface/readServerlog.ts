export interface Serverlog {
 pid: number;
 time: number;
 rss: number;
 processMemoryCur: number;
 processMemoryMax: number;
 pcMemoryCur: number;
 pcMemoryMax: number;
 loadAverage1: number;
 loadAverage5: number;
 loadAverage15: number;
}

export interface ReadServerlog {
  run({ path: string }): Promise<Array<Serverlog>>;
}
