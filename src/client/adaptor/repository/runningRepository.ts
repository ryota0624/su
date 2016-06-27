import { RunningRepository } from '../../domain/interface/repository/runningRepository';
import {injectable} from 'inversify';
import Running from '../../domain/model/running';
import * as fs from 'fs';

@injectable()
export class RunningRepositoryFS implements RunningRepository {
  data: Map<string, Running> = new Map<string, Running>();
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
      this.data.set(entry[0], entry[1]);
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
