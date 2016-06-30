import Request, {createRequest} from './request';
import Process, {createProcess} from './process';
import Computer,{createComputer} from './computer';
import * as _ from 'lodash';
export default class Metrics {
  id: number;
  rid: string;
  requests: Array<Request>;
  processes: Array<Process>;
  computers: Array<Computer>;
  constructor(param = { id: 0, rid: "", requests: [], processes: [], computers: [] }) {
    this.requests = param.requests.map(req => createRequest(req));
    this.processes = param.processes.map(pro => createProcess(pro));
    this.computers = param.computers.map(com => createComputer(com));
    this.id = param.id;
    this.rid = param.rid;
  }
  private setCapacity(str) {
    const processes = this.processes.map(elem => elem.setCapacity(str));
    const computers = this.computers.map(elem => elem.setCapacity(str));
    return new Metrics(Object.assign({}, this, {
      processes,
      computers
    }))
  }
  setCapacityMB() {
    return this.setCapacity('mb');
  }
  setCapacityKB() {
    return this.setCapacity('kb');
  }
  setTimeFormat(format) {
    const processes = this.processes.map(elem => elem.setTimeFormat(format));
    const computers = this.computers.map(elem => elem.setTimeFormat(format));
    return new Metrics(Object.assign({}, this, {
      processes,
      computers
    }))
  }
  compact(size) {
    if (this.processes.length / size < 2) return this;
    const processes = this._compact<Process>('processes', size, ["pid", "mid", "relativeTime"], createProcess);
    const computers = this._compact<Computer>('computers', size, ["mid", "relativeTime"], createComputer);
    const requests = this._compact<Request>('requests', size, ["mid", "statusCode"], createRequest);
    return new Metrics(Object.assign({}, this, {processes}, {computers}, {requests}));
  }
  private _compact<T>(propname, size, pass: Array<string> = [], fun = (a) => a): Array<T> {
    const futureSize = this[propname].length / size;
    const chunkArr = _.chunk(this[propname], futureSize);
    return chunkArr.map(arr => objectAverage(arr, pass)).map(ave => fun(ave));
  }
  getProcessStatus() {
    let pids = [];
    this.processes.forEach(process => {
      if(pids.indexOf(process.pid) === -1) pids.push(process.pid);
    });
    return pids.map((pid: number) => {
      return { pid, processes: this.processes.filter(process => process.pid === pid) };
    })
  }
}

export function createMetrics(param: {
  requests: Array<Request>;
  processes: Array<Process>;
  computers: Array<Computer>;
  id: number;
  rid: string;
}) {
  return new Metrics(param);
}


function objectAverage(objArr, pass: Array<string> = []) :any {
  const keys = Object.keys(objArr[0]);
  const keyProps = keys.map(key => {
    if (pass.indexOf(key) !== -1) return { [key]: objArr[0][key] };
    return {
      [key]: objArr.reduce((pre, cur, index) => {
        const div = index === 0 ? 1 : 2;
        return (pre + cur[key]) / div;
      }, 0)
    };
  });
  return keyProps.reduce((cur, pre) => Object.assign({}, cur, pre), {});
};
