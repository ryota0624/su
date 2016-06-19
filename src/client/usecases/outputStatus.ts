import ProcessStatusRepo from '../repository/processStatus';
import { OutputGW } from '../gateway/output'
export class OutputStatus {
  statusRepo: ProcessStatusRepo;
  output: OutputGW;
  constructor(params: { statusRepo: ProcessStatusRepo, output: OutputGW }) {
    this.output = params.output;
    this.statusRepo = params.statusRepo;
  }
  run() {
    return this.statusRepo.getAll()
      .map(status => () => this.output.write(status))
      .reduce((pre, cur) => pre.then(cur), Promise.resolve(0));
  }
}