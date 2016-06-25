import * as fs from '../../../utils/promiseFs';
import { Clientlog, ClientlogRecord } from '../../domain/usecase/interface/readClientlog';
import {injectable} from 'inversify';

function parseArtilleryLogs(latencies): Array<ClientlogRecord> {
  return latencies
    .map(latency => ({ responseTime: latency[2] ,statusCode: latency[3] }))
}
@injectable()
export class ReadClientlogFS implements Clientlog {
  get({ path }) {
    return fs.promiseReadFile(path)
    .then((artilleryReportFile: any) =>  JSON.parse(artilleryReportFile).aggregate.latencies)
    .then(artilleryLogs => parseArtilleryLogs(artilleryLogs))
  }
}

// const l = new ReadClientlogFS().run({ path: `${process.env.PWD}/logs/client/hoge.json`}).then(res => console.log(res)).catch(err => console.log(err))