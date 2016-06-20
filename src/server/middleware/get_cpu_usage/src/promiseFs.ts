import * as fs from 'fs';
export function appendFile(path, data) {
  return new Promise((res, rej) => {
    fs.appendFile(path, data, (err, data) => {
      if(err) return rej(err);
      return res(data);
    });
  });
}
export function writeFile(path, data) {
  return new Promise((res, rej) => {
    fs.writeFile(path, data, (err, data) => {
      if(err) return rej(err);
      return res(data);
    });
  });
}
