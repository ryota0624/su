export interface SutyJob {
  target: string;
  duration: number;
  rate: number;
  timeformat: string;
  timeout: number;
  scenarios: any;
  logname: string;
  // outputdir: string;
  spreadSheetSoftwarePath: string;
  phases: Array<{ duration: number, arrivalRate: number, name: string, pause?: number }>
}

export interface LoadTestGateway {
  resultpath: string;
  run(config: SutyJob): Promise<any>;
}