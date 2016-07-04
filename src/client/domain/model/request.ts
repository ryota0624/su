export default class Request {
  responseTime: number;
  statusCode: number;
  mid: number;
  constructor(param = { responseTime: 0, statusCode: 0, mid: 0 }) {
    this.responseTime = Number(param.responseTime);
    this.statusCode = param.statusCode;
    this.mid = param.mid;
  }
}

export function createRequest(mid: number, param: { responseTime: number, statusCode: number }) {
  const { responseTime, statusCode } = param;
  return new Request({ mid, responseTime, statusCode });
}