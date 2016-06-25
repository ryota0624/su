import { exec } from 'child_process';

import { ExternalApp } from '../../domain/interface/externalApp';

const openFile = (openApp) => (filename) => exec(`open -a '${openApp}' ${filename}`, (err, data) => {
  if(err) {
    console.log(err);
  }
});

export class DefaultApp implements ExternalApp {
 open(filename: string) {
    return new Promise((res, rej) => {
      exec(`open ${filename}`, (err, data) => {
        if(err) process.stderr.write(err.toString());
        res(data);
      });
    });
  }
}

export default openFile;
