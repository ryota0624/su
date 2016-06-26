'use strict';
export function csvToArray(csv) {
  const lineToObj = (line) => line.split(',')
  .reduce((prev, curr, i) => {
    const data = curr;//Number(curr) || curr;
    return Object.assign({}, prev, { [header[i]]:data });
  }, {});
  let dataArray = csv.split('\n').filter(i => i);
  const header = dataArray.shift().split(',');
  return dataArray.map(lineToObj);
}