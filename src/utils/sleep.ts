export function sleep(time: number):void {
  new Promise((res, rej) => {
    setTimeout(() => res(), time);
  });
}
