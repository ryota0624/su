import RequestState from '../../model/requestState';
export interface GetRequestStatus {
  readpath: string;
  run(config: { path:string }): Promise<Array<RequestState>>;
}
