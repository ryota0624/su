import "reflect-metadata";

import { Kernel } from 'inversify';

import { ArtilleryGateway } from './adaptor/gateway/loadTest';
import { ReadClientlogFS } from './adaptor/gateway/readClientlog';
import { ReadServerlogRequest, ReadServerlogFS } from './adaptor/gateway/readServerlog';
import { RunningRepositoryFS } from './adaptor/repository/runningRepository';
import { DefaultApp, AssignedApp } from './adaptor/gateway/externalApp';

import { MesureUsecase } from './domain/usecase/mesure';
import { OnlyAttackUsecase } from './domain/usecase/onlyAttack';
import {  SummaryUsecase } from './domain/usecase/summary';
import { ReadServerStatUsecase, ReadServerStatUsecaseI } from './domain/usecase/readServerStat';

import { LoadTestGateway } from './domain/interface/loadTest';
const kernel = new Kernel;

kernel.bind<ArtilleryGateway>(LoadTestGateway.interfaceName).to(ArtilleryGateway);
kernel.bind<ReadClientlogFS>("Clientlog").to(ReadClientlogFS);
kernel.bind<ReadServerlogRequest>("Serverlog").to(ReadServerlogRequest);
kernel.bind<ReadServerlogFS>("ServerlogLocal").to(ReadServerlogFS);
kernel.bind<AssignedApp>("ExternalApp").to(AssignedApp);

kernel.bind<RunningRepositoryFS>("RunningRepository").to(RunningRepositoryFS).inSingletonScope();

kernel.bind<ReadServerStatUsecase>("ReadServerStatUsecaseI").to(ReadServerStatUsecase);
kernel.bind<SummaryUsecase>("SummaryUsecaseI").to(SummaryUsecase)
kernel.bind<MesureUsecase>("MesureUsecaseI").to(MesureUsecase);
kernel.bind<OnlyAttackUsecase>("OnlyAttackUsecaseI").to(OnlyAttackUsecase);
export default kernel;
