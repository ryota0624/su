import * as fs from 'fs';
import * as _ from 'lodash';
import Running from '../../domain/model/running';
import Computer from '../../domain/model/computer';
import Process from '../../domain/model/process';
import Request from '../../domain/model/request';

import {DefaultApp} from '../gateway/externalApp';
export default function (runnings: Array<Running>, config?) {
  const app = new DefaultApp;
  const filenames = [];
  const timeformat = config ? config.timeformat : "ss.SSS";
  const cap = config.cap || "kb";
  runnings.forEach(running => {
    const outputname = `${process.env.PWD}/logs/status/${running.name.replace(/\s/g,"_")}_${running.duration}_${running.arrivalRate}.csv`;
    filenames.push(outputname);
    const metricses = running.metricses;
    const concretaHeader: string = (header.map(propName => {
      if(willReplaceHeader.indexOf(propName) !== -1) {
        return propName + "/" + cap;
      } else {
        return propName;
      }
    }).join(',') + '\n');
    fs.writeFileSync(outputname, concretaHeader);
    metricses.forEach(metrics => {
      const m = cap === "mb" ? metrics.setTimeFormat(timeformat).setCapacityMB() : metrics.setTimeFormat(timeformat).setCapacityKB() ;
      const zipedMetrics = _.zip<Computer | Process | Request>(m.computers, m.processes, m.requests);
      const line = zipedMetrics.map(ziped => Object.assign({}, ziped[0], ziped[1], ziped[2]));
      line.forEach(i => fs.appendFileSync(outputname, parse(i)));
    });
    if(config.spreadSheetSoftwarePath) {
      app.open(outputname);
    }
  })
}

const header = ["pid", "osFreeMem", "osTotalMem", "la/1min", "la/5min", "la/15min", "heapTotal", "heapUsed", "responseTime", "statusCode", "relativeTime"];
const willReplaceHeader = ["osFreeMem", "osTotalMem", "heapTotal", "heapUsed"];
function parse(line: {} | Computer & Process & Request) {
  const element = header.map(prop => line[prop]);
  return element.join(',') + "\n";
}