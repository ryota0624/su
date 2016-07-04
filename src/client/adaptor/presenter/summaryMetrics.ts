import * as fs from 'fs';
import * as _ from 'lodash';
import Running from '../../domain/model/running';
import Metrics from '../../domain/model/metrics';
import Computer from '../../domain/model/computer';
import Process from '../../domain/model/process';
import Request from '../../domain/model/request';
import {timeBase, groupedTime, propsLine} from './helper/summaryHelper';

import {DefaultApp, AssignedApp} from '../gateway/externalApp';

const header = ["pid", "osFreeMem", "osTotalMem", "la/1min", "la/5min", "la/15min", "heapTotal", "heapUsed", "responseTime"];
const oneHeaderProp = ["pid"];
const headerMap = new Map<string, string>([["osFreeMem", "osFreeMem/mb"], ["osFreeMem", "osFreeMem/mb"], ["relativeTime", "relativeTime/ms"], ["responseTime", "responseTime/ms"], ['heapUsed', "heapUsed/mb"], ['heapTotal', 'heapTotal/mb']] );

const app = new AssignedApp;

export default function (runnings: Array<Running>, config = { splitTime: 5, timeStr: "sec", duration: 30, fileopen: true }) {
  const { splitTime, timeStr, duration } = config;
  const floorLen = Number((duration / splitTime).toFixed());
  const concreateHeader = "name," + header.map((prop) => {
    if(oneHeaderProp.indexOf(prop) !== -1) return [prop];
    const concreatePropName = headerMap.get(prop);
    const convProp = concreatePropName ? concreatePropName : prop;
    return [convProp].concat(Array.from({ length: floorLen - 1 })).join(',');
  }).join(',') + '\n';
  const timeHeader = "," + _.range(0, header.length).map((i) => {
    if(oneHeaderProp.indexOf(header[i]) !== -1) return ;
    return _.range(0, floorLen).map((t, index) => {
      const startTime = index === 0 ? 0 : (index) * splitTime;
      const endTime = (index + 1) * splitTime;
      return `${startTime} ~${endTime}(${timeStr})`;
    }).join(',')
  }).join(',') + "\n";

  const filepath = `${process.env.PWD}/logs/summary/summary-duration${duration}-split${splitTime}.csv`;

  fs.writeFileSync(filepath, concreateHeader);
  fs.appendFileSync(filepath, timeHeader);
  runnings.forEach(running => { runningStr(running, splitTime, timeStr, floorLen, duration, filepath) });
  if (config.fileopen) app.open(filepath, "/Applications/Microsoft Excel.app/Contents/MacOS/Microsoft Excel");
  console.log(`output > ${filepath}`);
}

function runningStr(running: Running, splitTime, timeStr, floorLen, duration, filepath) {
  const pids = running.metricses.map((metrics) => metrics.process.pid).filter((key, index, arr) => arr.indexOf(key) === index);
  const processDivMetricses = pids.map(pid => running.metricses.filter(metrics => metrics.process.pid === pid));
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
    const propAverageObjectArr = processDivMetricses.map(metricses => convMetrics(metricses));
    propAverageObjectArr.forEach(line => {
      const str = `${running.name}-${running.duration}-${running.arrivalRate}` + "," + header.map(prop => {
      if(oneHeaderProp.indexOf(prop) !== -1 && line[prop]) return line[prop][0];
      if (line[prop]) return line[prop].join(',');
      else return ",";
      }) + "\n";
      fs.appendFileSync(`${process.env.PWD}/logs/summary/summary-duration${duration}-split${splitTime}.csv`, str);
    })
  } catch (err) { console.log(err) }
}