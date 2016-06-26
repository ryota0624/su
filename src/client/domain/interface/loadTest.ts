
export interface SutyClientConfig {
  clientlogPath: string;
  serverlogPath: string;
  target: string;
  duration: number;
  rate: number;
  timeformat: string;
  timeout: number;
  scenarios: any;
  logname: string;
  spreadSheetSoftwarePath: string;
  phases: Array<LoadTestPhase>
}

// export interface LoadTestGateway {
//   run(config: SutyClientConfig): Promise<any>;
// }

export abstract class LoadTestGateway {
  abstract run(config: SutyClientConfig): Promise<any>;
  static interfaceName = Symbol("LoadTestGateway");
}

export interface LoadTestPhase {
  arrivalRate: number,
  duration: number,
  name: string,
}