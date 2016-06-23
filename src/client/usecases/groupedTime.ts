import { ProcessStatusRepo } from '../repository/processStatus';
import  ProcessStatus, { headerArr } from '../model/processStatus';
import * as _ from 'lodash';
export class GroupedTime {
  statusRepo: ProcessStatusRepo;
  constructor(params: { statusRepo: ProcessStatusRepo }) {
    this.statusRepo = params.statusRepo;
  }
  run() {
    return this.statusRepo.getAll().map(statuses => {
      const grouped = statuses.status.getTimeGrouped();
      const keys = Object.keys(grouped)
      return keys.map(key => ({ time: key, value: averageFlatState(grouped[key].map(group => group.getFlatState())) }))
    }).forEach(i => console.log(i));
  }
}

function averageFlatState(arr: Array<any>) {
  console.log(_)
  
  return arr;
}