import Metrics, { createMetrics } from './metrics';
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
export function createRunning(id: number, param: { name: string,duration: number, arrivalRate: number }, metricses: Array<Metrics>) {
  const { name, duration, arrivalRate } = param;
  return new Running({ metricses: metricses, id, duration, arrivalRate, name });
}