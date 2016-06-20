function eventAppend(worker) {
  worker.on('disconnect', (worker) => {
    process.stdout.write('disconnect\n');
  });
  worker.on('error', (err) => {
    const errStr = `worker error
    err: ${err}`;
    process.stdout.write(errStr);
  });
  worker.on('exit', (code, signal) => {
    const exitStr = `
    worker exit
    code: ${code}
    signal: ${signal}
    `;
    process.stdout.write(exitStr);
  });
}

export default eventAppend;