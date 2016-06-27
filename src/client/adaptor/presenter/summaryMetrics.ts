import * as fs from 'fs';
import * as _ from 'lodash';
import Running from '../../domain/model/running';
import Metrics from '../../domain/model/metrics';
import Computer from '../../domain/model/computer';
import Process from '../../domain/model/process';
import Request from '../../domain/model/request';
let header = ["pid", "osFreeMem", "osTotalMem", "la/1min", "la/5min", "la/15min", "heapTotal", "heapUsed", "responseTime", "statusCode"];

export default function(runnings: Array<Running>, config = { splitTime: 5, timeStr: "sec"/** , floorLen: 10*/, duration: 30, throughProps: [] }) {
  header = header.filter(propName => config.throughProps.indexOf(propName) === -1 ? true : false);
  const { splitTime, timeStr, duration } = config;
  const floorLen = Number((duration / splitTime).toFixed());
  // const splitTime = 6; /**　何ミリ秒 */
  // const timeStr = "sec"; /** 時間単位 */
  // const floorLen = 11; /** 何個区切りになるか */
  const timeHeader = ","+_.range(0, header.length).map(() => _.range(0, floorLen).map((t, index) => {
    const startTime = index === 0 ? 0 : (index) * splitTime;
    const endTime = (index +1) * splitTime;
    return `${startTime} ~${endTime}(${timeStr})`;
  }).join(',')).join(',') + "\n";

  const headers = "name," + header.map((prop) => {
    return [prop].concat(Array.from({ length: floorLen -1 })).join(',');
  }).join(',') + '\n';
  fs.writeFileSync(`${process.env.PWD}/logs/summary/summary-duration${duration}-split${splitTime}.csv`, headers);
  fs.appendFileSync(`${process.env.PWD}/logs/summary/summary-duration${duration}-split${splitTime}.csv`, timeHeader);
  runnings.forEach(running => { runningStr(running, splitTime, timeStr, floorLen, duration)});
}

function runningStr(running: Running, splitTime, timeStr, floorLen, duration) {
  try {
    const filenames = [];
    const separateTimeStr = timeBase(timeStr, splitTime);
    let headerPropElementNum = null/**ヘッダーの１プロパティごとの数値の数 */
    const propAverageObject = running.metricses.map(metrics => {
      const zipedMetrics = _.zip<Computer | Process | Request>(metrics.computers, metrics.processes, metrics.requests);
      const lines = zipedMetrics.map(ziped => Object.assign({}, ziped[0], ziped[1], ziped[2]))
        .map((record: any) => Object.assign({}, record, { relativeTime: Math.floor(record.relativeTime / separateTimeStr) }));

      const timeAverage = groupedTime(lines);
      const propAverage: any = propsLine(timeAverage, floorLen);
      headerPropElementNum = propAverage.pid.length;
      return propAverage;
    });
    const propLineStr = `${running.name}-${running.duration}-${running.arrivalRate}` + "," + header.map(prop => {
      if(propAverageObject[0][prop]) return propAverageObject[0][prop].join(',');
      else return ",";
    }) + "\n";
    fs.appendFileSync(`${process.env.PWD}/logs/summary/summary-duration${duration}-split${splitTime}.csv`, propLineStr);
  } catch(err) {console.log(err)}
}

function parse(line: {} | Computer & Process & Request) {
  const element = header.map(prop => line[prop]);
  return element.join(',') + "\n";
}

function groupedTime(target: Array<Computer | Process | Request>) {
  const timeGrouped = _.groupBy(target, 'relativeTime');
  const keys = Object.keys(timeGrouped);
  const averages = keys.map((time) => {
    const through = ["mid", "relativeTime", "pid", "statusCode"];
    return objectAverage(timeGrouped[time], through);
  });
  return averages;
}

function timeBase(str ,num) {
  switch(str) {
    case 'msec': return num;
    case 'sec': return 1000 * num;
    case 'min': return 1000 * 60 * num;
    case 'h': return 100 * 60 * 60 * num;
    default: throw new Error("規定外文字列が入力されました")
  }
}

function objectAverage(objArr, pass: Array<string> = []) :any {
  const keys = Object.keys(objArr[0]);
  const keyProps = keys.map(key => {
    if (pass.indexOf(key) !== -1) return { [key]: objArr[0][key] };
    return {
      [key]: objArr.reduce((pre, cur, index) => {
        const div = index === 0 ? 1 : 2;
        return (pre + cur[key]) / div;
      }, 0)
    };
  });
  return keyProps.reduce((cur, pre) => Object.assign({}, cur, pre), {});
};

function propsLine(recordArr, floorLen) {
  console.log(recordArr);
  if(!recordArr[0]) return {};
  const keys = Object.keys(recordArr[0]);
  const props = keys.map((key) => {
    const propValue = recordArr.map(record => record[key]);
    if(propValue.length != floorLen) { 
      propValue.length = floorLen;
    }
    return { key: key, value: propValue } ;
  });
  return props.reduce((pre, cur) => Object.assign({}, { [cur.key]: cur.value }, pre), {});
}