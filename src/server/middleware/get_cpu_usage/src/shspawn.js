'use strict'
const spawn = require('child_process').spawn;
function shspawn(command) {
  let buf="";
  return new Promise((res, rej) => {
    const child = spawn('sh', ['-c', command]);
    child.stdout.on('data',(data) => {
      buf=buf+data;
    });
    child.stderr.on('data', (data) => {
      rej(data);
    });
    child.on('close', (code) =>  {
      res(buf);
    });
  });
}

module.exports = shspawn;