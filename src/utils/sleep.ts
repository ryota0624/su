export function sleep(time: number) {
  return new Promise((res, rej) => {
    setTimeout(() => res(0), time);
  });
}
