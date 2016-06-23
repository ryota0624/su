
export interface SutyClientConfig {
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
  run(config: SutyClientConfig): Promise<any>;
}

export interface ArtilleryConfig {
  config: {
    target: string;
    phases: Array<{ duration: number, arrivalRate: number }>;
  }
  outputname: string;
  scenarios: Array<{ flow: Array<{ get: { url: string} }> }>
}