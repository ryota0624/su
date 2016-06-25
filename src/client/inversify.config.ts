import "reflect-metadata";

import { Kernel } from 'inversify';

import { ArtilleryGateway } from './adaptor/gateway/loadTest';
import { ReadClientlogFS } from './adaptor/gateway/readClientlog';
import { ReadServerlogRequest } from './adaptor/gateway/readServerlog';

import { MesureUsecase } from './domain/usecase/mesure';

const kernel = new Kernel;

kernel.bind<ArtilleryGateway>("LoadTestGateway").to(ArtilleryGateway);
kernel.bind<ReadClientlogFS>("Clientlog").to(ReadClientlogFS);
kernel.bind<ReadServerlogRequest>("Serverlog").to(ReadServerlogRequest);

kernel.bind<MesureUsecase>("MesureUsecaseI").to(MesureUsecase);
export default kernel;
