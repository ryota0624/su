export interface GetRequestStatus {
  readpath: string;
  run(): Promise<Array<RequestState>>;
}
