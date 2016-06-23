import ServerState from '../../model/serverState';
export interface GetServerStatus {
  run({ path: string }): Promise<Array<ServerState>>;
}