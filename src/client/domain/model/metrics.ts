import Request, {createRequest} from './request';
import Process, {createProcess} from './process';
import Computer,{createComputer} from './computer';
import * as _ from 'lodash';
export default class Metrics {
  id: number;
  rid: number;
  request: Request;
  process: Process;
  computer: Computer;
  constructor(param = { id: 0, rid: 0, request: new Request, process: new Process, computer: new Computer }) {
    this.request = param.request;
    this.process = param.process;
    this.computer = param.computer;
    this.id = param.id;
    this.rid = param.rid;
  }
  setTimeFormat(format) {
    const process = this.process.setTimeFormat(format);
    const computer = this.computer.setTimeFormat(format);
    return new Metrics(Object.assign({}, this, {
      process,
      computer
    }))
  }
  // compact(size) {
  //   if (this.processes.length / size < 2) return this;
  //   const processes = this._compact<Process>('processes', size, ["pid", "mid", "relativeTime"], createProcess);
  //   const computers = this._compact<Computer>('computers', size, ["mid", "relativeTime"], createComputer);
  //   const requests = this._compact<Request>('requests', size, ["mid", "statusCode"], createRequest);
  //   return new Metrics(Object.assign({}, this, {processes}, {computers}, {requests}));
  // }
  // private _compact<T>(propname, size, pass: Array<string> = [], fun = (a) => a): Array<T> {
  //   const futureSize = this[propname].length / size;
  //   const chunkArr = _.chunk(this[propname], futureSize);
  //   return chunkArr.map(arr => objectAverage(arr, pass)).map(ave => fun(ave));
  // }
}

export function createMetrics(param: {
  request: Request;
  process: Process;
  computer: Computer;
  id: number;
  rid: number;
}) {
  const request = createRequest(param.request);
  const process = createProcess(param.process);
  const computer = createComputer(param.computer);
  return new Metrics({ request, process, computer, id: param.id, rid: param.rid });
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
