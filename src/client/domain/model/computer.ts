import * as moment from 'moment';
export default class Computer {
  'la/1min': number;
  'la/5min': number;
  'la/15min': number;
  osFreeMem: number;
  osTotalMem: number;
  relativeTime: number;
  mid: number;
  constructor(param = defaultParams) {
    this.mid = param.mid;
    this.relativeTime = Number(param.relativeTime);
    this.osFreeMem = Number(param.osFreeMem);
    this.osTotalMem = Number(param.osTotalMem);
    this['la/1min'] = Number(param['la/1min']);
    this['la/5min'] = Number(param['la/5min']);
    this['la/15min'] = Number(param['la/15min']);
  }
  setTimeFormat(format:string) {
    const formatedTime = moment(Number(this.relativeTime)).format(format);
    return new Computer(Object.assign({}, this, { relativeTime: formatedTime }));
  }
  setCapacity(str: string /** mb, kb */) {
    let divied = 1024;
    if(str === "mb") {
      divied = divied * 1024;
    }
    const osFreeMem = Math.floor(this.osFreeMem / divied);
    const osTotalMem = Math.floor(this.osTotalMem / divied);
    return new Computer(Object.assign({}, this, { osFreeMem, osTotalMem }));
  }
}

const defaultParams = {
  relativeTime: 0,
  osFreeMem: 0,
  osTotalMem: 0,
  'la/1min': 0,
  'la/5min': 0,
  'la/15min': 0,
  mid: 0,
}

export function createComputer(param: {
  'la/1min': number;  
  'la/5min': number;
  'la/15min': number;
  osFreeMem: number;
  osTotalMem: number;
  relativeTime: number;
  mid: number;
}) {
    return new Computer(param);
}