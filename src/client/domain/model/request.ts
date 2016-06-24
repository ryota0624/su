export default class Request {
  responseTime: number;
  statusCode: number;
  constructor(param = { responseTime: 0, statusCode: 0 }) {
    this.responseTime = param.responseTime;
    this.statusCode = param.statusCode;
  }
}

export function createRequest(param: { responseTime: number, statusCode: number }) {
  return new Request(param);
}