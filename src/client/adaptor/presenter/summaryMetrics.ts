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
const app = new AssignedApp;

export default function (runnings: Array<Running>, config = { splitTime: 5, timeStr: "sec", duration: 30, throughProps: ["statusCode"], fileopen: true }) {
  header = header.filter(propName => config.throughProps.indexOf(propName) === -1 ? true : false);
  const { splitTime, timeStr, duration } = config;
  const floorLen = Number((duration / splitTime).toFixed());
  const timeHeader = "," + _.range(0, header.length).map(() => _.range(0, floorLen).map((t, index) => {
    const startTime = index === 0 ? 0 : (index) * splitTime;
    const endTime = (index + 1) * splitTime;
    return `${startTime} ~${endTime}(${timeStr})`;
  }).join(',')).join(',') + "\n";
  const headers = "name," + header.map((prop) => {
    return [prop].concat(Array.from({ length: floorLen - 1 })).join(',');
  }).join(',') + '\n';
  fs.writeFileSync(`${process.env.PWD}/logs/summary/summary-duration${duration}-split${splitTime}.csv`, headers);
  fs.appendFileSync(`${process.env.PWD}/logs/summary/summary-duration${duration}-split${splitTime}.csv`, timeHeader);
  runnings.forEach(running => { runningStr(running, splitTime, timeStr, floorLen, duration) });
  if (config.fileopen) app.open(`${process.env.PWD}/logs/summary/summary-duration${duration}-split${splitTime}.csv`, "/Applications/Microsoft Excel.app/Contents/MacOS/Microsoft Excel");
  console.log(`output > ${process.env.PWD}/logs/summary/summary-duration${duration}-split${splitTime}.csv`);
}

function runningStr(running: Running, splitTime, timeStr, floorLen, duration) {
  try {
    const convMetrics = (rawMetricses: Metrics[]) => {
      const metricses = rawMetricses.map(metrics => metrics.setCapacityMB());
      const lines = metricses.map(metrics => Object.assign({}, metrics.computer, metrics.process, metrics.request))
        .map((record: any) => Object.assign({}, record, { relativeTime: Math.floor(record.relativeTime / separateTimeStr) }));
      const timeAverage = groupedTime(lines, { fixed: true });
      const propAverage: any = propsLine(timeAverage, floorLen);
      return propAverage;
    };
    const filenames = [];
    const separateTimeStr = timeBase(timeStr, splitTime);
    const propAverageObject = convMetrics(running.metricses);
    const propLineStr = `${running.name}-${running.duration}-${running.arrivalRate}` + "," + header.map(prop => {
      if (propAverageObject[prop]) return propAverageObject[prop].join(',');
      else return ",";
    }) + "\n";
    fs.appendFileSync(`${process.env.PWD}/logs/summary/summary-duration${duration}-split${splitTime}.csv`, propLineStr);
  } catch (err) { console.log(err) }
}