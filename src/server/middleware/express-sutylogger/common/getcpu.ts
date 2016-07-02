'use strict';
const spawn = require('child_process').spawn;
function shspawn(command) {
  let buf="";
  return new Promise<string>((res, rej) => {
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

function getDarwinCPU() {
  const command = 'top -l 1 | grep -e "CPU\ usage"';
  const toCPUPar = str => Number(str.match(/[0-9]*.[0-9]*/)[0]);
  return shspawn(command).then(res => {
    const resultArr = res.split(' ');
    const user = toCPUPar(resultArr[2]);
    const system = toCPUPar(resultArr[4]);
    const idle = toCPUPar(resultArr[6]);
    return { user, system, idle };
  });
}

function getLinuxCPU() {
  const command = 'top -n 1 | grep %Cpu';
  return shspawn(command).then(res => {
    const resultArr = res.match(/[0-9]*\.[0-9]*/g);
    const user = Number(resultArr[0]);
    const system = Number(resultArr[1]);
    const idle = Number(resultArr[3]);
    return { user, system, idle };
  });
}

function getCPU() {
  const exec = {
    darwin: getDarwinCPU,
    linux: getLinuxCPU,
  };
  const platform = process.platform;
  return exec[platform]();
}
export default getCPU;