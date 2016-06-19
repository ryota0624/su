import HttpState from './httpState';
import ServerState from './serverState';
export default class ProcessState {
  pid: number;
  http: HttpState;
  time: number;
  server: ServerState;
  constructor(pid, state: { http: HttpState, server: ServerState}) {
    this.pid = pid;
    this.http = state.http;
    this.server = state.server;
    this.time = state.server.time;
  }
}

export function processStateFactory(server, http) {
  return new ProcessState(server.pid, { http: new HttpState(http), server: new ServerState(server)})
}