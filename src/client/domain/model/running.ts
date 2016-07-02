import Metrics from './metrics';
export default class Running {
  name: string;
  id: number;
  duration: number;
  arrivalRate: number;
  metricses: Array<Metrics>;
  constructor(param = { name: "", id: 0, duration: 0, arrivalRate: 0 , metricses: []}) {
    this.name = param.name;
    this.id = param.id;
    this.duration = param.duration;
    this.arrivalRate = param.arrivalRate;
    this.metricses = param.metricses;
  }
}
export function createRunning(param: { name: string, id: number, duration: number, arrivalRate: number }, metricses: Array<Metrics>) {
  const { name, id, duration, arrivalRate } = param;
  return new Running({ metricses, id, duration, arrivalRate, name });
}