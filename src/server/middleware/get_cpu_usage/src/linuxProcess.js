'use strict';
const fs = require('./promiseFs');
const shspawn = require('./shspawn');
function parseCpuUsageLinux(str) {
 const cpuArr = str.split(/\s+|\%|,/).filter(i => Number(i) || i === '0.0' );
 const user = cpuArr[0];
 const system = cpuArr[1];
 const nice = cpuArr[2];
 const idle = cpuArr[3];
 const wa = cpuArr[4];
 const hi = cpuArr[5];
 const si = cpuArr[6];
 const st = cpuArr[7];
 return { user, system, nice, idle, wa, hi, si, st }
}
function parseProcessUsageLinux(str) {
  const usageArr = str.split(/\s+/);
  const pid = usageArr[0];
  const user = usageArr[1];
  const pr = usageArr[2];
  const ni = usageArr[3];
  const virtualMemory = usageArr[4];
  const rss = usageArr[5];
  const sheraMemory = usageArr[6];
  const status = usageArr[7];
  const cpu = usageArr[8];
  const memory = usageArr[9];
  const time = usageArr[10];
  return { pid, user, pr, ni, virtualMemory, rss, sheraMemory, status, cpu, memory, time }
}
function getProcessUsageLinux(processName, time, processDistPath, cpuDistPath) {
  const command = `top -n ${time} -b | grep -E "${processName}|Cpu"`;
  return shspawn(command)
  .then(result => {
    const resArr = result.split('\n');
    const processLine = resArr.filter(line => line.match(processName)).map(parseProcessUsageLinux);
    const cpuLine = resArr.filter(line => line.match('Cpu')).map(parseCpuUsageLinux);
    return { process: processLine, cpu: cpuLine };
  })
  .then(usage => {
    const promises = [];
    if(processDistPath) {
      usage.process.forEach(process => {
        const processStr = `${process.pid},${process.user},${process.pr},${process.ni},${process.virtualMemory},${process.rss},${process.sheraMemory},${process.status},${process.cpu},${process.memory},${process.time}\n`;
        promises.push(fs.appendFile(processDistPath ,processStr));
      })
    }
    if(cpuDistPath) {
      usage.cpu.forEach(cpu => {
        const cpuStr = `${cpu.user},${cpu.system},${cpu.nice},${cpu.idle},${cpu.wa},${cpu.hi},${cpu.si},${cpu.st}\n`;
        promises.push(fs.appendFile(cpuDistPath, cpuStr));
      })
    }
    return Promise.all(promises);
  });
}

function temporalGetUsageLinux(tempo, processName, processDistPath, cpuDistPath) {
  const tmp = () => {
    getProcessUsageLinux(processName, tempo, processDistPath, cpuDistPath)
    .catch(err => console.log(err));
    setTimeout(tmp, tempo * 1000);
  }
  const promises = [];
  promises.push(fs.writeFile(processDistPath, 'PID,USER,PR,NI,VIRT,RES,SHR,STATUS,%CPU,%MEM,TIME\n'));
  promises.push(fs.writeFile(cpuDistPath, 'user,system,nice,idle,wa,hi,si\n'));
  Promise.all(promises)
  .then(() => tmp())
  .catch(err => console.log(err))
}
// temporalGetUsage(5, 'node', './process.txt', './cpu.txt');
module.exports = temporalGetUsageLinux;