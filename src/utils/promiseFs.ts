const fs = require('fs');

export function promiseReadFile(filepath) {
  return new Promise((res) => {
    fs.readFile(filepath, (err, data) => {
      if(err) return res(err);
      res(data);
    });
  });
}

export function promiseWriteFile(filepath, data) {
  return new Promise((res) => {
    fs.appendFile(filepath, data, (err, data) => {
      if(err) return res(err);
      res(data);
    });
  });
}

export function promiseUnLink(filepath) {
  return new Promise((res) => {
    fs.unlink(filepath, (err) => {
      if(err) return res(err);
      res(true);
    });
  });
}

