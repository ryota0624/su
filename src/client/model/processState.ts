import RequestState, { createRequestState } from './requestState';
import ServerState, { createServerState } from './serverState';

import * as moment from 'moment';
export default class ProcessState {
  pid: number;
  request: RequestState;
  server: ServerState;
  time: number;
  constructor(pid, state: { request: RequestState, server: ServerState}) {
    this.pid = pid;
    this.request = state.request || createRequestState();
    this.server = state.server || createServerState();
    this.time = state.server.relativeTime;
  }
  getFlatState() {
    return Object.assign({}, this.request, this.server);
  }
  formatTime(formatString) {
    const formattedTime: any = moment(Number(this.server.relativeTime)).format(formatString);
    const request = Object.assign({}, this.request, { 'time': moment(this.request.time).format() });
    const newState = new ProcessState(this.pid, { server: this.server, request });
    newState.server.relativeTime = formattedTime;
    return newState;
  }
}

export function processStateFactory(request, server) {
  const pid = server ? server.pid : "empty";
  return new ProcessState(pid, { request: new RequestState(request), server: new ServerState(server)});
}