import * as fs from 'fs';
import * as _ from 'lodash';
import Running from '../../domain/model/running';
import Computer from '../../domain/model/computer';
import Process from '../../domain/model/process';
import Request from '../../domain/model/request';
export default function (runnings: Array<Running>, config?) {
  const filenames = [];
  runnings.forEach(running => {
    const outputname = `${process.env.PWD}/logs/status/${running.name}_${running.duration}_${running.arrivalRate}.csv`;
    filenames.push(outputname);
    const metricses = running.metricses;
    fs.writeFileSync(outputname, header.join(',') + '\n');
    metricses.forEach(metrics => {
      const m = metrics.setTimeFormat(config.timeFormat);
      const zipedMetrics = _.zip<Computer | Process | Request>(m.computers, m.processes, m.requests);
      const line = zipedMetrics.map(ziped => Object.assign({}, ziped[0], ziped[1], ziped[2]));
      line.forEach(i => fs.appendFileSync(outputname, parse(i)));
    });
  })
}

const header = ["pid", "osFreeMem", "osTotalMem", "la/1min", "la/5min", "la/15min", "heapTotal", "heapUsed", "responseTime", "statusCode", "relativeTime"];

function parse(line: {} | Computer & Process & Request) {
  const element = header.map(prop => line[prop]);
  return element.join(',') + "\n";
}