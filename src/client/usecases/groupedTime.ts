import { ProcessStatusRepo } from '../repository/processStatus';
import { headerArr } from '../model/processStatus';
import * as _ from 'lodash';
export class GroupedTime {
  statusRepo: ProcessStatusRepo;
  constructor(params: { statusRepo: ProcessStatusRepo }) {
    this.statusRepo = params.statusRepo;
  }
  run() {
    return this.statusRepo.getAll().map(statuses => {
      const grouped = statuses.status.getTimeGrouped();
      const times = Object.keys(grouped);
      const props = times.map(time => {
        return { time, value: headerArr.map(prop => {
          return { prop, value: _.filter(grouped[time], props) }
        })}
      });
      console.log(props)
    });
  }
}