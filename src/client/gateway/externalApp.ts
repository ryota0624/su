import { exec } from 'child_process';

export interface ExternalApp {
  filename: string;
  run()
}

const openFile = (openApp) => (filename) => exec(`open -a '${openApp}' ${filename}`, (err, data) => {
  if(err) {
    console.log(err);
  }
});

export class DefaultApp implements ExternalApp {
  filename: string;
  constructor(filename) {
    this.filename = filename;
  }
 run() {
    return new Promise((res, rej) => {
      exec(`open ${this.filename}`, (err, data) => {
        if(err) process.stderr.write(err.toString());
        res(data);
      });
    });
  }
}

export default openFile;
