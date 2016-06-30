import * as fs from 'fs';
import * as _ from 'lodash';
import Running from '../../domain/model/running';
import Metrics from '../../domain/model/metrics';
import Computer from '../../domain/model/computer';
import Process from '../../domain/model/process';
import Request from '../../domain/model/request';
import {timeBase, groupedTime, propsLine} from './helper/summaryHelper';

import {DefaultApp, AssignedApp} from '../gateway/externalApp';

let header = ["pid", "osFreeMem", "osTotalMem", "la/1min", "la/5min", "la/15min", "heapTotal", "heapUsed", "responseTime", "statusCode"];
const throughProps = ["heapTotal", "heapUsed", "pid"];
const primaryProps = ["pid"];
const app = new AssignedApp;

export default function(runnings: Array<Running>, config = { splitTime: 5, timeStr: "sec", duration: 30, throughProps: ["statusCode"], fileopen: true }) {
  const filename = `${process.env.PWD}/logs/summary/summary-duration${config.duration}-split${config.splitTime}-computer.csv`;
  header = header.filter(propName => throughProps.indexOf(propName) === -1 ? true : false);
  const { splitTime, timeStr, duration } = config;
  const floorLen = Number((duration / splitTime).toFixed());
  const timeHeader = ","+_.range(0, header.length).map(() => _.range(0, floorLen).map((t, index) => {
    const startTime = index === 0 ? 0 : (index) * splitTime;
    const endTime = (index +1) * splitTime;
    return `${startTime} ~${endTime}(${timeStr})`;
  }).join(',')).join(',') + "\n";
  const headers = "name," + header.map((prop) => {
    return [prop].concat(Array.from({ length: floorLen -1 })).join(',');
  }).join(',') + '\n';
  fs.writeFileSync(filename, headers);
  fs.appendFileSync(filename, timeHeader);
  runnings.forEach(running => { runningStr(running, splitTime, timeStr, floorLen, duration, filename)});
  if(config.fileopen) app.open(filename, "/Applications/Microsoft Excel.app/Contents/MacOS/Microsoft Excel");
  console.log(`output > ${filename}`);
}

function runningStr(running: Running, splitTime, timeStr, floorLen, duration, filename) {
  try {
    const filenames = [];
    const separateTimeStr = timeBase(timeStr, splitTime);
    const propAverageObject = running.metricses.map(rawMetrics => {
      const metrics = rawMetrics.setCapacityMB();
      const zipedMetrics = _.zip<Computer | Process | Request>(metrics.computers, metrics.processes, metrics.requests);
      const lines = zipedMetrics.map(ziped => Object.assign({}, ziped[0], ziped[1], ziped[2]))
        .map((record: any) => Object.assign({}, record, { relativeTime: Math.floor(record.relativeTime / separateTimeStr) }));
      const timeAverage = groupedTime(lines, { fixed: true });
      const propAverage: any = propsLine(timeAverage, floorLen);
      return propAverage;
    });
    const propLineStr = `${running.name}-${running.duration}-${running.arrivalRate}` + "," + header.map(prop => {
      if(propAverageObject[0][prop]) return propAverageObject[0][prop].join(',');
      else return ",";
    }) + "\n";
    fs.appendFileSync(filename, propLineStr);
  } catch(err) {console.log(err)}
}