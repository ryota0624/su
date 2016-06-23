import * as fs from 'fs';
import { spawnSync } from 'child_process'
import { getPromise } from '../../utils/request';
import { LoadTestGateway, SutyJob } from '../usecases/interface/loadTest';


export interface ArtilleryConfig {
  config: {
    target: string;
    phases: Array<{ duration: number, arrivalRate: number }>;
  }
  outputname: string;
  scenarios: Array<{ flow: Array<{ get: { url: string} }> }>
}

export class MockLoadTest implements LoadTestGateway {
  resultpath: string;
  constructor({ path }: { path: string }) {
    this.resultpath = path;
  }
  run(config: SutyJob) {
    return Promise.resolve(this.resultpath);
  }
}
export class ArtilleryGateway implements LoadTestGateway{
  resultpath: string;
  constructor({ path }: { path: string }) {
    this.resultpath = path;
  }
  run(config: SutyJob) {
    this.init(config);
    return getPromise(`${config.target}/suty/start`)
    .then(() => this.test(config))
    .then(() => getPromise(`${config.target}/suty/stop`))
    .then(() => {
      return this.resultpath
    });
  }
  private test(config: SutyJob) {
    return new Promise((res, rej) => {
      const spawn = require('child_process').spawn;
      const artilleryPath = `${process.env.PWD}/node_modules/artillery/bin/artillery`;
      const artillery = spawn(artilleryPath, ['run', `${__dirname}/config.json`, '-o', this.resultpath]);
      artillery.stdout.pipe(process.stdout);
      artillery.stderr.pipe(process.stderr);
      artillery.on('close', code => {
        //this.resultpath = outputpath + '.json';
        res(code);
      });
    });
  }
  private init(config: SutyJob) {
    let artyConfig: ArtilleryConfig = {
      config: {
        target: null,
        phases: null
      },
      scenarios: null,
      outputname: null
    };
    artyConfig.config.target = config.target;
    artyConfig.config.phases = [{ duration: config.duration, arrivalRate: config.rate }];
    artyConfig.scenarios = config.scenarios || [{ 'flow': [{'get': {'url': '/'} }]}];
    fs.writeFileSync(`${__dirname}/config.json`, JSON.stringify(artyConfig));
  }
}

//  // t.run().then(() => console.log()).catch(err => console.log(err))