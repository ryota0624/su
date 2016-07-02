import { RunningRepository } from '../../domain/interface/repository/runningRepository';
import {injectable} from 'inversify';
import Running, { createRunning } from '../../domain/model/running';
import * as fs from 'fs';
import { createMetrics } from '../../domain/model/metrics';
import { createRequest } from '../../domain/model/request';
import { createProcess } from '../../domain/model/process';
import { createComputer } from '../../domain/model/computer';


@injectable()
export class RunningRepositoryFS implements RunningRepository {
  data: Map<number, Running> = new Map<number, Running>();
  save(entity: Running) {
    this.data.set(entity.id, entity);
    // fs.appendFileSync(process.env.PWD + '/logs/fileDB.json', strEntity);
  }
  getById(id) {
    return this.data.get(id);
  }
  getAllId() {
    return Array.from(this.data).map(entry => entry[0]);
  }
  init() {
    const str = fs.readFileSync(process.env.PWD + '/logs/fileDB.json');
    if(str.length > 0) str.toString().split('|').forEach(entryStr => {
      const entry = JSON.parse(entryStr);
      const metricses = entry[1].metricses.map(obj => {
        const request = createRequest(obj.request);
        const computer = createComputer(obj.computer);
        const process = createProcess(obj.process);
        return createMetrics(Object.assign({}, obj, { request, process, computer }));
      });

      const running = createRunning(Object.assign({}, entry[1]), metricses);
      this.data.set(entry[0], running);
    })
  }
  commit() {
    const entries = Array.from(this.data);
    const str = entries.map(entry => JSON.stringify(entry));
    fs.writeFileSync(process.env.PWD + '/logs/fileDB.json', str.join('|'));
  }
  getAllRunning() {
    const ids = this.getAllId();
    return ids.map(id => this.getById(id));
  }
}
