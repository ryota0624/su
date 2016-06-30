import { exec } from 'child_process';
import { injectable } from 'inversify';

import { ExternalApp } from '../../domain/interface/externalApp';

const openFile = (openApp) => (filename) => new Promise((res, rej) => {
  exec(`open -a '${openApp}' ${filename}`, (err, data) => {
    if(err) {
      return rej(err);
    }
    return res(data);
  });
})


@injectable()
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

@injectable()
export class AssignedApp implements ExternalApp {
  open(filename: string, appPath: string) {
    const app = openFile(appPath);
    app(filename).then(() => {}).catch(err => console.log(err));
  }
}

export default openFile;
