import * as fs from 'fs';
import { spawnSync } from 'child_process'
import { getPromise } from '../../../utils/request';
import { injectable, inject } from "inversify";

import { LoadTestGateway, SutyClientConfig } from '../../domain/usecase/interface/loadTest';

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
  run() {
    return Promise.resolve(0);
  }
}

@injectable()
export class ArtilleryGateway implements LoadTestGateway{
  resultpath: string;
  config: SutyClientConfig
  constructor({ resultpath, config }: { resultpath: string, config: SutyClientConfig }) {
    this.resultpath = resultpath;
    this.config = config;
  }
  run() {
    console.log(this.resultpath)
    this.init(this.config);
    return getPromise(`${this.config.target}/suty/start`)
    .then(() => this.test(this.config))
    .then(() => getPromise(`${this.config.target}/suty/stop`))
    .then(() => {
      return this.resultpath
    });
  }
  private test(config: SutyClientConfig) {
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