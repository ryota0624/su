export function configCreator(phase, config) {
  return Object.assign({}, config, { rate: phase.arrivalRate, duration: phase.duration, logname: phase.name });
}

export function distpathCreator(config) {
  const logname = config.logname.replace(/\s/g,"_");
  return {
    loadTest: `${process.env.PWD}/logs/client/${logname}.${config.duration}.${config.rate}`,
    csv: `${process.env.PWD}/logs/status/${logname}.${config.duration}.${config.rate}.csv`
  }
}