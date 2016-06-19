import ProcessStatus from '../model/processStatus';

export default class ProcessStatusRepo {
  data: Map<number, ProcessStatus>;
  constructor() {
    this.data = new Map<number, ProcessStatus>();
  }
  add(status: ProcessStatus) {
    this.data.set(status.pid, status);
  }
  readFromFile(path) {

  }
  getAll(): Array<ProcessStatus> {
    let arr = [];
    this.data.forEach(status => arr.push(status));
    return arr;
  }
}