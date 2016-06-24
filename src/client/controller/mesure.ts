import { Mesure } from '../usecases/mesure';
import { SutyClientConfig } from '../usecases/interface/loadTest'
import { ArtilleryGateway }from '../gateway/loadTest';
import { ReadClientlogFS } from '../gateway/readClientlog';
import { MergeWithServerlogRequest } from '../gateway/mergeWithServerlog';
import { ProcessStatusRepoFS } from '../repository/processStatus';


export default function mesureController(config: SutyClientConfig) {
  const mesureUsecase = new Mesure({ 
    loadTestGW: new ArtilleryGateway,
    readClientlogGW: new ReadClientlogFS,
    processStatusRepo: new ProcessStatusRepoFS,
    mergeWithServerlogGW: new MergeWithServerlogRequest  });
  mesureUsecase.run(config).then(() => console.log('done'))
}