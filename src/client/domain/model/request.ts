export default class Request {
  responseTime: number;
  statusCode: number;
  mid: number;
  constructor(param = { responseTime: 0, statusCode: 0, mid: 0 }) {
    this.responseTime = param.responseTime;
    this.statusCode = param.statusCode;
    this.mid = param.mid;
  }
}

export function createRequest(param: { mid: number, responseTime: number, statusCode: number }) {
  return new Request(param);
}