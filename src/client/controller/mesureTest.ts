import { Mesure } from '../usecases/mesure';
import { MockLoadTest } from '../gateways/loadTest';
import { ReadClientlogFS } from '../gateways/readClientlog';
import { ReadServerlogRequest } from '../gateways/readServerlog';
import { MergeWithServerlogRequest, MergeWithServerlogFS } from '../gateways/mergeWithServerlog';

export default function mesureController(config) {
  const artillery = new MockLoadTest({ path: process.env.PWD + '/logs/client/date.3.30.json'});
  const readClientlog = new ReadClientlogFS({ path: process.env.PWD + '/logs/client/date.3.30.json'});
  const mergeWithServerlog = new MergeWithServerlogFS({ path: process.env.PWD + '/logs/server/date.3.30.csv'});
  const mesureUsecase = new Mesure({ loadTestGW: artillery, readClientlogGW: readClientlog, mergeWithServerlogGW: mergeWithServerlog });
  
  mesureUsecase.run(config);
}
