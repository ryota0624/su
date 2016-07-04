import * as fs from 'fs';
import * as _ from 'lodash';
import Running from '../../domain/model/running';
import Computer from '../../domain/model/computer';
import Process from '../../domain/model/process';
import Request from '../../domain/model/request';
import Metrics from '../../domain/model/metrics';

const header = ["pid", "osFreeMem", "osTotalMem", "la/1min", "la/5min", "la/15min", "heapTotal", "heapUsed", "responseTime", "statusCode", "relativeTime"];
const headerMap = new Map<string, string>([["osFreeMem", "osFreeMem/mb"], ["osFreeMem", "osFreeMem/mb"], ["relativeTime", "relativeTime/ms"], ["responseTime", "responseTime/ms"], ['heapUsed', "heapUsed/mb"], ['heapTotal', 'heapTotal/mb']] );

import {DefaultApp, AssignedApp} from '../gateway/externalApp';
export default function (runnings: Array<Running>, config?) {
  const app = new AssignedApp;
  const filenames = [];
  const timeformat = config ? config.timeformat : "ss.SSS";
  try {
    runnings.forEach(running => {
      const outputname = `${process.env.PWD}/logs/status/${running.name.replace(/\s/g, "_")}_${running.duration}_${running.arrivalRate}.csv`;
      filenames.push(outputname);
      const metricses = running.metricses;
      const concretaHeader: string = (header.map(propName => {
        const concreatePropName = headerMap.get(propName);
        return  concreatePropName ? concreatePropName : propName;
      }).join(',') + '\n');
    
      fs.writeFileSync(outputname, concretaHeader);
      metricses.forEach(metrics => {
        let m = metrics.setCapacityMB();
        m.request.responseTime = Math.ceil(m.request.responseTime / 10000) / 100;
        fs.appendFileSync(outputname, parse(m));
      });
      if (config.spreadSheetSoftwarePath) {
        app.open(outputname, config.spreadSheetSoftwarePath);
      }
    })
  } catch (err) {console.log(err)}  
}

function parse(metrics: Metrics) {
  const line = Object.assign({}, metrics.computer, metrics.request, metrics.process);
  const element = header.map(prop => line[prop]);
  return element.join(',') + "\n";
}