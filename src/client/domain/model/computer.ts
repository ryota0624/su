export default class Computer {
  'la/1min': number;
  'la/5min': number;
  'la/15min': number;
  osFreeMem: number;
  osTotalMem: number;
  relativeTime: number;
  constructor(param = defaultParams) {
    this.relativeTime = param.relativeTime;
    this.osFreeMem = param.osFreeMem;
    this.osTotalMem = param.osTotalMem;
    this['la/1min'] = param['la/1min'];
    this['la/5min'] = param['la/5min'];
    this['la/15min'] = param['la/15min'];
  }
}

const defaultParams = {
  relativeTime: 0,
  osFreeMem: 0,
  osTotalMem: 0,
  'la/1min': 0,
  'la/5min': 0,
  'la/15min': 0,
}

export function createComputer(param: {'la/1min': number;
  'la/5min': number;
  'la/15min': number;
  osFreeMem: number;
  osTotalMem: number;
  relativeTime: number;}) {
    return new Computer(param);
}