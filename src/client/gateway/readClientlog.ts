import * as fs from '../../utils/promiseFs';
import { Clientlog, ReadClientlog } from '../usecases/interface/readClientlog';

function parseArtilleryLogs(latencies): Array<Clientlog> {
  return latencies
    .map(latency => ({ time: latency[0], responseTime: latency[2] ,statusCode: latency[3] }));
    //.map(log => `${log.time},${log.responseTime},${log.statusCode}`);
}
export class ReadClientlogFS implements ReadClientlog {
  readpath: string;
  run({ path }) {
    return fs.promiseReadFile(path)
    .then((artilleryReportFile: any) =>  JSON.parse(artilleryReportFile).aggregate.latencies)
    .then(artilleryLogs => parseArtilleryLogs(artilleryLogs))
  }
}

// const l = new ReadClientlogFS().run({ path: `${process.env.PWD}/logs/client/hoge.json`}).then(res => console.log(res)).catch(err => console.log(err))