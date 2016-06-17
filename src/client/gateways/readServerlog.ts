import { csvToArray } from '../../utils/csv';
import { getPromise } from '../../utils/request';;
interface Serverlog {
 pid: number;
 time: number;
 rss: number;
 processMemoryCur: number;
 processMemoryMax: number;
 pcMemoryCur: number;
 pcMemoryMax: number;
 loadAverage1: number;
 loadAverage5: number;
 loadAverage15: number;
}

export interface ReadServerlog {
  run({ path: number }): Promise<Array<Serverlog>>;
}

export class ReadServerlogRequest implements ReadServerlog {
  run({ path }) {
    return getPromise(path).then(res => csvToArray(res.toString()));
  }
}

// const r = new ReadServerlogRequest
// r.run({ path: "http://localhost:3333/suty/log" }).then(rs => console.log(rs))