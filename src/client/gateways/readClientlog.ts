import * as fs from '../../utils/promiseFs';
export interface Clientlog {
  time: number;
  responseTime: number;
  statusCode: number;
}

function parseArtilleryLogs(latencies): Array<Clientlog> {
  return latencies
    .map(latency => ({ time: latency[0], responseTime: latency[2] ,statusCode: latency[3] }));
    //.map(log => `${log.time},${log.responseTime},${log.statusCode}`);
}

export interface ReadClientlog {
  readpath: string;
  run(): Promise<Array<Clientlog>>;
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