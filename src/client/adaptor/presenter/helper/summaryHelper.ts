import * as _ from 'lodash';
import { objectAverage } from '../../../../utils/object';
export function parse(line, header) {
  const element = header.map(prop => line[prop]);
  return element.join(',') + "\n";
}

export function groupedTime(target: Array<any>, config = { fixed: false }) {
  const timeGrouped = _.groupBy(target, 'relativeTime');
  const keys = Object.keys(timeGrouped);
  const fn = config.fixed ? (a) => floorNum(a, 2) : (a) => a ;
  const averages = keys.map((time) => {
    const through = ["mid", "relativeTime", "pid", "statusCode"];
    return objectAverage(timeGrouped[time], through, fn);
  });
  return averages;
}

export function floorNum(num, n) {
  const pow = Math.pow(10, n);
  return Math.floor(num * pow) / pow
}

export function timeBase(str ,num) {
  switch(str) {
    case 'msec': return num;
    case 'sec': return 1000 * num;
    case 'min': return 1000 * 60 * num;
    case 'h': return 100 * 60 * 60 * num;
    default: throw new Error("規定外文字列が入力されました")
  }
}

export function propsLine(recordArr, floorLen) {
  try {
  if(!recordArr[0]) return {};
  const keys = Object.keys(recordArr[0]);
  const props = keys.map((key) => {
    const propValue = recordArr.map(record => { 
      return record[key]
    });
    if(propValue.length != floorLen) { 
      propValue.length = floorLen;
    }
    return { key: key, value: propValue } ;
  });
  return props.reduce((pre, cur) => Object.assign({}, { [cur.key]: cur.value }, pre), {});
  } catch(err) {
     console.log("hogeho" +err) 
  };
}