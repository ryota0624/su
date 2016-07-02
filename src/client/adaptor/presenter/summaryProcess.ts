import * as fs from 'fs';
import * as _ from 'lodash';
import Running from '../../domain/model/running';
import Metrics from '../../domain/model/metrics';
import Computer from '../../domain/model/computer';
import Process from '../../domain/model/process';
import Request from '../../domain/model/request';
import {timeBase, groupedTime, propsLine} from './helper/summaryHelper';

import {DefaultApp, AssignedApp} from '../gateway/externalApp';

let header = ["heapTotal", "heapUsed"];
// const throughProps = ["osFreeMem", "osTotalMem", "la/1min", "la/5min" , "la/15min"];
const primaryProps = ["pid"];
const app = new AssignedApp;

export default function(runnings: Array<Running>, config = { splitTime: 5, timeStr: "sec", duration: 30, throughProps: ["statusCode"] ,fileopen: true }) {
  const filename = `${process.env.PWD}/logs/summary/summary-duration${config.duration}-split${config.splitTime}-process.csv`;
  const { splitTime, timeStr, duration } = config;
  const floorLen = Number((duration / splitTime).toFixed());
  const timeHeader = ",,"+_.range(0, header.length).map(() => _.range(0, floorLen).map((t, index) => {
    const startTime = index === 0 ? 0 : (index) * splitTime;
    const endTime = (index +1) * splitTime;
    return `${startTime} ~${endTime}(${timeStr})`;
  }).join(',')).join(',') + "\n";
  const decHeader = header.map(prop => prop +"/MB");
  const headers = "name,pid," + decHeader.map((prop) => {
    return [prop].concat(Array.from({ length: floorLen -1 })).join(',');
  }).join(',') + '\n';

  fs.writeFileSync(filename, headers);
  fs.appendFileSync(filename, timeHeader);
  runnings.forEach(running => { processStr(running, splitTime, timeStr, floorLen, duration, filename)});
  if(config.fileopen) app.open(filename, "/Applications/Microsoft Excel.app/Contents/MacOS/Microsoft Excel");
  console.log(`output > ${filename}`);
}

function processStr(running: Running, splitTime, timeStr, floorLen, duration, filename) {
  // try {
  //   const filenames = [];
  //   const separateTimeStr = timeBase(timeStr, splitTime);
  //   let headerPropElementNum = null/**ヘッダーの１プロパティごとの数値の数 */
  //   const propAverageObject = running.metricses.map(metrics => {
  //     const formatMetrics = metrics.setCapacityMB();
  //     const splitPidProcesses = formatMetrics.getProcessStatus();

  //     return splitPidProcessProcessStr(splitPidProcesses, separateTimeStr, floorLen);
  //   });
  //   const propStrArr = propAverageObject.map(props => {
  //     const lineName = running.name;
  //     return props.map(prop => {
  //       return `${running.name}-${running.duration}-${running.arrivalRate}` +","+ prop.processes.pid[0] +"," + prop.processes.heapTotal + "," + prop.processes.heapUsed + "\n";
  //     }).join("");
  //   }).join('\n');
  //   fs.appendFileSync(filename, propStrArr);
  // } catch(err) {console.log(err)}
}

const paramsFilter = params => {
  return  { pid: params.pid, "heapTotal": params.heapTotal, "heapUsed": params.heapUsed }
}

function splitPidProcessProcessStr(processArr: Array<{ pid: number, processes: Array<Process> }>, separateTimeStr, floorLen) {
  return processArr.map(processInfo => { 
    const processes = processInfo.processes.map(process => Object.assign({}, process, { relativeTime: Math.floor(process.relativeTime / separateTimeStr) }))
    const filteredParams = groupedTime(processes, { fixed: true });
    return { pid: processInfo.pid, processes: paramsFilter(propsLine(filteredParams, floorLen)) }
  });
}

