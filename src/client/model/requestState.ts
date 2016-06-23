export default class RequestState {
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

export function createRequestState({ time, responseTime, statusCode } = defaultParams) {
  return new RequestState({ time, responseTime, statusCode });
}