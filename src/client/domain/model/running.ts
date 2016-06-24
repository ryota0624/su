import Metrics from './metrics';
export default class Running {
  name: string;
  rid: string;
  duration: number;
  arrivalRate: number;
  metricses: Array<Metrics>;
  constructor(param = { name: "", rid: "", duration: 0, arrivalRate: 0 , metricses: []}) {
    this.name = param.name;
    this.rid = param.rid;
    this.duration = param.duration;
    this.arrivalRate = param.arrivalRate;
    this.metricses = param.metricses;
  }
}
export function createRunning(param: { name: string, rid: string, duration: number, arrivalRate: number }, metricses: Array<Metrics>) {
  const { name, rid, duration, arrivalRate } = param;
  return new Running({ metricses, rid, duration, arrivalRate, name });
}