// import { ReadClientlog } from '../gateway/readClientlog';
// import { MergeWithServerlog } from './interface/mergeWithServerlog';
// import { LoadTestGateway, SutyClientConfig } from './interface/loadTest';

// import { processStausFactory } from '../model/processStatus';
// import { ProcessStatusRepo } from '../repository/processStatus';

// export interface MesureParams {
//   loadTestGW: LoadTestGateway, 
//   readClientlogGW: ReadClientlog, 
//   mergeWithServerlogGW: MergeWithServerlog,
//   processStatusRepo: ProcessStatusRepo
// }

// export class Mesure {
//   loadTestGW: LoadTestGateway;
//   readClientlogGW: ReadClientlog;
//   mergeWithServerlogGW: MergeWithServerlog;
//   processStatusRepo: ProcessStatusRepo;
  
//   constructor(params: MesureParams) {
//     this.loadTestGW = params.loadTestGW;
//     this.readClientlogGW = params.readClientlogGW;
//     this.mergeWithServerlogGW = params.mergeWithServerlogGW;
//     this.processStatusRepo = params.processStatusRepo;
//   }
//   run(config: SutyClientConfig) {
//     return this.loadTestGW.run(config)
//       .then(resultpath => this.readClientlogGW.run())
//       .then(clientlogs => this.mergeWithServerlogGW.run({ clientlogs }))
//       .then(mergedlogs => processStausFactory(mergedlogs))
//       .then(processStatuses => processStatuses.forEach(processStatus => {
//         this.processStatusRepo.add(config.logname ,processStatus);
//       }))
//       .then(() => console.log(this.processStatusRepo))
//   }
// }

// const m = new Mesure({ loadTestGW: null, readClientlogGW:null, readServerlogGW: null });
// console.log(m);