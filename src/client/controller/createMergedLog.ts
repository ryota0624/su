import { CreateMergedLog } from '../usecases/createMergedLog';
import { OutputStatus } from '../usecases/outputStatus';

import { OutputCSVFile } from '../gateway/output';
import { ReadClientlogFS } from '../gateway/readClientlog';
import { MergeWithServerlogRequest, MergeWithServerlogFS } from '../gateway/mergeWithServerlog';
import { DefaultApp } from '../gateway/externalApp';


export default function mesureController(config, repo) {
  const readClientlog = new ReadClientlogFS({ path: process.env.PWD + '/logs/client/Warm-up.3.5.json'});
  const mergeWithServerlog = new MergeWithServerlogFS({ path: process.env.PWD + '/logs/server/sampleScript.js.csv1466408902825.csv'});
  const mesureUsecase = new CreateMergedLog({ processStatusRepo: repo, readClientlogGW: readClientlog, mergeWithServerlogGW: mergeWithServerlog, config: { logname: "meged"  } });
  mesureUsecase.run().then(() => {
    const output = new OutputCSVFile({ path: process.env.PWD + '/logs/status/merged.3.30.csv' });
    const defaultApp = new DefaultApp(process.env.PWD + '/logs/status/merged.3.30.csv');
    const outputStatus = new OutputStatus({ output, statusRepo: repo });
    outputStatus.run({ timeFormat: config.timeformat});
  });
}
