import "reflect-metadata";

import { Kernel } from 'inversify';

import { ArtilleryGateway } from './adaptor/gateway/loadTest';
import { ReadClientlogFS } from './adaptor/gateway/readClientlog';
import { ReadServerlogRequest } from './adaptor/gateway/readServerlog';
import { RunningRepositoryFS } from './adaptor/repository/runningRepository';


import { MesureUsecase } from './domain/usecase/mesure';
import { OnlyAttackUsecase } from './domain/usecase/onlyAttack';
import { LoadTestGateway } from './domain/interface/loadTest';
const kernel = new Kernel;

kernel.bind<ArtilleryGateway>(LoadTestGateway.interfaceName).to(ArtilleryGateway);
kernel.bind<ReadClientlogFS>("Clientlog").to(ReadClientlogFS);
kernel.bind<ReadServerlogRequest>("Serverlog").to(ReadServerlogRequest);
kernel.bind<RunningRepositoryFS>("RunningRepository").to(RunningRepositoryFS);

kernel.bind<MesureUsecase>("MesureUsecaseI").to(MesureUsecase);
kernel.bind<OnlyAttackUsecase>("OnlyAttackUsecaseI").to(OnlyAttackUsecase);
export default kernel;
