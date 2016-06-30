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

export function createRunning(param: { name: string, id: number, duration: number, arrivalRate: number }, metricses: Array<Metrics>) {
  const newMatrices = metricses.map(metrics => {
    const requests = metrics.requests;
    const processes = metrics.processes;
    const computers = metrics.computers;
    return new Metrics(Object.assign(metrics, { requests, computers, processes }));
  });
  const { name, id, duration, arrivalRate } = param;
  return new Running({ metricses: newMatrices, id, duration, arrivalRate, name });
}