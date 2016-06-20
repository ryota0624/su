import { ProcessStatusRepo } from '../repository/processStatus';
import { OutputGW } from '../gateway/output';
import { ExternalApp } from '../gateway/externalApp'

export class OutputStatus {
  statusRepo: ProcessStatusRepo;
  output: OutputGW;
  externalApp: ExternalApp;
  constructor(params: { statusRepo: ProcessStatusRepo, output: OutputGW, externalApp: ExternalApp }) {
    this.output = params.output;
    this.statusRepo = params.statusRepo;
    this.externalApp = params.externalApp;
  }
  run({ timeFormat }: { timeFormat: string }) {
    return this.statusRepo.getAll()
      .map(status => status.status.formatTime(timeFormat))
      .map(status => () => this.output.write(status))
      .reduce((pre, cur) => pre.then(cur), Promise.resolve(0))
      .then(() => this.externalApp.run());
  }
}