import "reflect-metadata";

import { Kernel } from 'inversify';
import { LoadTestGateway } from './domain/usecase/interface/loadTest';
import { ArtilleryGateway } from './adaptor/gateway/loadTest';
const kernel = new Kernel;
kernel.bind<ArtilleryGateway>("LoadTestGateway").to(ArtilleryGateway);

export default kernel;

// console.log(kernel.get<LoadTestGateway>("LoadTestGateway"))