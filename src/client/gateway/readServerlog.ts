import { csvToArray } from '../../utils/csv';
import { getPromise } from '../../utils/request';
import { promiseReadFile } from '../../utils/promiseFs';

import { GetServerStatus } from '../usecases/interface/getServerStatus';


export class ReadServerlogRequest implements GetServerStatus {
  run({ path }) {
    return getPromise(path + '/suty/log').then(res => csvToArray(res.toString()));
  }
}

export class ReadServerlogFS implements GetServerStatus {
  run({ path }) {
    return promiseReadFile(path).then(res => csvToArray(res.toString()));
  }
}

// const r = new ReadServerlogRequest
// r.run({ path: "http://localhost:3333/suty/log" }).then(rs => console.log(rs))
// const r = new ReadServerlogFS
// r.run({ path: process.env.PWD + '/logs/server/date.3.30.csv' }).then(rs => console.log(rs))