import * as fs from 'fs';
import { spawnSync } from 'child_process'
import { getPromise } from '../../../utils/request';
import { injectable } from "inversify";

import { LoadTestGateway, SutyClientConfig } from '../../domain/interface/loadTest';

export interface ArtilleryConfig {
  config: {
    target: string;
    phases: Array<{ duration: number, arrivalRate: number }>;
    variables: any,
  }
  outputname: string;
  scenarios: Array<{ flow: Array<{ get: { url: string} }> }>
  payload: any
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
export class ArtilleryGateway implements LoadTestGateway {
  run(config: SutyClientConfig) {
    this.init(config);
    return getPromise(`${config.target}/suty/start`)
    .then((result: any) => {
      if(result.errno) {
        console.log(`${config.target}/suty/start へのリクエストに失敗しました
        ${result}
        `);
      }
    })
    .then(() => this.test(config))
    .then(() => getPromise(`${config.target}/suty/stop`))
    .then((result: any) => {
      if(result.errno) {
        console.log(`${config.target}/suty/stop へのリクエストに失敗しました
        ${result}
        `);
      }
    })
    .then(() => {
      return config
    });
  }
  private test(config: SutyClientConfig) {
    const outputpath = config.clientlogPath.replace(".json", "");
    return new Promise((res, rej) => {
      const spawn = require('child_process').spawn;
      const artilleryPath = `${process.env.PWD}/node_modules/artillery/bin/artillery`;
      const artilleryCmd = ['run', `${__dirname}/config.json`, '-o', outputpath];
      if(config.artilleryQuiet) artilleryCmd.push('-q');
      const artillery = spawn(artilleryPath, artilleryCmd);
      artillery.stdout.pipe(process.stdout);
      artillery.stderr.pipe(process.stderr);
      artillery.on('close', code => {
        res(code);
      });
    });
  }
  private init(config: SutyClientConfig) {
    let artyConfig: ArtilleryConfig = {
      config: {
        target: null,
        phases: null,
        variables: null,
      },
      scenarios: null,
      outputname: null,
      payload: null,
    };
    artyConfig.config.target = config.target;
    artyConfig.config.phases = [{ duration: config.duration, arrivalRate: config.rate }];
    artyConfig.scenarios = config.scenarios || [{ 'flow': [{'get': {'url': '/'} }]}];
    artyConfig.config.variables = config.variables || {};
    artyConfig.payload = config.payload || {};
    try {
    fs.writeFileSync(`${__dirname}/config.json`, JSON.stringify(artyConfig));
    } catch (err) { console.log(err)}
  }
}

//  // t.run().then(() => console.log()).catch(err => console.log(err))