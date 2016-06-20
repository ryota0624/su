export default class ServerState {
  pid: number;
  relativeTime: number;
  rss: number;
  heapUsed: number;
  heapTotal: number;
  osFreeMem: number;
  osTotalMem: number;
  'la/1min': number;
  'la/5min': number;
  'la/15min': number;
  constructor(args = defaultParams) {
    this.pid = args.pid;
    this.relativeTime = args.relativeTime;
    this.rss = args.rss;
    this.heapUsed = args.heapUsed;
    this.heapTotal = args.heapTotal;
    this.osFreeMem = args.osFreeMem;
    this.osTotalMem = args.osTotalMem;
    this['la/1min'] = args['la/1min'];
    this['la/5min'] = args['la/5min'];
    this['la/15min'] = args['la/15min'];
  }
}
const defaultParams = {
  pid: 0,
  relativeTime: 0,
  rss: 0,
  heapUsed: 0,
  heapTotal: 0,
  osFreeMem: 0,
  osTotalMem: 0,
  'la/1min': 0,
  'la/5min': 0,
  'la/15min': 0,
}
export function createEmptyServerState() {
  return new ServerState;
}