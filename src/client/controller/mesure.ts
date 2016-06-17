import { Mesure } from '../usecases/mesure';
import { ArtilleryGateway } from '../gateways/loadTest';
import { ReadClientlogFS } from '../gateways/readClientlog';
import { ReadServerlogRequest } from '../gateways/readServerlog';
export default function mesureController(config) {
  const artillery = new ArtilleryGateway;
  const readClientlog = new ReadClientlogFS;
  const readServerlog = new ReadServerlogRequest;
  const mesureUsecase = new Mesure({ loadTestGW: artillery, readClientlogGW: readClientlog, readServerlogGW: readServerlog });
  mesureUsecase.run(config);
}
