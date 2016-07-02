import getLinuxCPU from './src/linuxProcess';

function getCPU(tempo/** sec */, processName, processDistPath, cpuDistPath) {
  const exec = {
    darwin: (tempo, processName, processDistPath, cpuDistPath) => {
      console.log(tempo, processName, processDistPath, cpuDistPath);
    },
    linux: getLinuxCPU,
  };
  const platform = process.platform;
  return exec[platform](tempo, processName, processDistPath, cpuDistPath);
}
export default getCPU;