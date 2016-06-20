const getLinuxCPU = require('./src/linuxProcess');

function getCPU(tempo, processName, processDistPath, cpuDistPath) {
  const exec = {
    darwin: getDarwinCPU,
    linux: getLinuxCPU,
  };
  const platform = process.platform;
  return exec[platform](tempo, processName, processDistPath, cpuDistPath);
}
module.exports = getCPU;