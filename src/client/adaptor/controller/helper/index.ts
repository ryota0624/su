export function configCreator(phase, baseConfig) {
  let config = Object.assign({}, baseConfig, { rate: phase.arrivalRate, duration: phase.duration, logname: phase.name });
  const logname = config.logname.replace(/\s/g,"_");
  config.clientlogPath = `${process.env.PWD}/logs/client/${logname}.${config.duration}.${config.rate}.json`;
  config.serverlogPath = `${config.target}/suty/log`;
  return config;
}

// export function distpathCreator(config) {
//   const logname = config.logname.replace(/\s/g,"_");
//   return {
//     loadTest: `${process.env.PWD}/logs/client/${logname}.${config.duration}.${config.rate}`,
//     csv: `${process.env.PWD}/logs/status/${logname}.${config.duration}.${config.rate}.csv`
//   }
// }