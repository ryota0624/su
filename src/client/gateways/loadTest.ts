import * as fs from 'fs';
import { spawnSync } from 'child_process'
import { getPromise } from '../../utils/request';

export interface SutyClientConfig {
  target: string;
  duration: number;
  rate: number;
  timeformat: string;
  timeout: number;
  scenarios: any;
  logname: string;
  outputdir: string;
  spreadSheetSoftwarePath: string
}
export interface LoadTestGateway {
  run(config: SutyClientConfig): any;
}
export interface ArtilleryConfig {
  config: {
    target: string;
    phases: Array<{ duration: number, arrivalRate: number }>;
  }
  outputname: string;
  scenarios: Array<{ flow: Array<{ get: { url: string} }> }>
}

export class ArtilleryGateway implements LoadTestGateway{
  resultpath: string;
  run(config: SutyClientConfig) {
    this.init(config);
    return getPromise(`${config.target}/suty/start`)
    .then(() => this.test(config))
    .then(() => getPromise(`${config.target}/suty/stop`))
    .then(() => {
      return this.resultpath
    });
  }
  private test(config: SutyClientConfig) {
    return new Promise((res, rej) => {
      const spawn = require('child_process').spawn;
      const outputpath = `${process.env.PWD}/logs/client/${config.logname}.${config.duration}.${config.rate}`;
      const artilleryPath = `${process.env.PWD}/node_modules/artillery/bin/artillery`;
      const artillery = spawn(artilleryPath, ['run', `${__dirname}/config.json`, '-o', outputpath]);
      artillery.stdout.pipe(process.stdout);
      artillery.stderr.pipe(process.stderr);
      artillery.on('close', code => {
        this.resultpath = outputpath + '.json';
        res(code);
      });
    });
  }
  private init(config: SutyClientConfig) {
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