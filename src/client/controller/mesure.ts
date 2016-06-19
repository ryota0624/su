import { Mesure } from '../usecases/mesure';
import { ArtilleryGateway } from '../gateway/loadTest';
import { ReadClientlogFS } from '../gateway/readClientlog';
import { ReadServerlogRequest } from '../gateway/readServerlog';
import { MergeWithServerlogRequest } from '../gateway/mergeWithServerlog';

export default function mesureController(config, repo) {
  const loadTestoutputpath = `${process.env.PWD}/logs/client/${config.logname}.${config.duration}.${config.rate}`;  
  const artillery = new ArtilleryGateway({ path: loadTestoutputpath });
  const readClientlog = new ReadClientlogFS({ path: loadTestoutputpath + '.json'});
  const mergeWithServerlog = new MergeWithServerlogRequest({ path: config.target });
  const mesureUsecase = new Mesure({ processStatusRepo: repo ,loadTestGW: artillery, readClientlogGW: readClientlog, mergeWithServerlogGW: mergeWithServerlog });
  mesureUsecase.run(config);
}
