import { Mesure } from '../usecases/mesure';
import { ArtilleryGateway } from '../gateways/loadTest';
import { ReadClientlogFS } from '../gateways/readClientlog';
import { ReadServerlogRequest } from '../gateways/readServerlog';
import { MergeWithServerlogRequest } from '../gateways/mergeWithServerlog';

export default function mesureController(config) {
  const loadTestoutputpath = `${process.env.PWD}/logs/client/${config.logname}.${config.duration}.${config.rate}`;  
  const artillery = new ArtilleryGateway({ path: loadTestoutputpath });
  const readClientlog = new ReadClientlogFS({ path: loadTestoutputpath + '.json'});
  const mergeWithServerlog = new MergeWithServerlogRequest({ path: config.target });
  const mesureUsecase = new Mesure({ loadTestGW: artillery, readClientlogGW: readClientlog, mergeWithServerlogGW: mergeWithServerlog });
  mesureUsecase.run(config);
}
