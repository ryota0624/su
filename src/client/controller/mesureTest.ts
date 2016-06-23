import { Mesure } from '../usecases/mesure';
import { OutputStatus } from '../usecases/outputStatus';

import { OutputCSVFile } from '../gateway/output';
import { MockLoadTest } from '../gateway/loadTest';
import { ReadClientlogFS } from '../gateway/readClientlog';
import { ReadServerlogRequest } from '../gateway/readServerlog';
import { MergeWithServerlogRequest, MergeWithServerlogFS } from '../gateway/mergeWithServerlog';
import { DefaultApp } from '../gateway/externalApp';

export default function mesureController(config, repo) {
  const artillery = new MockLoadTest({ path: process.env.PWD + '/logs/client/date.3.30.json'});
  const readClientlog = new ReadClientlogFS({ path: process.env.PWD + '/logs/client/date.3.30.json'});
  const mergeWithServerlog = new MergeWithServerlogFS({ path: process.env.PWD + '/logs/server/date.3.30.csv'});

  const mesureUsecase = new Mesure({ processStatusRepo: repo ,loadTestGW: artillery, readClientlogGW: readClientlog, mergeWithServerlogGW: mergeWithServerlog });
  
  mesureUsecase.run(config).then(() => {
    const output = new OutputCSVFile({ path: process.env.PWD + '/logs/status/date.3.30.csv' });
    const defaultApp = new DefaultApp(process.env.PWD + '/logs/status/date.3.30.csv');
    
    const outputStatus = new OutputStatus({ output, statusRepo: repo });
    outputStatus.run({ timeFormat: config.timeformat});
  });
}
