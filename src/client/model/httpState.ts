export default class HttpState {
  time: number;
  responseTime: number;
  statusCode: number;
  constructor({ time, responseTime, statusCode }) {
    this.time = time;
    this.responseTime = responseTime;
    this.statusCode = statusCode;
  }
}