export default class HttpState {
  time: number;
  responseTime: number;
  statusCode: number;
  constructor({ time, responseTime, statusCode } = defaultParams) {
    this.time = time;
    this.responseTime = responseTime;
    this.statusCode = statusCode;
  }
}
const defaultParams = {
  time: 0,
  responseTime: 0,
  statusCode: 0,
}

export function createEmptyHttpState() {
  return new HttpState;
}