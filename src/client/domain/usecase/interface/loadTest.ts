import {injectable} from 'inversify';

export interface SutyClientConfig {
  target: string;
  duration: number;
  rate: number;
  timeformat: string;
  timeout: number;
  scenarios: any;
  logname: string;
  outputpath: string;
  spreadSheetSoftwarePath: string;
  phases: Array<LoadTestPhase>
}

@injectable()
export abstract class LoadTestGateway {
  resultpath: string;
  abstract run(): Promise<any>;
}

export interface LoadTestPhase {
  arrivalRate: number,
  duration: number,
  name: string,
}