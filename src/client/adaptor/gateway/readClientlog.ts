import * as fs from '../../../utils/promiseFs';
import { ReadClientlog } from '../../domain/usecase/interface/readClientlog';
import Request, { createRequest } from '../../domain/model/request';
function parseArtilleryLogs(latencies): Array<Request> {
  return latencies
    .map(latency => ({ responseTime: latency[2] ,statusCode: latency[3] }))
    .map(request => createRequest(request));
}
export class ReadClientlogFS implements ReadClientlog {
  readpath: string;
  constructor({ path }: { path: string }) {
    this.readpath = path;
  }
  run() {
    return fs.promiseReadFile(this.readpath)
    .then((artilleryReportFile: any) =>  JSON.parse(artilleryReportFile).aggregate.latencies)
    .then(artilleryLogs => parseArtilleryLogs(artilleryLogs))
  }
}

// const l = new ReadClientlogFS().run({ path: `${process.env.PWD}/logs/client/hoge.json`}).then(res => console.log(res)).catch(err => console.log(err))