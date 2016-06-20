import HttpState, { createEmptyHttpState } from './httpState';
import * as moment from 'moment';
import ServerState, { createEmptyServerState } from './serverState';
export default class ProcessState {
  pid: number;
  http: HttpState;
  server: ServerState;
  time: number;
  constructor(pid, state: { http: HttpState, server: ServerState}) {
    this.pid = pid;
    this.http = state.http || createEmptyHttpState();
    this.server = state.server || createEmptyServerState();
    this.time = state.server.relativeTime;
  }
  getFlatState() {
    return Object.assign({}, this.http, this.server);
  }
  formatTime(formatString) {
    const formattedTime: any = moment(Number(this.server.relativeTime)).format(formatString);
    const http = Object.assign({}, this.http, { 'time': moment(this.http.time).format() });
    const newState = new ProcessState(this.pid, { server: this.server, http });
    newState.server.relativeTime = formattedTime;
    return newState;
  }
}

export function processStateFactory(http, server) {
  const pid = server ? server.pid : "empty";
  return new ProcessState(pid, { http: new HttpState(http), server: new ServerState(server)});
}