export function promiseSucc<T>(promisies: Array<() => Promise<T>>, result: Array<T> = []): Promise<Array<T>> {
  if(promisies.length === 0) return Promise.resolve(result);
  const task = promisies[0];
  return task().then(res => {
    const promisiesLen = promisies.length;
    result.push(res);
    return promiseSucc<T>(promisies.slice(1, promisiesLen), result);
  });
}